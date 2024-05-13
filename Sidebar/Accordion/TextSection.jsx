import React from 'react';
import { AccordionSection } from 'Components';
import parse from 'html-react-parser';

export const TextSection = ({ title, text }) => {
  return (
    <AccordionSection title={title}>
      {parse(text)}
    </AccordionSection>
  );
};