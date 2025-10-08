import React from 'react';
import styled from 'styled-components';

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

const StatusContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  z-index: 1000;
  pointer-events: none;
`;

/**
 * DynamicStylingStatus component shows a small indicator when dynamic styling is being resolved
 * @param {boolean} isResolving - Whether dynamic styling is currently being resolved
 * @returns {JSX.Element|null} Status indicator or null
 */
export const DynamicStylingStatus = ({ isResolving }) => {
  if (!isResolving) return null;

  return (
    <StatusContainer>
      Analyzing data
      <Spinner />
    </StatusContainer>
  );
};