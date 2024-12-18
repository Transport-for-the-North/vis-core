import React from 'react';
import styled from 'styled-components';
import { InformationCircleIcon } from "@heroicons/react/24/solid";

// Styled component for the info box
const InfoBoxContainer = styled.div`
  background-color: rgba(0, 222, 198, 0.9);
  color: rgb(13, 15, 61);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 0.9em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
`;

// Styled component for the icon
const IconWrapper = styled.div`
  margin-right: 8px; /* Space between icon and text */
  display: flex;
  align-items: center;
`;

/**
 * InfoBox component displays an informational message with an icon.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.text - The text to display inside the info box.
 * @returns {JSX.Element} The rendered InfoBox component.
 */
export const InfoBox = ({ text }) => (
  <InfoBoxContainer>
    <IconWrapper>
      <InformationCircleIcon style={{ width: '20px', height: '20px', color: 'rgb(13, 15, 61)'}} />
    </IconWrapper>
    {text}
  </InfoBoxContainer>
);