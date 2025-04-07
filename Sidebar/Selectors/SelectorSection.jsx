import styled from "styled-components";
import { useMapContext, useFilterContext } from "hooks";
import { InfoBox, WarningBox } from "Components";
import { AccordionSection } from "../Accordion";
import { Dropdown } from "./Dropdown";
import { SelectorLabel } from "./SelectorLabel";
import { Slider } from "./Slider";
import { Toggle } from "./Toggle";
import { AppContext } from "contexts";
import { useContext } from "react";
import { MapFeatureSelect, MapFeatureSelectWithControls } from "./MapFeatureSelect";
import { CheckboxSelector, MapFeatureSelectAndPan } from ".";

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
    ? filters.filter((filter) => filter.type === "map" && filter.filterName)
    : [];

  return (
    <AccordionSection title="Filtering and data selection" defaultValue={true}>
      {isDiffPage && <InfoBox text={diffPageMessage} />}
      {isTrsePage && <InfoBox text={trsePageMessage} />}

      {/* Render an InfoBox for each map filter */}
      {mapFilters.map((filter) => (
        <InfoBox key={filter.id} text={filter.filterName} />
      ))}

      {/* Display a warning message if no data is available */}
      {dataRequested && noDataAvailable && (
        <WarningBox text={noDataMessage} />
      )}

      {Array.isArray(filters) && filters.length > 0 ? (
        filters
          .filter((filter) => filter.type !== "fixed") // Exclude 'fixed' filters
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
          ))
      ) : (
        <NoDataParagraph>Loading filters...</NoDataParagraph>
      )}
    </AccordionSection>
  );
};
