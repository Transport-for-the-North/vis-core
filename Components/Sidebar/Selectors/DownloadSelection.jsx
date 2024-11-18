import styled from "styled-components";
import { AccordionSection } from "../Accordion";
import { Dropdown } from "./Dropdown";
import { SelectorLabel } from "./SelectorLabel";
import { Slider } from "./Slider";
import { Toggle } from "./Toggle";
import { useEffect, useContext } from "react";
import { useFilterContext } from "hooks";
import { api } from "services";
import { checkSecurityRequirements } from "utils";
import { AppContext } from "contexts";
import { update } from "lodash";

const SelectorContainer = styled.div`
  margin-bottom: 10px;
`;
const NoDataParagraph = styled.p``;

/**
 * Renders a section containing filter selectors for filtering and data selection.
 * @property {Object[]} filters - An array of filter objects containing information about the filters to be rendered.
 * @returns {JSX.Element} The rendered SelectorSection component.
 */
export const DownloadSection = ({ filters, downloadPath }) => {
  const appContext = useContext(AppContext);
  const {state: filterState, dispatch: filterDispatch} = useFilterContext();
 
  const apiSchema = appContext.apiSchema;
  const apiRoute = downloadPath;
  const apiParameters = apiSchema.paths[apiRoute]?.get?.parameters || [];
  const requiresAuth = checkSecurityRequirements(apiSchema, apiRoute);

  useEffect(() => {
    // filters.forEach(filter => {
    //     filter.id = filter.paramName;
    // });
    filters.forEach(filter => {
        if (filter.paramName !== "showValuesAs" && filter.paramName !== "stbTag") {
          filter.id = filter.paramName + 's';
        } else {
          filter.id = filter.paramName;
        }
    });
    const updatedFilters = filters.reduce((acc, item) => {
        const paramValues = item.values.values.map(value => value.paramValue);
        acc[item.id] = paramValues.length === 1 ? paramValues[0] : paramValues;
        return acc;
    }, {});
    filterDispatch({ type: 'INITIALIZE_FILTERS', payload: updatedFilters });
  }, []);

  // Function to handle dropdown change
  const handleDownloadSelection = (filter, value) => {//paramName, newValue) => {
    filterDispatch({
        type: 'SET_FILTER_VALUE',
        payload: { filterId: filter.id, value },
    });
  };

  const handleDownload = async () => {
    try {
      await api.downloadService.downloadCsv(apiRoute, {
        queryParams: filterState,
        skipAuth: !requiresAuth,
      });
      console.log('CSV downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <AccordionSection title="Download data" defaultValue={true} key='DownloadData'>
      {Array.isArray(filters) && filters.length > 0 ? (
        <>
          {filters
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
                    key={filter.paramName}
                    filter={filter}
                    value={filterState[filter.id]}
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}//handleDownloadSelection(filter.paramName, value)}
                  />
                )}
                {filter.type === "slider" && (
                  <Slider
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id] || filter.min || filter.values[0]}
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}//handleDownloadSelection(filter.paramName, value)}
                  />
                )}
                {filter.type === "toggle" && (
                  <Toggle
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id] || filter.values.values[0].paramValue}
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}//handleDownloadSelection(filter.paramName, value)}
                  />
                )}
              </SelectorContainer>
            ))}
          <button className="download-button" onClick={handleDownload}>
            Download
          </button>
        </>
      ) : (
        <NoDataParagraph>Loading filters...</NoDataParagraph>
      )}
    </AccordionSection>
  );
};