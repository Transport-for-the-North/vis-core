import React from 'react';
import styled, { css } from 'styled-components';
import { InformationCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/solid";

// Base styled component for the message box
const MessageBoxContainer = styled.div`
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 0.9em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;

  ${({ type }) => type === 'info' && css`
    background-color: rgba(0, 222, 198, 0.9);
    color: rgb(13, 15, 61);
  `}

  ${({ type }) => type === 'warning' && css`
    background-color: rgba(255, 255, 153, 0.9);
    color: rgb(102, 60, 0);
  `}

  ${({ type }) => type === 'error' && css`
    background-color: #ffebee;
    color: #d32f2f;
  `}
`;

// Styled component for the icon
const IconWrapper = styled.div`
  margin-right: 8px; /* Space between icon and text */
  display: flex;
  align-items: center;
`;

/**
 * MessageBox component displays a message with an icon based on the type.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.text - The text to display inside the message box.
 * @param {string} props.type - The type of message box ('info', 'warning', 'error').
 * @returns {JSX.Element} The rendered MessageBox component.
 */
const MessageBox = ({ text, type }) => {
  let Icon;

  switch (type) {
    case 'warning':
      Icon = ExclamationTriangleIcon;
      break;
    case 'error':
      Icon = XCircleIcon;
      break;
    case 'info':
    default:
      Icon = InformationCircleIcon;
      break;
  }

  return (
    <MessageBoxContainer type={type}>
      <IconWrapper>
        <Icon style={{ width: '20px', height: '20px', color: 'inherit' }} />
      </IconWrapper>
      {text}
    </MessageBoxContainer>
  );
};

// Specific components for each type of message box
export const InfoBox = ({ text }) => <MessageBox text={text} type="info" />;
export const WarningBox = ({ text }) => <MessageBox text={text} type="warning" />;
export const ErrorBox = ({ text }) => <MessageBox text={text} type="error" />;