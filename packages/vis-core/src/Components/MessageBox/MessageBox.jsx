import React from 'react';
import styled, { css } from 'styled-components';
import { InformationCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/solid";

// Base styled component for the message box
// Accepts $margin and $fontSize transient props to override defaults
const MessageBoxContainer = styled.div`
  padding: 10px;
  border-radius: 5px;
  margin: ${(props) => props.$margin ?? '10px 0'};
  font-size: ${(props) => props.$fontSize ?? '0.9em'};
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

// Styled wrapper for sticky positioning
const StickyWrapper = styled.div`
  position: -webkit-sticky; /* Safari support */
  position: sticky;
  top: 0;
  z-index: 100;
  margin: 0px 0px 10px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

// Styled component for the icon
const IconWrapper = styled.div`
  margin-right: 8px; /* Space between icon and text */
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

// Ensures long text wraps within whatever container the box appears in.
// 'anywhere' (vs 'break-word') also reduces the element's min-content size to 0,
// which prevents inline-flex parents from growing to fit the unbroken text.
const MessageText = styled.span`
  text-align: left;
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
`;

/**
 * MessageBox component displays a message with an icon based on the type.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.text - The text to display inside the message box.
 * @param {string} props.type - The type of message box ('info', 'warning', 'error').
 * @param {boolean} [props.isSticky] - Whether the message box should be sticky positioned.
 * @param {string} [props.margin] - Custom margin for the message box container.
 * @param {string} [props.fontSize] - Custom font size for the message text.
 * @returns {JSX.Element} The rendered MessageBox component.
 */
const MessageBox = ({ text, type, isSticky, margin, fontSize }) => {
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

  const messageContent = (
    <MessageBoxContainer type={type} $margin={margin} $fontSize={fontSize}>
      <IconWrapper>
        <Icon style={{ width: '20px', height: '20px', color: 'inherit' }} />
      </IconWrapper>
      <MessageText>{text}</MessageText>
    </MessageBoxContainer>
  );

  if (isSticky) {
    return <StickyWrapper>{messageContent}</StickyWrapper>;
  }

  return messageContent;
};

/**
 * InfoBox component for displaying informational messages.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.text - The text to display.
 * @param {string} [props.margin] - Custom margin override.
 * @param {string} [props.fontSize] - Custom font size override.
 * @returns {JSX.Element}
 */
export const InfoBox = ({ text, isSticky, margin, fontSize }) => (
  <MessageBox text={text} type="info" isSticky={isSticky} margin={margin} fontSize={fontSize} />
);

/**
 * WarningBox component for displaying warning messages.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.text - The text to display.
 * @param {boolean} [props.isSticky] - Whether the box should be sticky.
 * @param {string} [props.margin] - Custom margin override.
 * @param {string} [props.fontSize] - Custom font size override.
 * @returns {JSX.Element}
 */
export const WarningBox = ({ text, isSticky, margin, fontSize }) => (
  <MessageBox text={text} type="warning" isSticky={isSticky} margin={margin} fontSize={fontSize} />
);

/**
 * ErrorBox component for displaying error messages.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.text - The text to display.
 * @param {string} [props.margin] - Custom margin override.
 * @param {string} [props.fontSize] - Custom font size override.
 * @returns {JSX.Element}
 */
export const ErrorBox = ({ text, isSticky, margin, fontSize }) => (
  <MessageBox text={text} type="error" isSticky={isSticky} margin={margin} fontSize={fontSize} />
);