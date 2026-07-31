import * as XLSX from 'xlsx';
import {
  extractSheetData,
  extractCellValue,
  isExcelFile,
} from './excelValidation';

function makeWorkbook(rowsBySheet) {
  const workbook = { SheetNames: [], Sheets: {} };
  Object.entries(rowsBySheet).forEach(([name, rows]) => {
    workbook.SheetNames.push(name);
    workbook.Sheets[name] = XLSX.utils.aoa_to_sheet(rows);
  });
  return workbook;
}

describe('excelValidation', () => {
  describe('isExcelFile', () => {
    it('detects Excel extensions', () => {
      expect(isExcelFile({ name: 'data.xlsx', type: '' })).toBe(true);
      expect(isExcelFile({ name: 'data.csv', type: 'text/csv' })).toBe(false);
    });
  });

  describe('extractCellValue', () => {
    it('reads a cell value from a named sheet', () => {
      const workbook = makeWorkbook({
        'LPA Info': [['', ''], ['', 'Liverpool City Council']],
      });
      expect(extractCellValue(workbook, 'LPA Info', 'B2')).toBe(
        'Liverpool City Council'
      );
    });

    it('returns null for missing or empty cells', () => {
      const workbook = makeWorkbook({ Sheet1: [['']] });
      expect(extractCellValue(workbook, 'Sheet1', 'A1')).toBeNull();
      expect(extractCellValue(workbook, 'Missing', 'A1')).toBeNull();
    });
  });

  describe('extractSheetData', () => {
    it('maps rows using header labels and preserves column alignment with blank headers', () => {
      const workbook = makeWorkbook({
        Data: [
          ['id', '', 'name'],
          ['1', 'ignored', 'Alice'],
          ['2', 'ignored', 'Bob'],
        ],
      });

      const { headers, data } = extractSheetData(workbook, 'Data', 0);
      expect(headers).toEqual(['id', 'Column_2', 'name']);
      expect(data[0].id).toBe('1');
      expect(data[0].Column_2).toBe('ignored');
      expect(data[0].name).toBe('Alice');
    });

    it('respects headerRowIndex for sheets with preamble rows', () => {
      const workbook = makeWorkbook({
        Data: [
          ['Legend row'],
          ['id', 'value'],
          ['1', '100'],
        ],
      });

      const { headers, data } = extractSheetData(workbook, 'Data', 1);
      expect(headers).toEqual(['id', 'value']);
      expect(data).toHaveLength(1);
      expect(data[0]).toEqual({ id: '1', value: '100' });
    });

    it('preserves ISO date strings from sheet cells', () => {
      const workbook = makeWorkbook({
        Data: [['date'], ['2024-06-15']],
      });

      const { data } = extractSheetData(workbook, 'Data', 0);
      expect(data[0].date).toBe('2024-06-15');
    });
  });
});
