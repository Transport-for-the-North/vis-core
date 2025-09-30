import styled from "styled-components";
import { AccordionSection } from "../Accordion";
import { Dropdown } from "./Dropdown";
import { SelectorLabel } from "./SelectorLabel";
import { Slider } from "./Slider";
import { Toggle } from "./Toggle";
import { useEffect, useContext, useState } from "react";
import { useFilterContext } from "hooks";
import { InfoBox } from "Components";
import { api } from "services";
import { checkSecurityRequirements, sortValues, isValidCondition, applyCondition } from "utils";
import { AppContext, PageContext } from "contexts";
import { darken } from "polished";
import { MapFeatureSelectWithControls, MapFeatureSelectAndPan, MapFeatureSelect, CheckboxSelector } from ".";
import { ErrorBox } from "Components";

const SelectorContainer = styled.div`
  margin-bottom: 10px;
`;

const NoDataParagraph = styled.p``;

const DownloadButton = styled.button`
  cursor: pointer;
  padding: 10px 5px; /* Increased padding for a larger button */
  background-color: ${(props) => props.$bgColor}; /* Access the $bgColor prop */
  color: white;
  border-radius: 8px;
  border: 0.25px solid;
  margin-right: 10px; /* Changed to margin-right to position it on the left */
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

/**
 * Helper function to check for duplicate values in an array.
 */
const isDuplicateValue = (values, value) => {
  return values.some(existingValue => 
    existingValue.paramValue === value.paramValue &&
    existingValue.displayValue === value.displayValue
  );
};

export const DownloadSection = ({ filters, downloadPath, bgColor, requestMethod = 'GET' }) => {
  const appContext = useContext(AppContext);
  const pageContext = useContext(PageContext);
  const { state: filterState, dispatch: filterDispatch } = useFilterContext();
  const [isDownloading, setIsDownloading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [isRequestTooLarge, setIsRequestTooLarge] = useState(false);
  const [processedFilters, setProcessedFilters] = useState([]);
  const [isFiltersReady, setIsFiltersReady] = useState(false);
  
  const apiSchema = appContext.apiSchema;
  const apiRoute = downloadPath;
  const requiresAuth = checkSecurityRequirements(apiSchema, apiRoute);

  /**
   * Fetch and store metadata tables.
   */
  const fetchMetadataTables = async () => {
    const metadataTables = {};
    
    // Use metadataTables from pageContext if available
    if (pageContext?.config?.metadataTables) {
      for (const table of pageContext.config.metadataTables) {
        try {
          const response = await api.baseService.get(table.path);
          let filteredData = response;

          if (table.where && Array.isArray(table.where)) {
            for (const condition of table.where) {
              if (isValidCondition(condition)) {
                filteredData = applyCondition(filteredData, condition);
              } else {
                console.error(`Invalid condition in metadata table ${table.name}:`, condition);
              }
            }
          }

          metadataTables[table.name] = filteredData;
        } catch (error) {
          console.error(`Failed to fetch metadata table ${table.name}:`, error);
        }
      }
    }

    return metadataTables;
  };

  /**
   * Initialize filters with metadata tables.
   */
  const initializeFilters = async (metadataTables) => {
    const updatedFilters = [];
    const filterState = {};

    for (const filter of filters) {
      const filterWithId = { ...filter, id: filter.paramName };

      switch (filter.type) {
        case 'map':
        case 'slider':
        case 'mapFeatureSelect':
        case 'mapFeatureSelectWithControls':
        case 'mapFeatureSelectAndPan':
          updatedFilters.push(filterWithId);
          break;
        default:
          if (filter.values) {
            switch (filter.values.source) {
              case 'local':
                updatedFilters.push(filterWithId);
                break;
              case 'api':
                const path = '/api/tame/mvdata';
                const dataPath = {
                  dataPath: pageContext.config.visualisations[0].dataPath,
                };
                try {
                  const metadataFilters = await api.baseService.post(path, dataPath, { skipAuth: false });
                  const apiFilterValues = Object.groupBy(
                    metadataFilters,
                    ({ field_name }) => field_name
                  );
                  const baseParamName = filter.paramName.includes('DoMinimum')
                    ? filter.paramName.replace('DoMinimum', '')
                    : filter.paramName.includes('DoSomething')
                    ? filter.paramName.replace('DoSomething', '')
                    : filter.paramName;
                  filter.values.values = apiFilterValues[baseParamName][0].distinct_values.map((v) => ({
                    displayValue: v,
                    paramValue: v,
                  }));
                  updatedFilters.push(filterWithId);
                } catch (error) {
                  console.error('Error fetching metadata filters', error);
                }
                break;
              case 'metadataTable':
                const metadataTable = metadataTables[filter.values.metadataTableName];
                if (metadataTable) {
                  let uniqueValues = [];
                  metadataTable.forEach(option => {
                    const value = {
                      displayValue: option[filter.values.displayColumn],
                      paramValue: option[filter.values.paramColumn],
                      legendSubtitleText: option[filter.values?.legendSubtitleTextColumn] || null
                    };
                    if (!isDuplicateValue(uniqueValues, value)) {
                      uniqueValues.push(value);
                    }
                  });

                  // Apply sorting if specified
                  if (filter.values.sort) {
                    uniqueValues = sortValues(uniqueValues, filter.values.sort);
                  }

                  // Apply exclusion if specified
                  if (filter.values.exclude) {
                    uniqueValues = uniqueValues.filter(value => !filter.values.exclude.includes(value.paramValue));
                  }

                  filterWithId.values = { ...filter.values, values: uniqueValues };
                  updatedFilters.push(filterWithId);    
                } else {
                  console.error(`Metadata table ${filter.values.metadataTableName} not found`);
                }
                break;
              default:
                console.error('Unknown filter source:', filter.values?.source);
            }
          } else {
            // Handle filters without values property (like fixed filters)
            updatedFilters.push(filterWithId);
          }
      }

      // Initialize filter value if shouldBeBlankOnInit is not true
      if (!filterWithId.shouldBeBlankOnInit) {
        if (filterWithId.multiSelect && filterWithId.shouldInitialSelectAllInMultiSelect) {
          filterState[filterWithId.id] =
            filterWithId.defaultValue ||
            filterWithId.min ||
            filterWithId.values?.values?.map(item => item?.paramValue);
        } else {
          filterState[filterWithId.id] =
            filterWithId.defaultValue ||
            filterWithId.min ||
            filterWithId.values?.values?.[0]?.paramValue;
        }
      } else {
        filterState[filterWithId.id] = null;
      }
    }

    return { updatedFilters, filterState };
  };

  // Initialize filters and metadata on component mount
  useEffect(() => {
    const initializeDownloadFilters = async () => {
      try {
        setIsFiltersReady(false);
        
        // Fetch metadata tables
        const metadataTables = await fetchMetadataTables();
        
        // Initialize filters with metadata
        const { updatedFilters, filterState } = await initializeFilters(metadataTables);
        
        setProcessedFilters(updatedFilters);
        filterDispatch({ type: 'INITIALIZE_FILTERS', payload: filterState });
        setIsFiltersReady(true);
      } catch (error) {
        console.error('Error initializing download filters:', error);
        setRequestError('Failed to load filter options');
      }
    };

    if (filters && filters.length > 0) {
      initializeDownloadFilters();
    }
  }, [filters, filterDispatch, pageContext]);

  // Check request size whenever filterState changes (only for GET requests)
  useEffect(() => {
    const checkRequestSize = () => {
      if (!filterState || Object.keys(filterState).length === 0) return;
      
      try {
        // Only check size for GET requests
        if (requestMethod === "GET") {
          const { isValid, error } = api.downloadService.checkGetRequestSize(apiRoute, filterState);
          setIsRequestTooLarge(!isValid);
          setRequestError(error);

          // If request is too large, suggest using POST
          if (!isValid) {
            setRequestError(error);
          }
        } else {
          // For POST requests, we don't need to check size
          setIsRequestTooLarge(false);
          setRequestError(null);
        }
      } catch (error) {
        console.error("Error checking request size:", error);
      }
    };
    
    if (isFiltersReady) {
      checkRequestSize();
    }
  }, [filterState, apiRoute, requestMethod, isFiltersReady]);
  
  const handleDownloadSelection = (filter, value) => {
    filterDispatch({
      type: 'SET_FILTER_VALUE',
      payload: { filterId: filter.id, value },
    });
  };
  
  const handleDownload = async () => {
    setIsDownloading(true);
    setRequestError(null);
    
    try {
      await api.downloadService.downloadCsv(apiRoute, {
        queryParams: filterState,
        skipAuth: !requiresAuth,
        method: requestMethod,
      });
      console.log('CSV downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      setRequestError(error.message || "Error downloading data");
    } finally {
      setIsDownloading(false);
    }
  };
  
  if (!isFiltersReady) {
    return (
      <AccordionSection title="Download data" defaultValue={false}>
        <NoDataParagraph>Loading filters...</NoDataParagraph>
      </AccordionSection>
    );
  }

  if (!filterState || Object.keys(filterState).length === 0) {
    return null;
  }
  
  return (
    <AccordionSection title="Download data" defaultValue={false}>
      <InfoBox text={'Use the selections to toggle items on and off. See Glossary "Download" for more information.'} />
      {Array.isArray(processedFilters) && processedFilters.length > 0 ? (
        <>
          {processedFilters
            .filter((filter) => filter.type !== "fixed")
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
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}
                  />
                )}
                {filter.type === "slider" && (
                  <Slider
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id] || filter.min || filter.values?.[0]}
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}
                  />
                )}
                {filter.type === "toggle" && (
                  <Toggle
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id] || filter.values?.values?.[0]?.paramValue}
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}
                    bgColor={bgColor}
                  />
                )}
                {filter.type === "checkbox" && (
                  <CheckboxSelector
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id] || filter.values?.values?.[0]?.paramValue}
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}
                    bgColor={bgColor}
                  />
                )}
                {filter.type === 'mapFeatureSelectWithControls' && (
                  <MapFeatureSelectWithControls
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id]}
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}
                    bgColor={bgColor}
                  />
                )}
                {filter.type === 'mapFeatureSelectAndPan' && (
                  <MapFeatureSelectAndPan
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id]}
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}
                    bgColor={bgColor}
                  />
                )}
                {filter.type === 'mapFeatureSelect' && (
                  <MapFeatureSelect
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id]}
                    onChange={(filter, value) => handleDownloadSelection(filter, value?.value)}
                    bgColor={bgColor}
                  />
                )}
              </SelectorContainer>
            ))}
            
          {requestError && (
            <ErrorBox text={requestError}/>
          )}
          
          <DownloadButton 
            onClick={handleDownload} 
            $bgColor={bgColor}
            disabled={isRequestTooLarge || isDownloading}
            data-clarity-label='download-data-button'
          >
            {isDownloading ? (
              <>Downloading <Spinner /></>
            ) : (
              isRequestTooLarge ? "Request Too Large" : "Download"
            )}
          </DownloadButton>
        </>
      ) : (
        <NoDataParagraph>Loading filters...</NoDataParagraph>
      )}
    </AccordionSection>
  );
};