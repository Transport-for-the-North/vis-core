import styled from "styled-components";
import { useMapContext, useFilterContext } from "hooks";
import { InfoBox, WarningBox } from "Components";
import { AccordionSection } from "../Accordion";
import { Dropdown } from "./Dropdown";
import { SelectorLabel } from "./SelectorLabel";
import { Slider } from "./Slider";
import { Toggle } from "./Toggle";
import { AppContext } from "contexts";
import { useState, useContext, useEffect } from "react";
import { MapFeatureSelect, MapFeatureSelectWithControls } from "./MapFeatureSelect";
import { CheckboxSelector, MapFeatureSelectAndPan } from ".";
import { api } from "services";
import { darken } from "polished";
import { checkSecurityRequirements } from "utils";

const ButtonRow = styled.div`
  display: flex;
  gap: 10px; /* Adds space between the buttons */
`;

const DownloadButton = styled.button`
  cursor: pointer;
  padding: 10px 5px; /* Increased padding for a larger button */
  background-color: ${(props) => props.$bgColor}; /* Access the $bgColor prop */
  color: white;
  border-radius: 8px;
  border: 0.25px solid;
  width: 50%;
  font-family: "Hanken Grotesk", sans-serif;
  display: flex;
  align-items: center; /* Center align items vertically */
  justify-content: center;
  
  &:hover {
    background-color: ${(props) => darken(0.1, props.$bgColor)}; /* Darken the background color by 10% */
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    background-color: ${(props) => darken(0.2, props.$bgColor)};
  }
`;

const Spinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  animation: spin 1s linear infinite;
  margin-left: 5px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SelectorContainer = styled.div`
  margin-bottom: 10px;
`;

const NoDataParagraph = styled.p``;

/**
 * Renders a section containing filter selectors for filtering and data selection.
 * @property {Object[]} filters - An array of filter objects containing information about the filters to be rendered.
 * @property {Function} onFilterChange - The function called when a filter value changes.
 * @returns {JSX.Element} The rendered SelectorSection component.
 */
