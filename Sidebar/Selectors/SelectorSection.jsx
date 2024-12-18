import styled from "styled-components";
import { useMapContext, useFilterContext } from "hooks";
import { AccordionSection } from "../Accordion";
import { Dropdown } from "./Dropdown";
import { SelectorLabel } from "./SelectorLabel";
import { Slider } from "./Slider";
import { Toggle } from "./Toggle";
import { AppContext } from 'contexts';
import { useContext } from "react";
import { MapFeatureSelect, MapFeatureSelectWithControls } from './MapFeatureSelect';
import { CheckboxSelector, MapFeatureSelectAndPan } from ".";

const SelectorContainer = styled.div`
  margin-bottom: 10px;
`;

const NoDataParagraph = styled.p``;
const NoDataParagraphMessage = styled.p`
  color: red;
  `;
const DiffParagraph = styled.p``;
const TrseParagraph = styled.p`
  color: red;`;

/**
 * Checks if the geometry property is not null for each feature in the provided feature collection.
 * @param {Object} featureCollection - The GeoJSON feature collection to be checked.
 * @returns {boolean} Returns true if the geometry is not null for all features, otherwise false.
 */
function checkGeometryNotNull(featureCollection) {
  // Check if the feature collection is provided
  if (
    !featureCollection ||
    !featureCollection.features ||
    featureCollection.features.length === 0
  ) {
    return false; // Return false if the feature collection is empty or undefined
  }

  // Iterate through each feature in the feature collection
  for (let feature of featureCollection.features) {
    // Check if the geometry property exists and is not null
    if (!feature.geometry || feature.geometry === null) {
      return false; // Return false if geometry is null for any feature
    }
  }

  return true; // Return true if geometry is not null for all features
}

/**
 * Renders a section containing filter selectors for filtering and data selection.
 * @property {Object[]} filters - An array of filter objects containing information about the filters to be rendered.
 * @property {Function} onFilterChange - The function called when a filter value changes.
 * @returns {JSX.Element} The rendered SelectorSection component.
 */
export const SelectorSection = ({ filters, onFilterChange, bgColor }) => {
  const { state: mapState } = useMapContext();
  const { state: filterState } = useFilterContext();

  const handleFilterChange = (filter, value) => {
    onFilterChange(filter, value);
  };

  const noDataAvailable = mapState.noDataReturned;
  const dataRequested = mapState.dataRequested;
  const noDataMessage =
    "No data available for the selected filters, please try different filters.";
  
  const appContext = useContext(AppContext);
  const appName = process.env.REACT_APP_NAME;
  const currentPage = appContext.appPages.find((page) => page.url === window.location.pathname);
  const DiffPage = currentPage.pageName.includes("Difference") && appName === "noham"
  const trsePage = currentPage.pageName.includes("Authority") && appName == "trse"

  const DiffPageMessage = 
    "The difference is calculated by Scenario 2 minus Scenario 1."
  const trsePageMessage = "Type an area in the box below to view data."
    return (
      <AccordionSection title="Filtering and data selection" defaultValue={true}>
      {DiffPage && <DiffParagraph>{DiffPageMessage}</DiffParagraph>}
      {trsePage && (<TrseParagraph><b>{trsePageMessage}</b></TrseParagraph>)}
        {Array.isArray(filters) && filters.length > 0 ? (
          filters
            .filter((filter) => filter.type !== "fixed") // Exclude 'fixed' filters
            .map((filter) => (
              <SelectorContainer key={filter.id}>
                <SelectorLabel
                  htmlFor={filter.paramName}
                  text={filter.filterName}
                  info={filter.info ?? null}
                />
                {filter.type === "dropdown" && (
                  <Dropdown
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id]}
                    onChange={(filter, value) => handleFilterChange(filter, value)}
                  />
                )}
                {filter.type === "slider" && (
                  <Slider
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id] || filter.min || filter.values[0]}
                    onChange={(filter, value) => handleFilterChange(filter, value)}
                  />
                )}
                {filter.type === "toggle" && (
                  <Toggle
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id] || filter.values.values[0].paramValue}
                    onChange={(filter, value) => handleFilterChange(filter, value)}
                    bgColor={bgColor}
              />
            )}
            {filter.type === "checkbox" && (
                  <CheckboxSelector
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id] || filter.values.values[0].paramValue}
                    onChange={(filter, value) => handleFilterChange(filter, value)}
                    bgColor={bgColor}
              />
            )}
            {filter.type === 'mapFeatureSelect' && (
              <MapFeatureSelect
                key={filter.id}
                filter={filter}
                value={filterState[filter.id]}
                onChange={(filter, value) => handleFilterChange(filter, value)}
                bgColor={bgColor}
            />
            )}
            {filter.type === 'mapFeatureSelectWithControls' && (
              <MapFeatureSelectWithControls
                key={filter.id}
                filter={filter}
                value={filterState[filter.id]}
                onChange={(filter, value) => handleFilterChange(filter, value)}
                bgColor={bgColor}
            />
            )}
            {filter.type === 'mapFeatureSelectAndPan' && (
              <MapFeatureSelectAndPan
                key={filter.id}
                filter={filter}
                value={filterState[filter.id]}
                onChange={(filter, value) => handleFilterChange(filter, value)}
                bgColor={bgColor}
            />
            )}
          </SelectorContainer>
        ))
      ) : (
        <NoDataParagraph>Loading filters...</NoDataParagraph>
      )}
      {/* Check if no data has been found and display a small message in the sidebar if so */}
      {dataRequested && noDataAvailable && (
        <NoDataParagraphMessage>{noDataMessage}</NoDataParagraphMessage>
      )}
    </AccordionSection>
  );
};