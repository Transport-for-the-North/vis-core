/**
 * CSV Validation Utility
 * 
 * Provides functions for parsing CSV files and validating them against a schema.
 * Supports type checking, required field validation, and detailed error reporting.
 */

/**
 * Validates a field value against an expected type.
 * 
 * @param {*} value - The value to validate
 * @param {string} expectedType - Expected type: 'string', 'number', 'integer', 'float', 'date', 'boolean'
 * @param {Object} options - Additional validation options
 * @param {string} options.dateFormat - Expected date format (e.g., 'YYYY-MM-DD')
 * @returns {Object} Validation result with isValid and error message
 */
export function validateFieldType(value, expectedType, options = {}) {
  // Handle empty values
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: 'Value is empty' };
  }

  const stringValue = String(value).trim();

  switch (expectedType) {
    case 'string':
      return { isValid: true, error: null };

    case 'integer':
      const intValue = parseInt(stringValue, 10);
      if (isNaN(intValue) || String(intValue) !== stringValue) {
        return { isValid: false, error: `Expected integer, got "${value}"` };
      }
      return { isValid: true, error: null };

    case 'float':
    case 'number':
      const floatValue = parseFloat(stringValue);
      if (isNaN(floatValue)) {
        return { isValid: false, error: `Expected number, got "${value}"` };
      }
      // Check if it's a valid float representation
      if (expectedType === 'float' && !/^-?\d*\.?\d+$/.test(stringValue)) {
        return { isValid: false, error: `Expected float, got "${value}"` };
      }
      return { isValid: true, error: null };

    case 'boolean':
      const lowerValue = stringValue.toLowerCase();
      const validBooleans = ['true', 'false', 'yes', 'no', '1', '0', 'y', 'n'];
      if (!validBooleans.includes(lowerValue)) {
        return { isValid: false, error: `Expected boolean (true/false/yes/no/1/0), got "${value}"` };
      }
      return { isValid: true, error: null };

    case 'date':
      if (!options.dateFormat) {
        // Try to parse as ISO date or common formats
        const date = new Date(stringValue);
        if (isNaN(date.getTime())) {
          return { isValid: false, error: `Invalid date format: "${value}"` };
        }
        return { isValid: true, error: null };
      } else {
        // Validate against specific format
        const formatPatterns = {
          'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
          'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
          'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
          'YYYY/MM/DD': /^\d{4}\/\d{2}\/\d{2}$/,
        };

        const pattern = formatPatterns[options.dateFormat];
        if (pattern && !pattern.test(stringValue)) {
          return {
            isValid: false,
            error: `Invalid date format. Expected ${options.dateFormat}, got "${value}"`
          };
        }

        // Also check if it's a valid date
        const date = new Date(stringValue);
        if (isNaN(date.getTime())) {
          return { isValid: false, error: `Invalid date: "${value}"` };
        }

        return { isValid: true, error: null };
      }

    default:
      return { isValid: true, error: null };
  }
}

/**
 * Parses a CSV file content string into an array of objects.
 * Uses a simple CSV parser that handles quoted fields and commas.
 * 
 * @param {string} csvContent - The CSV file content as a string
 * @param {Object} options - Parsing options
 * @param {boolean} options.hasHeader - Whether the CSV has a header row (default: true)
 * @param {string} options.delimiter - CSV delimiter (default: ',')
 * @returns {Object} Parsed data with headers and rows
 */
export function parseCSV(csvContent, options = {}) {
  const { hasHeader = true, delimiter = ',' } = options;

  if (!csvContent || typeof csvContent !== 'string') {
    throw new Error('CSV content must be a non-empty string');
  }

  const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Simple CSV parser that handles quoted fields
  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim()); // Add last field
    return result;
  };

  let headers = [];
  let rows = [];

  if (hasHeader && lines.length > 0) {
    headers = parseLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
    rows = lines.slice(1).map(line => parseLine(line));
  } else {
    // No header, use column indices
    const firstRow = parseLine(lines[0]);
    headers = firstRow.map((_, i) => `column_${i + 1}`);
    rows = lines.map(line => parseLine(line));
  }

  // Convert rows to objects
  const data = rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      let value = row[index] || '';
      // Remove surrounding quotes if present
      value = value.replace(/^"|"$/g, '');
      obj[header] = value;
    });
    return obj;
  });

  return { headers, data };
}

/**
 * Validates CSV data against a schema.
 * 
 * @param {Array<Object>} data - Parsed CSV data (array of objects)
 * @param {Object} schema - Validation schema
 * @param {Array} schema.columns - Array of column definitions
 * @param {string} schema.columns[].name - Expected column name
 * @param {string} schema.columns[].type - Expected type
 * @param {boolean} schema.columns[].required - Whether column is required
 * @param {boolean} schema.columns[].allowEmpty - Whether empty values are allowed
 * @param {string} schema.columns[].dateFormat - Date format for date type
 * @param {boolean} schema.strict - If true, only allow columns defined in schema
 * @param {boolean} schema.skipEmptyRows - Skip completely empty rows
 * @returns {Object} Validation result with isValid, errors, warnings, and stats
 */
