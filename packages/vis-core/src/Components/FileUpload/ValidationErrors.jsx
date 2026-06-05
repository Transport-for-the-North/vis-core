import React, { useState } from 'react';
import styled from 'styled-components';
import { ExclamationCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const ErrorContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
`;

const ErrorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
`;

const ErrorTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d32f2f;
  font-weight: 600;
  font-size: 0.95rem;
`;

const ErrorCount = styled.span`
  background-color: #d32f2f;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const ToggleIcon = styled.div`
  color: #d32f2f;
  display: flex;
  align-items: center;
`;

const ErrorList = styled.ul`
  margin-top: 12px;
  padding-left: 0;
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
`;

const ErrorItem = styled.li`
  padding: 8px 12px;
  margin-bottom: 6px;
  background-color: white;
  border-left: 3px solid #d32f2f;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
  line-height: 1.4;
`;

const ErrorType = styled.span`
  font-weight: 600;
  color: #d32f2f;
  margin-right: 6px;
`;

const WarningContainer = styled.div`
  margin-top: 12px;
  padding: 12px 16px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
`;

const WarningTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #856404;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

const WarningList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style: disc;
  color: #856404;
  font-size: 0.85rem;
`;

const WarningItem = styled.li`
  margin-bottom: 4px;
`;

/**
 * ValidationErrors component displays validation errors and warnings from CSV validation.
 * 
 * @param {Object} props
 * @param {Array} props.errors - Array of validation error objects
 * @param {Array} props.warnings - Array of validation warning objects
 * @param {Object} props.stats - Validation statistics
 */
export const ValidationErrors = ({ errors = [], warnings = [], stats = {} }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (errors.length === 0 && warnings.length === 0) {
    return null;
  }

  // Group errors by type for better display
  const groupedErrors = errors.reduce((acc, error) => {
    const type = error.type || 'unknown';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(error);
    return acc;
  }, {});

  return (
    <>
      {errors.length > 0 && (
        <ErrorContainer>
          <ErrorHeader onClick={() => setIsExpanded(!isExpanded)}>
            <ErrorTitle>
              <ExclamationCircleIcon style={{ width: 20, height: 20 }} />
              Validation Errors
              <ErrorCount>{errors.length}</ErrorCount>
            </ErrorTitle>
            <ToggleIcon>
              {isExpanded ? (
                <ChevronUpIcon style={{ width: 20, height: 20 }} />
              ) : (
                <ChevronDownIcon style={{ width: 20, height: 20 }} />
              )}
            </ToggleIcon>
          </ErrorHeader>
          {isExpanded && (
            <ErrorList>
              {Object.entries(groupedErrors).map(([type, typeErrors]) => (
                <React.Fragment key={type}>
                  {typeErrors.map((error, index) => (
                    <ErrorItem key={index}>
                      <ErrorType>{error.type}:</ErrorType>
                      {error.message || `${error.column ? `Column "${error.column}"` : ''} ${error.row ? `Row ${error.row}` : ''}`}
                      {error.value && (
                        <span style={{ color: '#666', fontStyle: 'italic' }}>
                          {' '}(Value: "{error.value}")
                        </span>
                      )}
                    </ErrorItem>
                  ))}
                </React.Fragment>
              ))}
            </ErrorList>
          )}
        </ErrorContainer>
      )}

      {warnings.length > 0 && (
        <WarningContainer>
          <WarningTitle>
            <ExclamationCircleIcon style={{ width: 18, height: 18 }} />
            Warnings ({warnings.length})
          </WarningTitle>
          <WarningList>
            {warnings.map((warning, index) => (
              <WarningItem key={index}>{warning.message}</WarningItem>
            ))}
          </WarningList>
        </WarningContainer>
      )}
    </>
  );
};
