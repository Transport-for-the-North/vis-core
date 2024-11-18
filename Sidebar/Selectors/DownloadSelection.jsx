import styled from "styled-components";
import { AccordionSection } from "../Accordion";
import { Dropdown } from "./Dropdown";
import { SelectorLabel } from "./SelectorLabel";
import { Slider } from "./Slider";
import { Toggle } from "./Toggle";
import { useEffect, useContext, useState } from "react";
import { useFilterContext } from "hooks";
import { api } from "services";
import { checkSecurityRequirements } from "utils";
import { AppContext } from "contexts";
import { update } from "lodash";

const SelectorContainer = styled.div`
  margin-bottom: 10px;
`;

const NoDataParagraph = styled.p``;

const DownloadButton = styled.button`
  cursor: pointer;
  padding: 10px 5px; /* Increased padding for a larger button */
  background-color: #7317DE;
  color: white;
  border-radius: 4px;
  border: 0.25px solid;
  margin-right: 10px; /* Changed to margin-right to position it on the left */
  width: 100px; /* Increased width */
  font-family: "Hanken Grotesk", sans-serif;
  display: flex;
  align-items: center; /* Center align items vertically */
  justify-content: center;

  &:hover {
    background-color: #5e13b0; /* Slightly darker color on hover */
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

export const DownloadSection = ({ filters, downloadPath }) => {
  const appContext = useContext(AppContext);
  const { state: filterState, dispatch: filterDispatch } = useFilterContext();
  const [isDownloading, setIsDownloading] = useState(false);

  const apiSchema = appContext.apiSchema;
  const apiRoute = downloadPath;
  const apiParameters = apiSchema.paths[apiRoute]?.get?.parameters || [];
  const requiresAuth = checkSecurityRequirements(apiSchema, apiRoute);

  useEffect(() => {
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

  const handleDownloadSelection = (filter, value) => {
    filterDispatch({
      type: 'SET_FILTER_VALUE',
      payload: { filterId: filter.id, value },
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await api.downloadService.downloadCsv(apiRoute, {
        queryParams: filterState,
        skipAuth: !requiresAuth,
      });
      console.log('CSV downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AccordionSection title="Download data" defaultValue={true} key='DownloadData'>
      {Array.isArray(filters) && filters.length > 0 ? (
        <>
          {filters
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
                    key={filter.paramName}
                    filter={filter}
                    value={filterState[filter.id]}
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}
                  />
                )}
                {filter.type === "slider" && (
                  <Slider
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id] || filter.min || filter.values[0]}
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}
                  />
                )}
                {filter.type === "toggle" && (
                  <Toggle
                    key={filter.id}
                    filter={filter}
                    value={filterState[filter.id] || filter.values.values[0].paramValue}
                    onChange={(filter, value) => handleDownloadSelection(filter, value)}
                  />
                )}
              </SelectorContainer>
            ))}
          <DownloadButton onClick={handleDownload}>
            Download
            {isDownloading && <Spinner />}
          </DownloadButton>
        </>
      ) : (
        <NoDataParagraph>Loading filters...</NoDataParagraph>
      )}
    </AccordionSection>
  );
};