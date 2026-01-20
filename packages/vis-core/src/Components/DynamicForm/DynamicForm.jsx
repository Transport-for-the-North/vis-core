import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { darken } from 'polished';
import BaseService from '../../services/api/Base';

const CONTROL_COLOUR = 'rgb(220, 220, 220)';
const CONTROL_BORDER_RADIUS = 6;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RequiredAsterisk = styled.span`
  color: #d32f2f;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid ${CONTROL_COLOUR};
  border-radius: ${CONTROL_BORDER_RADIUS}px;
  font-size: 0.95rem;
  font-family: 'Hanken Grotesk', sans-serif;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #666;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.06);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #999;
  }
`;

const CoordinateContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const CoordinateInput = styled(Input)`
  flex: 1;
`;

const CoordinateLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 2px;
`;

const DateInput = styled(Input)`
  font-family: 'Hanken Grotesk', sans-serif;
  
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: ${(props) => props.$accentColor || '#007bff'};
  flex-shrink: 0;

  &:disabled {
    cursor: not-allowed;
  }
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  line-height: 1.4;
  user-select: none;
`;

const CoordinateField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ErrorText = styled.span`
  font-size: 0.8rem;
  color: #d32f2f;
  margin-top: 2px;
`;

const HelpText = styled.span`
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  background-color: ${(props) => props.$bgColor || '#007bff'};
  color: white;
  border: none;
  border-radius: ${CONTROL_BORDER_RADIUS}px;
  font-size: 1rem;
  font-family: 'Hanken Grotesk', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s ease;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background-color: ${(props) => darken(0.1, props.$bgColor || '#007bff')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SuccessMessage = styled.div`
  padding: 16px;
  background-color: rgba(0, 222, 198, 0.15);
  border: 1px solid rgba(0, 222, 198, 0.5);
  border-radius: ${CONTROL_BORDER_RADIUS}px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SuccessHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0d6b5e;
  font-weight: 600;
  font-size: 1rem;
`;

const SubmittedDataList = styled.dl`
  margin: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 16px;
  font-size: 0.9rem;
`;

const DataLabel = styled.dt`
  font-weight: 500;
  color: #333;
`;

const DataValue = styled.dd`
  margin: 0;
  color: #555;
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: ${CONTROL_BORDER_RADIUS}px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d32f2f;
  font-size: 0.9rem;
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #0d6b5e;
  color: #0d6b5e;
  border-radius: ${CONTROL_BORDER_RADIUS}px;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: 'Hanken Grotesk', sans-serif;
  align-self: flex-start;
  margin-top: 8px;

  &:hover {
    background-color: rgba(0, 222, 198, 0.1);
  }
`;

// Custom styles for react-select to match the project's design
const selectStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9998,
  }),
  control: (base, state) => ({
    ...base,
    borderColor: CONTROL_COLOUR,
    borderRadius: CONTROL_BORDER_RADIUS,
    boxShadow: state.isFocused ? '0 0 0 2px rgba(0, 0, 0, 0.06)' : 'none',
    '&:hover': {
      borderColor: CONTROL_COLOUR,
    },
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    fontSize: '0.9rem',
    padding: '10px',
    backgroundColor: isFocused ? 'lightgray' : 'white',
    color: 'black',
    cursor: 'pointer',
    ':active': {
      ...styles[':active'],
      backgroundColor: 'lightgray',
    },
  }),
};

/**
 * Checks if a field should be visible based on the visibleWhen condition.
 * @param {Object} field - The field configuration.
 * @param {Object} formValues - Current form values.
 * @returns {boolean} Whether the field should be visible.
 */
const isFieldVisible = (field, formValues) => {
  if (!field.visibleWhen) return true;
  
  const { field: dependsOn, values, operator = 'in' } = field.visibleWhen;
  const currentValue = formValues[dependsOn];
  
  switch (operator) {
    case 'in':
      // Show if current value is in the allowed values array
      return values.includes(currentValue);
    case 'notIn':
      // Show if current value is NOT in the values array
      return !values.includes(currentValue);
    case 'equals':
      // Show if current value equals the single value
      return currentValue === values;
    case 'notEquals':
      // Show if current value does not equal the single value
      return currentValue !== values;
    case 'exists':
      // Show if the field has any value
      return currentValue !== '' && currentValue !== null && currentValue !== undefined;
    case 'notExists':
      // Show if the field has no value
      return currentValue === '' || currentValue === null || currentValue === undefined;
    default:
      return values.includes(currentValue);
  }
};

