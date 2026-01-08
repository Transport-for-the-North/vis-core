import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { api } from "../../services";
import { SimpleDropdown } from "./SimpleDropdown";

const PageContainer = styled.div`
  height: 100%;
  width: 100%;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const RowCountSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  flex-shrink: 0;
`;

const Badge = styled.span`
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 600;
  color: #1f2937;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.5px;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  background: #fff;
  margin: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
`;

const TableHeaderCell = styled.th`
  text-align: left;
  padding: 0;
  background: #6b46c1;
  border: 1px solid #5a3a9e;
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
  vertical-align: top;
`;

const HeaderContent = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HeaderTitle = styled.div`
  font-weight: 600;
  color: #fff;
`;

const HeaderFilterWrapper = styled.div`
  & .dropdown-container {
    background: #fff;
  }
`;

const TableDataCell = styled.td`
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  color: #1f2937;
  font-size: 0.875rem;
  background: #fff;

  tr:hover & {
    background-color: #f9fafb;
  }
`;

const StatusMessage = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
`;

/**
 * TableLayout component displays tabular data with filtering capabilities.
 * Fetches data from a specified endpoint and renders it in a filterable table format.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.config - Configuration object for the table.
 * @param {Object} props.config.recordsEndpoint - Endpoint configuration for fetching table data.
 * @param {string} props.config.recordsEndpoint.path - API path to fetch records from.
 * @param {Object} [props.config.recordsEndpoint.requestOptions] - Optional request configuration.
 * @param {Array} props.config.columns - Array of column definitions.
 * @param {string} props.config.columns[].accessor - Property name to access data in each row.
 * @param {string} props.config.columns[].header - Display name for the column header.
 * @param {boolean} [props.config.columns[].filter] - Whether to show a filter dropdown for this column.
 * @param {string} [props.config.columns[].type] - Data type of the column (e.g., 'boolean').
 * @returns {JSX.Element} The rendered TableLayout component.
 */
export function TableLayout({ config }) {
  const { recordsEndpoint, columns = [] } = config || {};
  
  // Ensure columns is an array
  const safeColumns = Array.isArray(columns) ? columns : [];
  
  // Early return if no recordsEndpoint
  if (!recordsEndpoint || !recordsEndpoint.path) {
    return (
      <PageContainer>
        <StatusMessage>Invalid configuration: missing recordsEndpoint</StatusMessage>
      </PageContainer>
    );
  }
  
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [filterValues, setFilterValues] = useState({});

  // Helper function to format cell values for display
  const formatCellValue = (value, column) => {
    if (value == null || value === "") return "";
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? "Yes" : "No";
    }
    
    // Handle column type-specific formatting
    if (column?.type === 'boolean') {
      // Convert string representations of booleans
      if (value === 'true' || value === '1' || value === 1) return "Yes";
      if (value === 'false' || value === '0' || value === 0) return "No";
    }
    
    return String(value);
  };

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setFetchError(null);

    const fetchData = async () => {
      try {
        const result = await api.baseService.get(
          recordsEndpoint.path,
          recordsEndpoint.requestOptions || {}
        );

        if (!cancelled) {
          const dataArray = Array.isArray(result) ? result : (result.data || result.records || []);
          const validArray = Array.isArray(dataArray) ? dataArray : [];
          
          // Remove duplicates based on reference_id (keep first occurrence)
          const deduplicatedData = validArray.reduce((acc, row) => {
            const refId = row?.reference_id || row?.id || row?._id;
            if (refId && !acc.some(r => (r?.reference_id || r?.id || r?._id) === refId)) {
              acc.push(row);
            } else if (!refId) {
              // Keep rows without any ID
              acc.push(row);
            }
            return acc;
          }, []);
          
          setTableData(deduplicatedData);
        }
      } catch (err) {
        console.error("Error fetching table data:", err);
        if (!cancelled) {
          setFetchError(err.message);
          setTableData([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [recordsEndpoint?.path, recordsEndpoint?.requestOptions]);

  // Filter data client-side based on filter values
  const filteredData = useMemo(() => {
    if (!Array.isArray(tableData)) return [];
    return tableData.filter((row) => {
      return safeColumns.every((column) => {
        const filterValue = filterValues[column?.accessor];
        if (!filterValue || filterValue === "") return true;
        
        const rowValue = row[column?.accessor];
        const formattedRowValue = formatCellValue(rowValue, column);
        
        // Exact match - compare formatted values
        return formattedRowValue === filterValue;
      });
    });
  }, [tableData, safeColumns, filterValues]);

  // Generate unique filter options for each column
  const getColumnFilterOptions = (accessor) => {
    // Find the column definition to check its type
    const column = safeColumns.find(col => col?.accessor === accessor);
    
    const uniqueValues = [...new Set(tableData.map(row => {
      const value = row[accessor];
      // Format the value the same way it will be displayed
      return formatCellValue(value, column);
    }))]
      .filter(val => val != null && val !== "")
      .sort();
    
    return uniqueValues;
  };

  return (
    <PageContainer>
      {/* Row count section above table */}
      <RowCountSection>
          <span>Rows</span>
          <Badge>{filteredData.length}</Badge>
        </RowCountSection>

        <TableContainer>
        {isLoading ? (
          <StatusMessage>Loading...</StatusMessage>
        ) : fetchError ? (
          <StatusMessage>Error: {fetchError}</StatusMessage>
        ) : filteredData.length === 0 ? (
          <StatusMessage>
            {tableData.length === 0 ? "No data to display" : "No results match your filters"}
          </StatusMessage>
        ) : (
          <Table>
            <thead>
              <tr>
                {safeColumns.map((column) => (
                  <TableHeaderCell key={column?.accessor}>
                    <HeaderContent>
                      <HeaderTitle>{column?.header}</HeaderTitle>
                      {column?.filter && (
                        <HeaderFilterWrapper>
                          <SimpleDropdown
                            options={getColumnFilterOptions(column?.accessor)}
                            value={filterValues[column?.accessor] || ""}
                            onChange={(value) =>
                              setFilterValues((prev) => ({
                                ...prev,
                                [column?.accessor]: value,
                              }))
                            }
                            placeholder="All"
                          />
                        </HeaderFilterWrapper>
                      )}
                    </HeaderContent>
                  </TableHeaderCell>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => {
                const rowKey = `${row?.reference_id || row?.id || row?._id || 'row'}-${rowIndex}`;
                return (
                  <tr key={rowKey}>
                    {safeColumns.map((column) => (
                      <TableDataCell key={column?.accessor}>
                        {formatCellValue(row?.[column?.accessor], column)}
                      </TableDataCell>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </TableContainer>
    </PageContainer>
  );
}
