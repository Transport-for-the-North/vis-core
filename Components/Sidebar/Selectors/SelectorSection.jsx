import styled from 'styled-components'

import { AccordionSection } from "../Accordion";
import { Dropdown } from "./Dropdown";
import { Slider } from "./Slider";
import { SelectorLabel } from "./SelectorLabel";
import { useMapContext } from "hooks";
import { Toggle } from './Toggle';

const SelectorContainer = styled.div`
  margin-bottom: 20px;
`;

const NoDataParagraph = styled.p`
`
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

  return (
    <AccordionSection title="Filtering and data selection" defaultValue={true}>
      {filters.map((filter) => (
        <SelectorContainer key={filter.filterName}>
          <SelectorLabel htmlFor={filter.paramName} text={filter.filterName} info={filter.info ?? null} />
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
            />)}
        </SelectorContainer>
      ))}
      {/* Check if no data has been found and display a small message in the sidebar if so */}
      {state.visualisations[Object.keys(state.visualisations)[0]]?.data[0]
        ?.feature_collection
        ? !checkGeometryNotNull(
            JSON.parse(
              state.visualisations[Object.keys(state.visualisations)[0]].data[0]
                .feature_collection
            )
          )
          ? <NoDataParagraph>No data available for the selected filters, please try different filters.</NoDataParagraph>
          : null
        : null}
    </AccordionSection>
  );
};
