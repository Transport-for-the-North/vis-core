import React from 'react';
import styled from 'styled-components';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const PreviewContainer = styled.div`
  margin-top: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const PreviewHeader = styled.div`
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
`;

const TableHeader = styled.thead`
  background-color: #f9f9f9;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const TableHeaderCell = styled.th`
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #fafafa;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  position: relative;
`;

const ErrorIndicator = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  color: #d32f2f;
`;

const ValidIndicator = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  color: #2e7d32;
`;

const CellContent = styled.div`
  padding-right: 24px;
  word-break: break-word;
`;

const EmptyMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #666;
  font-style: italic;
`;

/**
 * ValidationPreview component displays a preview of the CSV data with validation indicators.
 * 
 * @param {Object} props
 * @param {Array} props.data - Parsed CSV data (array of objects)
 * @param {Array} props.headers - Column headers
 * @param {Array} props.errors - Validation errors
 * @param {number} props.maxRows - Maximum number of rows to display
 */
export const ValidationPreview = ({ data = [], headers = [], errors = [], maxRows = 10 }) => {
  if (!data || data.length === 0) {
    return (
      <PreviewContainer>
        <PreviewHeader>CSV Preview</PreviewHeader>
        <EmptyMessage>No data to preview</EmptyMessage>
      </PreviewContainer>
    );
  }

  // Create a map of errors by row and column for quick lookup
  const errorMap = errors.reduce((map, error) => {
    if (error.row && error.column) {
      const key = `${error.row}-${error.column}`;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(error);
    }
    return map;
  }, {});

  // Get column errors (missing columns, etc.)
  const columnErrors = errors
    .filter(e => e.type === 'missing_column' || e.type === 'extra_column')
    .reduce((map, error) => {
      map[error.column] = error;
      return map;
    }, {});

  const displayRows = data.slice(0, maxRows);
  const hasMoreRows = data.length > maxRows;

  return (
    <PreviewContainer>
      <PreviewHeader>
        CSV Preview {hasMoreRows && `(showing first ${maxRows} of ${data.length} rows)`}
      </PreviewHeader>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              {headers.map((header, index) => {
                const hasColumnError = columnErrors[header];
                return (
                  <TableHeaderCell key={index}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {header}
                      {hasColumnError && (
                        <ExclamationCircleIcon
                          style={{ width: 16, height: 16, color: '#d32f2f', flexShrink: 0 }}
                          title={hasColumnError.message}
                        />
                      )}
                    </div>
                  </TableHeaderCell>
                );
              })}
            </tr>
          </TableHeader>
          <TableBody>
            {displayRows.map((row, rowIndex) => {
              const rowNumber = rowIndex + 1;
              return (
                <TableRow key={rowIndex}>
                  {headers.map((header, colIndex) => {
                    const value = row[header] || '';
                    const errorKey = `${rowNumber}-${header}`;
                    const cellErrors = errorMap[errorKey] || [];
                    const hasError = cellErrors.length > 0;

                    return (
                      <TableCell key={colIndex}>
                        {hasError && (
                          <ErrorIndicator>
                            <ExclamationCircleIcon
                              style={{ width: 16, height: 16 }}
                              title={cellErrors.map(e => e.message).join('; ')}
                            />
                          </ErrorIndicator>
                        )}
                        {!hasError && value && (
                          <ValidIndicator>
                            <CheckCircleIcon style={{ width: 14, height: 14 }} />
                          </ValidIndicator>
                        )}
                        <CellContent>{value || <span style={{ color: '#999', fontStyle: 'italic' }}>empty</span>}</CellContent>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </PreviewContainer>
  );
};
