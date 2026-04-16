/**
 * Excel Validation Utility
 *
 * Provides functions for parsing Excel workbooks (.xlsm, .xlsx, .xls) and
 * validating a selected sheet against a schema.  Validation results share the
 * same shape as csvValidation so ValidationPreview / ValidationErrors work
 * without modification.
 */

import * as XLSX from 'xlsx';
import { validateCSVSchema } from './csvValidation';

const EXCEL_EXTENSIONS = ['xlsx', 'xlsm', 'xls'];
const EXCEL_MIME_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
];

/**
 * Returns true when the File object is an Excel workbook.
 * @param {File} file
 * @returns {boolean}
 */
export function isExcelFile(file) {
  if (!file) return false;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return EXCEL_EXTENSIONS.includes(ext) || EXCEL_MIME_TYPES.includes(file.type);
}

/**
 * Reads an Excel file and returns the parsed workbook together with the list
 * of visible sheet names.
 *
 * @param {File} file - The Excel file to parse.
 * @returns {Promise<{ workbook: import('xlsx').WorkBook, sheetNames: string[] }>}
 */
export function parseExcelWorkbook(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!isExcelFile(file)) {
      reject(new Error('File is not a recognised Excel format (.xlsx, .xlsm, .xls).'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        resolve({ workbook, sheetNames: workbook.SheetNames });
      } catch (err) {
        reject(new Error(`Failed to parse Excel file: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extracts data from a specific sheet in a parsed workbook.
 * Returns rows as plain objects keyed by the header row values —
 * identical to the output of parseCSV so the same schema validation works.
 *
 * @param {import('xlsx').WorkBook} workbook - Previously parsed workbook.
 * @param {string} sheetName - Name of the sheet to extract.
 * @returns {{ data: Object[], headers: string[] }}
 */
export function extractSheetData(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in workbook.`);
  }

  // sheet_to_json with header:1 returns an array of arrays (first row = headers)
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rows.length === 0) {
    return { data: [], headers: [] };
  }

  const headers = rows[0].map((h) => String(h ?? '').trim());
  const data = rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, idx) => {
      const raw = row[idx];
      // Normalise dates to ISO strings so existing date validators work
      if (raw instanceof Date) {
        obj[header] = raw.toISOString().split('T')[0];
      } else {
        obj[header] = raw !== undefined && raw !== null ? String(raw) : '';
      }
    });
    return obj;
  });

  return { data, headers };
}

/**
 * Validates a specific sheet from an Excel file against a schema.
 * The result shape matches validateCSVFile so consumers need no changes.
 *
 * @param {File} file - The Excel file.
 * @param {string} sheetName - Sheet to validate.
 * @param {Object} schema - Validation schema (same format as csvValidation).
 * @returns {Promise<Object>} Validation result with isValid, errors, warnings, stats, parsedData, headers.
 */
export async function validateExcelSheet(file, sheetName, schema) {
  const { workbook } = await parseExcelWorkbook(file);
  const { data, headers } = extractSheetData(workbook, sheetName);

  if (data.length === 0) {
    return {
      isValid: false,
      errors: [{ type: 'empty_data', message: `Sheet "${sheetName}" contains no data rows.` }],
      warnings: [],
      stats: { totalRows: 0, validRows: 0, invalidRows: 0, totalColumns: 0, validColumns: 0, invalidColumns: 0 },
      parsedData: data,
      headers,
    };
  }

  const result = validateCSVSchema(data, schema);
  return { ...result, parsedData: data, headers };
}
