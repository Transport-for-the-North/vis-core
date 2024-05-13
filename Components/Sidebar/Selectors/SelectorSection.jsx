import styled from 'styled-components'

import { AccordionSection } from '../Accordion';
import { Dropdown } from './Dropdown';
import { Slider } from './Slider'
import { SelectorLabel } from './SelectorLabel';

const SelectorContainer = styled.div`
  margin-bottom: 20px;
`;

export const SelectorSection = ({ filters, onFilterChange }) => {
  return (
    <AccordionSection title="Filtering and data selection" defaultValue={true}>
      {filters.map((filter) => (
        <SelectorContainer key={filter.filterName}>
          <SelectorLabel htmlFor={filter.paramName} text={filter.filterName} />
          {filter.type === 'dropdown' && (
            <Dropdown
              key={filter.filterName}
              filter={filter}
              onChange={(filter, value) => onFilterChange(filter, value)}
            />
          )}
          {filter.type === 'slider' && (
            <Slider
              key={filter.filterName}
              filter={filter}
              onChange={(filter, value) => onFilterChange(filter, value)}
            />
          )}
        </SelectorContainer>
      ))}
    </AccordionSection>
  );
};