/**
 * Validates a single field value based on its type and configuration.
 * @param {*} value - The field value to validate.
 * @param {Object} field - The field configuration.
 * @returns {{ isValid: boolean, error: string | null }}
 */
const validateField = (value, field) => {
  // Check required fields
  if (field.required) {
    if (value === null || value === undefined || value === '') {
      return { isValid: false, error: 'This field is required' };
    }
    // For coordinates, check both lat and lng
    if (field.type === 'coordinates') {
      if (value.lat === '' || value.lng === '' || value.lat === null || value.lng === null) {
        return { isValid: false, error: 'Both latitude and longitude are required' };
      }
    }
    // For checkbox, it must be checked if required
    if (field.type === 'checkbox' && value !== true) {
      return { isValid: false, error: 'This confirmation is required' };
    }
  }

  // Skip further validation if empty and not required
  if (value === null || value === undefined || value === '') {
    return { isValid: true, error: null };
  }

  switch (field.type) {
    case 'integer': {
      const num = parseInt(value, 10);
      if (isNaN(num)) {
        return { isValid: false, error: 'Must be a valid integer' };
      }
      if (field.min !== undefined && num < field.min) {
        return { isValid: false, error: `Must be at least ${field.min}` };
      }
      if (field.max !== undefined && num > field.max) {
        return { isValid: false, error: `Must be at most ${field.max}` };
      }
      break;
    }
    case 'float': {
      const num = parseFloat(value);
      if (isNaN(num)) {
        return { isValid: false, error: 'Must be a valid number' };
      }
      if (field.min !== undefined && num < field.min) {
        return { isValid: false, error: `Must be at least ${field.min}` };
      }
      if (field.max !== undefined && num > field.max) {
        return { isValid: false, error: `Must be at most ${field.max}` };
      }
      break;
    }
    case 'coordinates': {
      const lat = parseFloat(value.lat);
      const lng = parseFloat(value.lng);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return { isValid: false, error: 'Latitude must be between -90 and 90' };
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        return { isValid: false, error: 'Longitude must be between -180 and 180' };
      }
      break;
    }
    case 'text': {
      if (field.minLength && value.length < field.minLength) {
        return { isValid: false, error: `Must be at least ${field.minLength} characters` };
      }
      if (field.maxLength && value.length > field.maxLength) {
        return { isValid: false, error: `Must be at most ${field.maxLength} characters` };
      }
      if (field.pattern) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(value)) {
          return { isValid: false, error: field.patternError || 'Invalid format' };
        }
      }
      break;
    }
    default:
      break;
  }

  return { isValid: true, error: null };
};

/**
 * DynamicForm component renders a form with configurable fields.
 * Supports text, integer, float, coordinates, and dropdown field types.
 * Dropdown options can be fetched from API endpoints.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.config - Form configuration object.
 * @param {string} props.config.title - Form title (optional).
 * @param {string} props.config.submitEndpoint - API endpoint for form submission.
 * @param {string} [props.config.submitMethod='POST'] - HTTP method for submission.
 * @param {Array} props.config.fields - Array of field configuration objects.
 * @param {string} props.config.fields[].id - Unique field identifier.
 * @param {string} props.config.fields[].name - Field name (used as form data key).
 * @param {string} props.config.fields[].label - Field label displayed to user.
 * @param {string} props.config.fields[].type - Field type: 'text', 'integer', 'float', 'coordinates', 'dropdown'.
 * @param {boolean} [props.config.fields[].required=false] - Whether the field is required.
 * @param {string} [props.config.fields[].placeholder] - Placeholder text.
 * @param {string} [props.config.fields[].helpText] - Help text displayed below the field.
 * @param {*} [props.config.fields[].defaultValue] - Default value for the field.
 * @param {number} [props.config.fields[].min] - Minimum value (for integer/float).
 * @param {number} [props.config.fields[].max] - Maximum value (for integer/float).
 * @param {number} [props.config.fields[].minLength] - Minimum length (for text).
 * @param {number} [props.config.fields[].maxLength] - Maximum length (for text).
 * @param {string} [props.config.fields[].pattern] - Regex pattern (for text).
 * @param {string} [props.config.fields[].patternError] - Custom error message for pattern validation.
 * @param {string} [props.config.fields[].optionsEndpoint] - API endpoint for dropdown options.
 * @param {string} [props.config.fields[].optionValueKey='value'] - Key for option value in API response.
 * @param {string} [props.config.fields[].optionLabelKey='label'] - Key for option label in API response.
 * @param {Array} [props.config.fields[].options] - Static options for dropdown (if not using API).
 * @param {Object} [props.config.fields[].visibleWhen] - Conditional visibility configuration.
 * @param {string} props.config.fields[].visibleWhen.field - The field ID this visibility depends on.
 * @param {Array|*} props.config.fields[].visibleWhen.values - Values that make this field visible.
 * @param {string} [props.config.fields[].visibleWhen.operator='in'] - Comparison operator: 'in', 'notIn', 'equals', 'notEquals', 'exists', 'notExists'.
 * @param {string} [props.bgColor='#007bff'] - Primary color for buttons.
 * @param {Function} [props.onSubmitSuccess] - Callback after successful submission.
 * @param {Function} [props.onSubmitError] - Callback after submission error.
 * @returns {JSX.Element} The rendered DynamicForm component.
 *
 * @example
 * const formConfig = {
 *   title: 'Add New Location',
 *   submitEndpoint: '/api/locations',
 *   fields: [
 *     { id: 'name', name: 'name', label: 'Location Name', type: 'text', required: true },
 *     { id: 'capacity', name: 'capacity', label: 'Capacity', type: 'integer', min: 0 },
 *     { id: 'coords', name: 'coordinates', label: 'Coordinates', type: 'coordinates', required: true },
 *     {
 *       id: 'category',
 *       name: 'category_id',
 *       label: 'Category',
 *       type: 'dropdown',
 *       optionsEndpoint: '/api/metadata/categories',
 *       optionValueKey: 'id',
 *       optionLabelKey: 'name',
 *       required: true
 *     }
 *   ]
 * };
 *
 * <DynamicForm config={formConfig} bgColor="#00dec6" />
 */
