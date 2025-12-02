import React from 'react';
import { AccordionSection } from 'Components';
import parse from 'html-react-parser';
import './TextSection.styles.css'

/**
 * Component representing a section for displaying text content within an accordion.
 * @property {string} title - The title of the text section.
 * @property {string} text - The text content to be displayed.
 * @returns {JSX.Element} The TextSection component.
 */
export const TextSection = ({ title, text }) => {
  return (
    <AccordionSection title={title}>
      {parse(text)}
    </AccordionSection>
  );
};