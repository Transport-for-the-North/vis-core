import styled from "styled-components";

import { useMapContext } from "hooks";
import { AccordionSection } from "../Accordion";
import { Dropdown } from "./Dropdown";
import { SelectorLabel } from "./SelectorLabel";
import { Slider } from "./Slider";
import { Toggle } from "./Toggle";

const SelectorContainer = styled.div`
  margin-bottom: 10px;
`;

const NoDataParagraph = styled.p``;
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
export const SelectorSection = ({ filters, onFilterChange }) => {
  const { state } = useMapContext();
  const noDataAvailable = state.visualisations[
    Object.keys(state.visualisations)[0]
  ]?.data[0]?.feature_collection // Check if it's a GeoJSON feature collection and if it's empty
    ? !checkGeometryNotNull(
        JSON.parse(
          state.visualisations[Object.keys(state.visualisations)[0]].data[0]
            .feature_collection
        )
      )
    : state.visualisations[Object.keys(state.visualisations)[0]]?.data // If it's not a GeoJSON feature collection, check if it's an array and if it's empty for each visualisation
        .length === 0 &&
      state.leftVisualisations[Object.keys(state.leftVisualisations)[0]]?.data
        .length === 0 &&
      state.rightVisualisations[Object.keys(state.rightVisualisations)[0]]?.data
        .length === 0 &&
      Object.values(
        state.leftVisualisations[Object.keys(state.leftVisualisations)[0]] // Finally verify that all query params are defined for each visualisation
          ?.queryParams ?? {}
      ).every((el) => el !== undefined) &&
      Object.values(
        state.rightVisualisations[Object.keys(state.rightVisualisations)[0]]
          ?.queryParams ?? {}
      ).every((el) => el !== undefined) &&
      Object.values(
        state.visualisations[Object.keys(state.visualisations)[0]]
          ?.queryParams ?? {}
      ).every((el) => el !== undefined);

  const noDataMessage =
    "No data available for the selected filters, please try different filters.";

  return (
    <AccordionSection title="Filtering and data selection" defaultValue={true}>
      {filters.map((filter) => (
        <SelectorContainer key={filter.filterName}>
          <SelectorLabel
            htmlFor={filter.paramName}
            text={filter.filterName}
            info={filter.info ?? null}
          />
          {filter.type === "dropdown" && (
            <Dropdown
              key={filter.filterName}
              filter={filter}
              onChange={(filter, value) => onFilterChange(filter, value)}
            />
          )}
          {filter.type === "slider" && (
            <Slider
              key={filter.filterName}
              filter={filter}
              onChange={(filter, value) => onFilterChange(filter, value)}
            />
          )}
          {filter.type === "toggle" && (
            <Toggle
              key={filter.filterName}
              filter={filter}
              onChange={(filter, value) => onFilterChange(filter, value)}
            />
          )}
        </SelectorContainer>
      ))}
      {/* Check if no data has been found and display a small message in the sidebar if so */}
      {noDataAvailable && <NoDataParagraph>{noDataMessage}</NoDataParagraph>}
    </AccordionSection>
  );
};