export const SelectorSection = ({ filters, onFilterChange, bgColor, downloadPath, downloadShapefilePath, requestMethod = 'GET' }) => {
  const appContext = useContext(AppContext);
  const { state: mapState } = useMapContext();
  const { state: filterState } = useFilterContext();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isShapefileDownloading, setIsShapefileDownloading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [isRequestTooLarge, setIsRequestTooLarge] = useState(false);

  const isViewportFilter = (filter) => filter?.type === "mapViewport" || filter?.paramName === "viewport";

  const apiSchema = appContext.apiSchema;
  const apiRoute = downloadPath;
  const requiresAuth = checkSecurityRequirements(apiSchema, apiRoute);

  const apiRouteShapefile = downloadShapefilePath;
  const requiresAuthShapefile = checkSecurityRequirements(apiSchema, apiRouteShapefile);

  const handleFilterChange = (filter, value) => {
    onFilterChange(filter, value);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setRequestError(null);

    const queryParams = {};
    filters.forEach(filter => {
      if (!["fixed", "hidetoggle", "mapViewport"].includes(filter.type) && filter.paramName && !isViewportFilter(filter)) {
        queryParams[filter.paramName] = filterState[filter.id];
      }
    });
    
    try {
      await api.downloadService.downloadFile(apiRoute, {
        queryParams: queryParams,
        skipAuth: !requiresAuth,
        method: requestMethod,
      });
      console.log('CSV downloaded successfully');
      // window.clarity('set', 'download_data_clicked', true);
      window.clarity('event', 'download_data_clicked');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      setRequestError(error.message || "Error downloading data");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShapefileDownload = async () => {
    setIsShapefileDownloading(true);
    setRequestError(null);

    const queryParams = {};
    filters.forEach(filter => {
      if (!["fixed", "mapViewport"].includes(filter.type) && filter.paramName && !isViewportFilter(filter)) {
        queryParams[filter.paramName] = filterState[filter.id];
      }
    });
    
    try {
      await api.downloadService.downloadFile(apiRouteShapefile, {
        queryParams: queryParams,
        skipAuth: !requiresAuthShapefile,
        method: requestMethod,
      });
      console.log('Shapefile downloaded successfully');
      window.clarity('event', 'download_shapefile_clicked');
    } catch (error) {
      console.error('Error downloading Shapefile:', error);
      setRequestError(error.message || "Error downloading Shapefile");
    } finally {
      setIsShapefileDownloading(false);
    }
  };

  const noDataAvailable = mapState.noDataReturned;
  const dataRequested = mapState.dataRequested;
  const noDataMessage =
    "No data available for the selected filters, please try different filters.";

  const appName = import.meta.env.VITE_APP_NAME;
  const currentPage = appContext.appPages.find(
    (page) => page.url === window.location.pathname
  );
  const isDiffPage =
    currentPage.pageName.includes("Difference") && appName === "noham";
  const isTrsePage =
    currentPage.pageName.includes("Authority") && appName === "trse";

  const diffPageMessage = "The difference is calculated by Scenario 2 minus Scenario 1.";
  const trsePageMessage = "Type an area in the box below to view data.";

  // Filter for all filters of type 'map' that have a filterName.
  const mapFilters = Array.isArray(filters)
    ? filters.filter((filter) => filter.type === "map" && filter.filterName && !isViewportFilter(filter))
    : [];

 /**
 * Initialise "hidetoggle" filters with their default values.
 *
 * This effect runs whenever `filters`, `filterState` or `onFilterChange` change.
 * It looks for filters whose `type` is `"hidetoggle"` and, if a filter does not
 * yet have a value in `filterState`, it applies the filter's first configured
 * `paramValue` as its initial value by calling `onFilterChange`.
 *
 * This ensures that hide-toggle filters always start in a consistent, defined
 * state without overwriting any value that has already been chosen by the user.
 */

  useEffect(() => {
    if (!Array.isArray(filters)) return;

    filters
      .filter((f) => f.type === "hidetoggle")
      .forEach((filter) => {
        const values = filter.values?.values ?? [];
        const currentValue = filterState[filter.id];
        const defaultValue = values[0]?.paramValue;

        const currentStillValid = currentValue !== undefined && values.some((v) => v.paramValue === currentValue);

        // Only initialise if we don't already have a value
        if ((!currentStillValid) && defaultValue !== undefined) {
          onFilterChange(filter, defaultValue);
        }
      });
  }, [filters, filterState, onFilterChange]);

  useEffect(() => {
    if (!Array.isArray(filters)) return;

    const runCodeFilter = filters.find((f) => f.paramName === "runCodeId");
    const networkFilter = filters.find((f) => f.paramName === "networkId");
    if (!runCodeFilter || !networkFilter) return;

    // runCodeId stores the run_id 
    const selectedRunId = filterState[runCodeFilter.id];
    if (selectedRunId === undefined || selectedRunId === null) return;

    // Find the selected option in runCodeId options to get its displayValue
    const runOptions = runCodeFilter.values?.values ?? [];
    const selectedOption = runOptions.find(
      (o) => String(o.paramValue) === String(selectedRunId)
    );

    const label = selectedOption?.displayValue;
    if (!label) return;

    // Extract the network scenario from the selector filter
    const match = label.match(/\(\s*\d+\s*,\s*([^,]+)\s*,/);
    const nextNetwork = match?.[1]?.trim();
    if (!nextNetwork) return;

    const currentNetwork = filterState[networkFilter.id];
    console.log("[sync networkId] runCodeId =", selectedRunId, "| derived =", nextNetwork);
    if (currentNetwork !== nextNetwork) {
      console.log("[sync networkId] updating:", currentNetwork, "→", nextNetwork);
      onFilterChange(networkFilter, nextNetwork);
    }
  }, [filters, filterState, onFilterChange]);


  return (
    <AccordionSection title="Filtering and data selection" defaultValue={true}>
      {/* Display a warning message if no data is available - sticky at top */}
      {dataRequested && noDataAvailable && (
        <WarningBox text={noDataMessage} isSticky={true} />
      )}
      
      {isDiffPage && <InfoBox text={diffPageMessage} />}
      {isTrsePage && <InfoBox text={trsePageMessage} />}

      {/* Render an InfoBox for each map filter */}
      {mapFilters.map((filter) => (
        <InfoBox key={filter.id} text={filter.filterName} />
      ))}

      {Array.isArray(filters) && filters.length > 0 ? (
        <>
          {filters
            .filter((filter) => !["fixed", "hidetoggle", "mapViewport"].includes(filter.type) && !isViewportFilter(filter))
            .map((filter) => (
              
                <SelectorContainer key={filter.id}>
                  {filter.type !== "map" && <SelectorLabel
                    htmlFor={filter.paramName}
                    text={filter.filterName}
                    info={filter.info ?? null}
                  />}
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
                      value={
                        filterState[filter.id] ||
                        filter.values.values[0].paramValue
                      }
                      onChange={(filter, value) => handleFilterChange(filter, value)}
                      bgColor={bgColor}
                    />
                  )}
                  {filter.type === "checkbox" && (
                    <CheckboxSelector
                      key={filter.id}
                      filter={filter}
                      value={
                        filterState[filter.id] ||
                        filter.values.values[0].paramValue
                      }
                      onChange={(filter, value) => handleFilterChange(filter, value)}
                      bgColor={bgColor}
                    />
                  )}
                  {filter.type === "mapFeatureSelect" && (
                    <MapFeatureSelect
                      key={filter.id}
                      filter={filter}
                      value={filterState[filter.id]}
                      onChange={(filter, value) => handleFilterChange(filter, value)}
                      bgColor={bgColor}
                    />
                  )}
                  {filter.type === "mapFeatureSelectWithControls" && (
                    <MapFeatureSelectWithControls
                      key={filter.id}
                      filter={filter}
                      value={filterState[filter.id]}
                      onChange={(filter, value) => handleFilterChange(filter, value)}
                      bgColor={bgColor}
                    />
                  )}
                  {filter.type === "mapFeatureSelectAndPan" && (
                    <MapFeatureSelectAndPan
                      key={filter.id}
                      filter={filter}
                      value={filterState[filter.id]}
                      onChange={(filter, value) => handleFilterChange(filter, value)}
                      bgColor={bgColor}
                    />
                  )}
                </SelectorContainer>
          ))}
          <ButtonRow>
            {downloadPath && (
              <DownloadButton 
                onClick={handleDownload} 
                $bgColor={bgColor}
                disabled={isRequestTooLarge || isDownloading}
              >
                {isDownloading ? (
                  <>Downloading CSV <Spinner /></>
                ) : (
                  isRequestTooLarge ? "Request Too Large" : "Download as CSV"
                )}
              </DownloadButton>
            )}
            {downloadShapefilePath && (
              <DownloadButton 
                onClick={handleShapefileDownload} 
                $bgColor={bgColor}
                disabled={isRequestTooLarge || isShapefileDownloading}
              >
                {isShapefileDownloading ? (
                  <>Downloading Shapefile <Spinner /></>
                ) : (
                  isRequestTooLarge ? "Request Too Large" : "Download as Shapefile"
                )}
              </DownloadButton>
            )}
          </ButtonRow>
        </>
      ) : (
        <NoDataParagraph>Loading filters...</NoDataParagraph>
      )}
    </AccordionSection>
  );
};
