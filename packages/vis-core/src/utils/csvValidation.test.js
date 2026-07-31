import {
  validateFieldType,
  parseCSV,
  validateCSVSchema,
} from './csvValidation';

describe('csvValidation', () => {
  describe('validateFieldType', () => {
    it('rejects empty values', () => {
      expect(validateFieldType('', 'string').isValid).toBe(false);
    });

    it('accepts valid integers only', () => {
      expect(validateFieldType('42', 'integer').isValid).toBe(true);
      expect(validateFieldType('12.3', 'integer').isValid).toBe(false);
      expect(validateFieldType('12abc', 'integer').isValid).toBe(false);
    });

    it('accepts valid floats', () => {
      expect(validateFieldType('12.3', 'float').isValid).toBe(true);
      expect(validateFieldType('not-a-number', 'float').isValid).toBe(false);
    });

    it('accepts common boolean strings', () => {
      expect(validateFieldType('yes', 'boolean').isValid).toBe(true);
      expect(validateFieldType('maybe', 'boolean').isValid).toBe(false);
    });
  });

  describe('parseCSV', () => {
    it('parses quoted fields containing commas', () => {
      const csv = 'name,note\n"Alice","hello, world"';
      const { headers, data } = parseCSV(csv, { hasHeader: true });
      expect(headers).toEqual(['name', 'note']);
      expect(data).toHaveLength(1);
      expect(data[0].note).toBe('hello, world');
    });

    it('skips empty rows by default', () => {
      const csv = 'a,b\n1,2\n\n3,4';
      const { data } = parseCSV(csv, { hasHeader: true });
      expect(data).toHaveLength(2);
    });
  });

  describe('validateCSVSchema', () => {
    const schema = {
      columns: [
        { name: 'id', type: 'integer', required: true },
        { name: 'label', type: 'string', required: true },
      ],
    };

    it('passes valid rows', () => {
      const data = [{ id: '1', label: 'One' }];
      const result = validateCSVSchema(data, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('reports type and required field errors', () => {
      const data = [{ id: '1.5', label: '' }];
      const result = validateCSVSchema(data, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