export const DynamicForm = ({
  config,
  bgColor = '#007bff',
  onSubmitSuccess,
  onSubmitError,
  onCoordinateChange,
  externalCoordinates,
  onFieldChange,
}) => {
  const { title, submitEndpoint, submitMethod = 'POST', fields = [] } = config;

  // Initialize form values
  const initialValues = useMemo(() => {
    const values = {};
    fields.forEach((field) => {
      if (field.type === 'coordinates') {
        values[field.id] = field.defaultValue || { lat: '', lng: '' };
      } else if (field.type === 'checkbox') {
        values[field.id] = field.defaultValue || false;
      } else {
        values[field.id] = field.defaultValue ?? '';
      }
    });
    return values;
  }, [fields]);

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [dropdownOptions, setDropdownOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  // Service instance for API calls
  const apiService = useMemo(() => new BaseService(), []);

  // Find the coordinate field ID
  const coordinateFieldId = useMemo(() => {
    const coordField = fields.find((f) => f.type === 'coordinates');
    return coordField?.id;
  }, [fields]);

  // Handle external coordinate updates (e.g., from map click)
  useEffect(() => {
    if (!externalCoordinates || !coordinateFieldId) return;
    
    setFormValues((prev) => ({
      ...prev,
      [coordinateFieldId]: externalCoordinates,
    }));
    setTouched((prev) => ({ ...prev, [coordinateFieldId]: true }));
    
    // Also notify parent
    if (onCoordinateChange) {
      onCoordinateChange(externalCoordinates);
    }
  }, [externalCoordinates, coordinateFieldId, onCoordinateChange]);

  // Fetch dropdown options from API endpoints
  useEffect(() => {
    const dropdownFields = fields.filter(
      (field) => field.type === 'dropdown' && field.optionsEndpoint
    );

    dropdownFields.forEach(async (field) => {
      setLoadingOptions((prev) => ({ ...prev, [field.id]: true }));
      try {
        const data = await apiService.get(field.optionsEndpoint);
        const options = Array.isArray(data)
          ? data.map((item) => ({
              value: item[field.optionValueKey || 'value'],
              label: item[field.optionLabelKey || 'label'],
            }))
          : [];
        setDropdownOptions((prev) => ({ ...prev, [field.id]: options }));
      } catch (error) {
        console.error(`Error fetching options for ${field.id}:`, error);
        setDropdownOptions((prev) => ({ ...prev, [field.id]: [] }));
      } finally {
        setLoadingOptions((prev) => ({ ...prev, [field.id]: false }));
      }
    });
  }, [fields, apiService]);

  // Handle field value change
  const handleChange = useCallback((fieldId, value) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    setTouched((prev) => ({ ...prev, [fieldId]: true }));
    // Notify parent of field changes
    if (onFieldChange) {
      onFieldChange(fieldId, value);
    }
  }, [onFieldChange]);

  // Handle coordinate field change
  const handleCoordinateChange = useCallback((fieldId, coord, value) => {
    setFormValues((prev) => {
      const newCoords = { ...prev[fieldId], [coord]: value };
      // Notify parent of coordinate changes
      if (onCoordinateChange) {
        onCoordinateChange(newCoords);
      }
      return {
        ...prev,
        [fieldId]: newCoords,
      };
    });
    setTouched((prev) => ({ ...prev, [fieldId]: true }));
  }, [onCoordinateChange]);

  // Handle field blur for validation
  const handleBlur = useCallback(
    (fieldId) => {
      setTouched((prev) => ({ ...prev, [fieldId]: true }));
      const field = fields.find((f) => f.id === fieldId);
      if (field) {
        const { error } = validateField(formValues[fieldId], field);
        setErrors((prev) => ({ ...prev, [fieldId]: error }));
      }
    },
    [fields, formValues]
  );

  // Get only visible fields based on current form values
  const visibleFields = useMemo(() => {
    return fields.filter((field) => isFieldVisible(field, formValues));
  }, [fields, formValues]);

  // Validate all visible fields
  const validateAllFields = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    // Only validate visible fields
    visibleFields.forEach((field) => {
      const { isValid: fieldValid, error } = validateField(formValues[field.id], field);
      if (!fieldValid) {
        isValid = false;
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);
    // Mark all visible fields as touched
    const allTouched = {};
    visibleFields.forEach((field) => {
      allTouched[field.id] = true;
    });
    setTouched(allTouched);

    return isValid;
  }, [visibleFields, formValues]);

  // Build submission data with proper field names (only visible fields)
  const buildSubmissionData = useCallback(() => {
    const data = {};
    visibleFields.forEach((field) => {
      const value = formValues[field.id];
      const key = field.name || field.id;

      switch (field.type) {
        case 'integer':
          data[key] = value !== '' ? parseInt(value, 10) : null;
          break;
        case 'float':
          data[key] = value !== '' ? parseFloat(value) : null;
          break;
        case 'coordinates':
          // Can be stored as separate fields or as an object based on config
          if (field.separateFields) {
            data[field.latFieldName || 'latitude'] = value.lat !== '' ? parseFloat(value.lat) : null;
            data[field.lngFieldName || 'longitude'] = value.lng !== '' ? parseFloat(value.lng) : null;
          } else {
            data[key] = {
              lat: value.lat !== '' ? parseFloat(value.lat) : null,
              lng: value.lng !== '' ? parseFloat(value.lng) : null,
            };
          }
          break;
        case 'dropdown':
          data[key] = value !== '' ? value : null;
          break;
        case 'checkbox':
          data[key] = value === true;
          break;
        case 'date':
          data[key] = value !== '' ? value : null;
          break;
        default:
          data[key] = value !== '' ? value : null;
      }
    });
    return data;
  }, [visibleFields, formValues]);

  // Get display data for success message (only visible fields)
  const getDisplayData = useCallback(() => {
    const displayData = [];
    visibleFields.forEach((field) => {
      const value = formValues[field.id];
      let displayValue;

      switch (field.type) {
        case 'coordinates':
          displayValue =
            value.lat !== '' && value.lng !== ''
              ? `${value.lat}, ${value.lng}`
              : 'Not provided';
          break;
        case 'dropdown': {
          const options = dropdownOptions[field.id] || field.options || [];
          const selectedOption = options.find((opt) => opt.value === value);
          displayValue = selectedOption ? selectedOption.label : value || 'Not selected';
          break;
        }
        case 'checkbox':
          displayValue = value === true ? '✓ Confirmed' : 'Not confirmed';
          break;
        case 'date':
          displayValue = value !== '' ? value : 'Not provided';
          break;
        default:
          displayValue = value !== '' ? value : 'Not provided';
      }

      displayData.push({ label: field.label, value: displayValue });
    });
    return displayData;
  }, [visibleFields, formValues, dropdownOptions]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const data = buildSubmissionData();
      
      if (submitMethod.toUpperCase() === 'POST') {
        await apiService.post(submitEndpoint, data);
      } else {
        // For PUT or other methods, you may need to extend BaseService
        await apiService.post(submitEndpoint, data);
      }

      setSubmittedData(getDisplayData());
      onSubmitSuccess?.(data);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'An error occurred while submitting the form');
      onSubmitError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const handleReset = () => {
    setFormValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmittedData(null);
    setSubmitError(null);
  };

  // If form was submitted successfully, show confirmation
  if (submittedData) {
    return (
      <FormContainer as="div">
        {title && <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>{title}</h3>}
        <SuccessMessage>
          <SuccessHeader>
            <CheckCircleIcon style={{ width: 24, height: 24 }} />
            Submission Successful
          </SuccessHeader>
          <SubmittedDataList>
            {submittedData.map((item, index) => (
              <React.Fragment key={index}>
                <DataLabel>{item.label}:</DataLabel>
                <DataValue>{item.value}</DataValue>
              </React.Fragment>
            ))}
          </SubmittedDataList>
          <ResetButton type="button" onClick={handleReset}>
            Submit Another Entry
          </ResetButton>
        </SuccessMessage>
      </FormContainer>
    );
  }

  // Render field based on type
  const renderField = (field) => {
    const value = formValues[field.id];
    const error = touched[field.id] ? errors[field.id] : null;

    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            id={field.id}
            name={field.name || field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            disabled={isSubmitting}
          />
        );

      case 'integer':
        return (
          <Input
            type="number"
            id={field.id}
            name={field.name || field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={1}
            disabled={isSubmitting}
          />
        );

      case 'float':
        return (
          <Input
            type="number"
            id={field.id}
            name={field.name || field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step || 'any'}
            disabled={isSubmitting}
          />
        );

      case 'coordinates':
        return (
          <CoordinateContainer>
            <CoordinateField>
              <CoordinateLabel>Latitude</CoordinateLabel>
              <CoordinateInput
                type="number"
                value={value.lat}
                onChange={(e) => handleCoordinateChange(field.id, 'lat', e.target.value)}
                onBlur={() => handleBlur(field.id)}
                placeholder={field.latPlaceholder || 'e.g., 53.4808'}
                min={-90}
                max={90}
                step="any"
                disabled={isSubmitting}
              />
            </CoordinateField>
            <CoordinateField>
              <CoordinateLabel>Longitude</CoordinateLabel>
              <CoordinateInput
                type="number"
                value={value.lng}
                onChange={(e) => handleCoordinateChange(field.id, 'lng', e.target.value)}
                onBlur={() => handleBlur(field.id)}
                placeholder={field.lngPlaceholder || 'e.g., -2.2426'}
                min={-180}
                max={180}
                step="any"
                disabled={isSubmitting}
              />
            </CoordinateField>
          </CoordinateContainer>
        );

      case 'dropdown': {
        const options = dropdownOptions[field.id] || field.options || [];
        const selectedOption = options.find((opt) => opt.value === value) || null;
        const isLoading = loadingOptions[field.id];

        return (
          <Select
            inputId={field.id}
            name={field.name || field.id}
            options={options}
            value={selectedOption}
            onChange={(opt) => handleChange(field.id, opt ? opt.value : '')}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder || 'Select...'}
            styles={selectStyles}
            menuPlacement="auto"
            menuPortalTarget={document.body}
            isClearable={!field.required}
            isLoading={isLoading}
            isDisabled={isSubmitting}
          />
        );
      }

      case 'date':
        return (
          <DateInput
            type="date"
            id={field.id}
            name={field.name || field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            min={field.min}
            max={field.max}
            disabled={isSubmitting}
          />
        );

      case 'checkbox':
        return (
          <CheckboxContainer>
            <CheckboxInput
              type="checkbox"
              id={field.id}
              name={field.name || field.id}
              checked={value === true}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              onBlur={() => handleBlur(field.id)}
              disabled={isSubmitting}
              $accentColor={bgColor}
            />
            <CheckboxLabel htmlFor={field.id}>
              {field.checkboxLabel || field.label}
            </CheckboxLabel>
          </CheckboxContainer>
        );

      default:
        return (
          <Input
            type="text"
            id={field.id}
            name={field.name || field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder}
            disabled={isSubmitting}
          />
        );
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {title && <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{title}</h3>}

      {submitError && (
        <ErrorMessage>
          <ExclamationCircleIcon style={{ width: 20, height: 20, flexShrink: 0 }} />
          {submitError}
        </ErrorMessage>
      )}

      {visibleFields.map((field) => (
        <FieldGroup key={field.id}>
          {/* Checkboxes have their own label - don't render separate label */}
          {field.type !== 'checkbox' && (
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <RequiredAsterisk>*</RequiredAsterisk>}
            </Label>
          )}
          {renderField(field)}
          {touched[field.id] && errors[field.id] && (
            <ErrorText>{errors[field.id]}</ErrorText>
          )}
          {field.helpText && !errors[field.id] && (
            <HelpText>{field.helpText}</HelpText>
          )}
        </FieldGroup>
      ))}

      <SubmitButton type="submit" $bgColor={bgColor} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            Submitting <Spinner />
          </>
        ) : (
          'Submit'
        )}
      </SubmitButton>
    </FormContainer>
  );
};
