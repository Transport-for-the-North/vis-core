import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { MapLayout, IFrameEmbedPage, DynamicForm, CoordinatePreviewMap } from "Components";
import { FilterProvider, MapProvider, PageContext } from "contexts";
import { bngToWgs84 } from "../../utils/coordinates";

const FormPageWrapper = styled.div`
  display: flex;
  height: calc(100vh - 75px);
  overflow: hidden;
  justify-content: ${props => props.$centered ? 'center' : 'flex-start'};
  background: ${props => props.$centered ? '#fafafa' : 'transparent'};
  
  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 75px);
    justify-content: flex-start;
  }
`;

const FormPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
  width: ${props => props.$centered ? '600px' : '480px'};
  min-width: ${props => props.$centered ? '400px' : '400px'};
  max-width: ${props => props.$centered ? '700px' : '520px'};
  background: ${props => props.$centered ? '#fff' : '#fafafa'};
  border-right: ${props => props.$centered ? 'none' : '1px solid #e5e5e5'};
  border-radius: ${props => props.$centered ? '12px' : '0'};
  box-shadow: ${props => props.$centered ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none'};
  margin: ${props => props.$centered ? '32px 0' : '0'};
  overflow-y: auto;
  flex-shrink: 0;
  
  @media (max-width: 1024px) {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    border-right: none;
    border-bottom: ${props => props.$centered ? 'none' : '1px solid #e5e5e5'};
    border-radius: ${props => props.$centered ? '0' : '0'};
    box-shadow: none;
    margin: 0;
    overflow-y: visible;
    flex-shrink: 1;
  }
`;

const MapPreviewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: #fff;
  min-width: 0;
  overflow: hidden;
  
  @media (max-width: 1024px) {
    min-height: 350px;
    flex: none;
  }
`;

const MapPreviewTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #444;
  margin: 0 0 12px 0;
  flex-shrink: 0;
`;

const MapPreviewWrapper = styled.div`
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  min-height: 0;
`;

const FormPageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #222;
  margin: 0 0 8px 0;
`;

const FormPageDescription = styled.p`
  font-size: 0.95rem;
  color: #555;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;
import { DirectoryScorecardsPage } from "Components";

/**
 * FormPageContent - Internal component that manages form state and map preview
 */
const FormPageContent = ({ pageConfig }) => {
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [mapClickedCoords, setMapClickedCoords] = useState(null);
  const [bngCoords, setBngCoords] = useState({ easting: '', northing: '' });
  
  // Check if using BNG coordinate system
  const isBngMode = pageConfig.config?.coordinateSystem === 'BNG';
  const eastingFieldId = pageConfig.config?.formConfig?.fields?.find(
    (f) => f.name === 'easting' || f.id === 'easting'
  )?.id;
  const northingFieldId = pageConfig.config?.formConfig?.fields?.find(
    (f) => f.name === 'northing' || f.id === 'northing'
  )?.id;
  
  const handleCoordinateChange = useCallback((newCoords) => {
    // For regular lat/lng coordinate changes
    if (!isBngMode) {
      setCoordinates(newCoords);
    }
  }, [isBngMode]);
  
  // Handle BNG coordinate changes from form
  const handleBngCoordinateChange = useCallback((fieldId, value) => {
    setBngCoords(prev => {
      const newCoords = { ...prev };
      if (fieldId === eastingFieldId || fieldId === 'easting') {
        newCoords.easting = value;
      } else if (fieldId === northingFieldId || fieldId === 'northing') {
        newCoords.northing = value;
      }
      return newCoords;
    });
  }, [eastingFieldId, northingFieldId]);
  
  // Convert BNG to WGS84 when BNG coordinates change
  useEffect(() => {
    if (!isBngMode) return;
    
    if (bngCoords.easting && bngCoords.northing) {
      const wgs84 = bngToWgs84(bngCoords.easting, bngCoords.northing);
      if (wgs84) {
        setCoordinates(wgs84);
      }
    } else {
      setCoordinates({ lat: '', lng: '' });
    }
  }, [bngCoords.easting, bngCoords.northing, isBngMode]);
  
  const handleMapClick = useCallback((clickedCoords) => {
    // Update coordinates from map click (only when not in BNG mode)
    if (!isBngMode) {
      setMapClickedCoords(clickedCoords);
      setCoordinates(clickedCoords);
    }
  }, [isBngMode]);
  
  // Callback to capture form field changes for BNG mode
  const handleFormFieldChange = useCallback((fieldId, value) => {
    if (isBngMode && (fieldId === eastingFieldId || fieldId === northingFieldId ||
        fieldId === 'easting' || fieldId === 'northing')) {
      handleBngCoordinateChange(fieldId, value);
    }
  }, [isBngMode, eastingFieldId, northingFieldId, handleBngCoordinateChange]);
  
  const showMapPreview = pageConfig.config?.showMapPreview !== false;
  const enableClickToSelect = !isBngMode && pageConfig.config?.enableClickToSelect !== false;
  
  // Determine map title
  const getMapTitle = () => {
    if (isBngMode) {
      return 'Site Location Preview';
    }
    return 'Location Preview';
  };
  
  return (
    <FormPageWrapper $centered={!showMapPreview}>
      <FormPageContainer $centered={!showMapPreview}>
        {pageConfig.pageTitle && (
          <FormPageTitle>{pageConfig.pageTitle}</FormPageTitle>
        )}
        {pageConfig.pageDescription && (
          <FormPageDescription>{pageConfig.pageDescription}</FormPageDescription>
        )}
        <DynamicForm
          config={pageConfig.config.formConfig}
          bgColor={pageConfig.config.bgColor}
          onSubmitSuccess={pageConfig.config.onSubmitSuccess}
          onSubmitError={pageConfig.config.onSubmitError}
          onCoordinateChange={handleCoordinateChange}
          externalCoordinates={mapClickedCoords}
          onFieldChange={handleFormFieldChange}
        />
      </FormPageContainer>
      {showMapPreview && (
        <MapPreviewContainer>
          <MapPreviewTitle>{getMapTitle()}</MapPreviewTitle>
          <MapPreviewWrapper>
            <CoordinatePreviewMap
              lat={coordinates.lat}
              lng={coordinates.lng}
              height="100%"
              zoom={pageConfig.config?.mapPreviewZoom || 13}
              markerColor={pageConfig.config?.bgColor || '#dc2626'}
              clickToSelect={enableClickToSelect}
              onMapClick={handleMapClick}
            />
          </MapPreviewWrapper>
        </MapPreviewContainer>
      )}
    </FormPageWrapper>
  );
};

/**
 * PageSwitch component dynamically renders different page layouts based on the provided page configuration.
 * It switches between different page types and renders the corresponding components.
 * @component
 * @param {object} pageConfig - The configuration object for the page, containing information about the type of page to render.
 * @property {string} pageConfig.type - The type of page layout to render.
 * @returns {JSX.Element} The rendered PageSwitch component.
 */
export const PageSwitch = ({ pageConfig }) => {
  return (
    <PageContext.Provider value={pageConfig}>
      {(() => {
        switch (pageConfig.type) {
          case "DualMapLayout":
          case "MapLayout":
            return (
              <FilterProvider>
                <MapProvider>
                  <MapLayout />
                </MapProvider>
              </FilterProvider>
            );
          case "IFrameEmbed":
            return <IFrameEmbedPage config={pageConfig.config} />;
          case "FormPage":
            return <FormPageContent pageConfig={pageConfig} />;
          default:
            return <div>Nothing</div>;
        }
      })()}
    </PageContext.Provider>
  );
};