export function validateCSVSchema(data, schema) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      isValid: false,
      errors: [{ type: 'empty_data', message: 'CSV file contains no data rows' }],
      warnings: [],
      stats: { totalRows: 0, validRows: 0, invalidRows: 0, totalColumns: 0, validColumns: 0, invalidColumns: 0 }
    };
  }

  if (!schema || !schema.columns || !Array.isArray(schema.columns)) {
    return {
      isValid: false,
      errors: [{ type: 'invalid_schema', message: 'Invalid validation schema provided' }],
      warnings: [],
      stats: { totalRows: data.length, validRows: 0, invalidRows: data.length, totalColumns: 0, validColumns: 0, invalidColumns: 0 }
    };
  }

  const errors = [];
  const warnings = [];
  const { strict = false, skipEmptyRows = true } = schema;

  // Get all column names from schema
  const schemaColumnNames = schema.columns.map(col => col.name);
  const schemaColumnMap = {};
  schema.columns.forEach(col => {
    schemaColumnMap[col.name] = col;
  });

  // Get headers from first row
  const headers = Object.keys(data[0] || {});
  const totalColumns = headers.length;

  // Check for missing required columns
  schema.columns.forEach(col => {
    if (col.required && !headers.includes(col.name)) {
      errors.push({
        type: 'missing_column',
        column: col.name,
        message: `Required column "${col.name}" is missing`
      });
    }
  });

  // Check for extra columns (if strict mode)
  if (strict) {
    headers.forEach(header => {
      if (!schemaColumnNames.includes(header)) {
        warnings.push({
          type: 'extra_column',
          column: header,
          message: `Column "${header}" is not in schema (strict mode enabled)`
        });
      }
    });
  }

  // Validate each row
  let validRows = 0;
  let invalidRows = 0;

  data.forEach((row, rowIndex) => {
    const rowNumber = rowIndex + 1; // 1-based row numbering
    let rowHasErrors = false;

    // Check if row is completely empty (if skipEmptyRows is enabled)
    if (skipEmptyRows) {
      const isEmpty = Object.values(row).every(val => !val || String(val).trim() === '');
      if (isEmpty) {
        return; // Skip this row
      }
    }

    // Validate each column in schema
    schema.columns.forEach(col => {
      const value = row[col.name];
      const isEmpty = value === null || value === undefined || String(value).trim() === '';

      // Check required fields
      if (col.required && isEmpty && !col.allowEmpty) {
        errors.push({
          type: 'empty_required',
          column: col.name,
          row: rowNumber,
          message: `Row ${rowNumber}, column "${col.name}": Required field is empty`
        });
        rowHasErrors = true;
        return;
      }

      // Skip type validation if empty and empty is allowed
      if (isEmpty && col.allowEmpty) {
        return;
      }

      // Validate type
      if (!isEmpty) {
        const typeValidation = validateFieldType(value, col.type, {
          dateFormat: col.dateFormat
        });

        if (!typeValidation.isValid) {
          errors.push({
            type: 'type_mismatch',
            column: col.name,
            row: rowNumber,
            value: value,
            expectedType: col.type,
            message: `Row ${rowNumber}, column "${col.name}": ${typeValidation.error}`
          });
          rowHasErrors = true;
        }
      }
    });

    if (rowHasErrors) {
      invalidRows++;
    } else {
      validRows++;
    }
  });

  const validColumns = schemaColumnNames.filter(name => headers.includes(name)).length;
  const invalidColumns = schemaColumnNames.length - validColumns;

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalRows: data.length,
      validRows,
      invalidRows,
      totalColumns,
      validColumns,
      invalidColumns: invalidColumns + (strict ? headers.filter(h => !schemaColumnNames.includes(h)).length : 0)
    }
  };
}

/**
 * Validates a CSV file (from File object) against a schema.
 * This is the main entry point for file validation.
 * 
 * @param {File} file - The CSV file to validate
 * @param {Object} schema - Validation schema
 * @returns {Promise<Object>} Validation result
 */
export async function validateCSVFile(file, schema) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Check file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && fileExtension !== 'csv') {
      reject(new Error('Invalid file type. Please upload a CSV file.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csvContent = e.target.result;
        const { data } = parseCSV(csvContent, { hasHeader: true });
        const validationResult = validateCSVSchema(data, schema);
        
        // Add parsed data to result for preview
        validationResult.parsedData = data;
        validationResult.headers = Object.keys(data[0] || {});
        
        resolve(validationResult);
      } catch (error) {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}
