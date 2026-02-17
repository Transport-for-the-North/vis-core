import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { CloudArrowUpIcon, XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { api } from '../../services';
import { validateCSVFile, parseCSV } from '../../utils/csvValidation';
import { ValidationErrors } from './ValidationErrors';
import { ValidationPreview } from './ValidationPreview';

const CONTROL_COLOUR = 'rgb(220, 220, 220)';
const CONTROL_BORDER_RADIUS = 6;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => {
    if (props.$isDragging) return '#007bff';
    if (props.$hasError) return '#d32f2f';
    if (props.$isValid) return '#2e7d32';
    return CONTROL_COLOUR;
  }};
  border-radius: ${CONTROL_BORDER_RADIUS}px;
  padding: 32px;
  text-align: center;
  background-color: ${props => {
    if (props.$isDragging) return '#f0f7ff';
    if (props.$hasError) return '#ffebee';
    if (props.$isValid) return '#e8f5e9';
    return '#fafafa';
  }};
  transition: all 0.2s ease;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.6 : 1};

  &:hover:not([disabled]) {
    border-color: ${props => {
      if (props.$hasError) return '#d32f2f';
      if (props.$isValid) return '#2e7d32';
      return '#007bff';
    }};
    background-color: ${props => {
      if (props.$isDragging) return '#e6f2ff';
      if (props.$hasError) return '#ffcdd2';
      if (props.$isValid) return '#c8e6c9';
      return '#f5f5f5';
    }};
  }
`;

const UploadIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  color: ${props => {
    if (props.$hasError) return '#d32f2f';
    if (props.$isValid) return '#2e7d32';
    return '#666';
  }};
`;

const UploadText = styled.div`
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
`;

const UploadSubtext = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 4px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: ${CONTROL_BORDER_RADIUS}px;
  margin-top: 12px;
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const FileName = styled.div`
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
`;

const FileSize = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
    color: #d32f2f;
  }
`;

const StatusMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: ${CONTROL_BORDER_RADIUS}px;
  font-size: 0.9rem;
  ${props => {
    if (props.$type === 'success') {
      return `
        background-color: #e8f5e9;
        color: #2e7d32;
        border: 1px solid #c8e6c9;
      `;
    }
    if (props.$type === 'error') {
      return `
        background-color: #ffebee;
        color: #d32f2f;
        border: 1px solid #ffcdd2;
      `;
    }
    if (props.$type === 'validating') {
      return `
        background-color: #fff3cd;
        color: #856404;
        border: 1px solid #ffc107;
      `;
    }
    return '';
  }}
`;

const UploadButton = styled.button`
  padding: 12px 20px;
  background-color: ${props => props.$disabled ? '#ccc' : '#007bff'};
  color: white;
  border: none;
  border-radius: ${CONTROL_BORDER_RADIUS}px;
  font-size: 1rem;
  font-family: 'Hanken Grotesk', sans-serif;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s ease;
  margin-top: 8px;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: ${props => props.$disabled ? '#ccc' : '#0056b3'};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
  width: ${props => props.$progress || 0}%;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/**
 * FileUpload component with CSV validation support.
 * 
 * @param {Object} props
 * @param {string} props.endpoint - API endpoint for file upload (default: '/api/files/upload')
 * @param {Object} props.validationSchema - CSV validation schema
 * @param {boolean} props.validateBeforeUpload - Enable pre-upload validation (default: true)
 * @param {boolean} props.showValidationPreview - Show preview of CSV data (default: true)
 * @param {number} props.maxPreviewRows - Maximum rows to show in preview (default: 10)
 * @param {number} props.maxFileSize - Maximum file size in MB (default: 10)
 * @param {Array} props.acceptedFileTypes - Accepted MIME types (default: ['text/csv', 'application/vnd.ms-excel'])
 * @param {Function} props.onUploadSuccess - Callback when upload succeeds
 * @param {Function} props.onUploadError - Callback when upload fails
 * @param {Function} props.onValidationChange - Callback when validation status changes
 * @param {Function} props.onDataChange - Callback when parsed data or validation result changes (receives { parsedData, validationResult })
 * @param {boolean} props.disabled - Disable the component
 */
export const FileUpload = ({
  endpoint = '/api/files/upload',
  validationSchema = null,
  validateBeforeUpload = true,
  showValidationPreview = true,
  maxPreviewRows = 10,
  maxFileSize = 10,
  acceptedFileTypes = ['text/csv', 'application/vnd.ms-excel'],
  onUploadSuccess = null,
  onUploadError = null,
  onValidationChange = null,
  onDataChange = null,
  disabled = false,
}) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [parsedData, setParsedData] = useState(null); // Store parsed CSV data for preview
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Parse CSV file for preview (without validation)
  const parseFileForPreview = useCallback(async (fileToParse) => {
    setIsParsing(true);
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const csvContent = e.target.result;
            const result = parseCSV(csvContent, { hasHeader: true });
            const previewData = {
              parsedData: result.data,
              headers: result.headers,
              errors: [],
              warnings: [],
              stats: {
                totalRows: result.data.length,
                validRows: result.data.length,
                invalidRows: 0,
                totalColumns: result.headers.length,
                validColumns: result.headers.length,
                invalidColumns: 0
              }
            };
            setParsedData(previewData);
            if (onDataChange) {
              onDataChange({ parsedData: previewData, validationResult: null });
            }
            resolve(previewData);
          } catch (error) {
            reject(new Error(`Failed to parse CSV: ${error.message}`));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsText(fileToParse);
      });
    } catch (error) {
      console.error('Parse error:', error);
      setParsedData(null);
      return null;
    } finally {
      setIsParsing(false);
    }
  }, []);

  const validateFile = useCallback(async (fileToValidate) => {
    if (!validationSchema || !validateBeforeUpload) {
      return { isValid: true, errors: [], warnings: [], stats: {} };
    }

    setIsValidating(true);
    setUploadStatus({ type: 'validating', message: 'Validating CSV file...' });

    try {
      const result = await validateCSVFile(fileToValidate, validationSchema);
      // Merge with existing parsed data if available
      const finalResult = {
        ...result,
        parsedData: result.parsedData || parsedData?.parsedData,
        headers: result.headers || parsedData?.headers
      };
      setValidationResult(finalResult);
      
      if (onValidationChange) {
        onValidationChange(finalResult.isValid, finalResult.errors, finalResult.warnings);
      }
      
      if (onDataChange) {
        onDataChange({ parsedData: finalResult.parsedData ? { parsedData: finalResult.parsedData, headers: finalResult.headers } : parsedData, validationResult: finalResult });
      }

      if (finalResult.isValid) {
        setUploadStatus({ type: 'success', message: 'File validation passed!' });
      } else {
        setUploadStatus({
          type: 'error',
          message: `Validation failed: ${finalResult.errors.length} error(s) found`
        });
      }

      return finalResult;
    } catch (error) {
      const errorResult = {
        isValid: false,
        errors: [{ type: 'validation_error', message: error.message }],
        warnings: [],
        stats: {},
        // Preserve parsed data even on validation error
        parsedData: parsedData?.parsedData,
        headers: parsedData?.headers
      };
      setValidationResult(errorResult);
      setUploadStatus({ type: 'error', message: `Validation error: ${error.message}` });
      
      if (onValidationChange) {
        onValidationChange(false, errorResult.errors, []);
      }
      
      if (onDataChange) {
        onDataChange({ parsedData: parsedData, validationResult: errorResult });
      }

      return errorResult;
    } finally {
      setIsValidating(false);
    }
  }, [validationSchema, validateBeforeUpload, onValidationChange, onDataChange, parsedData]);

  const handleFileSelect = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    // Check file size
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      const error = new Error(`File size exceeds maximum of ${maxFileSize}MB`);
      setUploadStatus({ type: 'error', message: error.message });
      if (onUploadError) {
        onUploadError(error);
      }
      return;
    }

    // Check file type
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    const isValidType = acceptedFileTypes.includes(selectedFile.type) || fileExtension === 'csv';
    if (!isValidType) {
      const error = new Error(`Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`);
      setUploadStatus({ type: 'error', message: error.message });
      if (onUploadError) {
        onUploadError(error);
      }
      return;
    }

    setFile(selectedFile);
    setUploadStatus(null);
    setValidationResult(null);
    setParsedData(null);
    setUploadProgress(0);

    // Always parse file for preview first
    await parseFileForPreview(selectedFile);

    // Then validate if schema is provided
    if (validationSchema && validateBeforeUpload) {
      await validateFile(selectedFile);
    }
  }, [maxFileSize, acceptedFileTypes, validationSchema, validateBeforeUpload, validateFile, onUploadError]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [disabled, handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  }, [handleFileSelect]);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setValidationResult(null);
    setParsedData(null);
    setUploadStatus(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onValidationChange) {
      onValidationChange(true, [], []);
    }
    if (onDataChange) {
      onDataChange({ parsedData: null, validationResult: null });
    }
  }, [onValidationChange, onDataChange]);

  const handleUpload = useCallback(async () => {
    if (!file) return;

    // Re-validate if needed
    if (validationSchema && validateBeforeUpload) {
      const result = await validateFile(file);
      if (!result.isValid) {
        setUploadStatus({
          type: 'error',
          message: 'Please fix validation errors before uploading'
        });
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus({ type: 'validating', message: 'Uploading file...' });

    try {
      const response = await api.fileUploadService.uploadFile(
        endpoint,
        file,
        {
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            validationPassed: validationResult?.isValid ?? true,
          },
          onProgress: (progress) => {
            setUploadProgress(progress);
          },
        }
      );

      setUploadStatus({ type: 'success', message: 'File uploaded successfully!' });
      setUploadProgress(100);

      if (onUploadSuccess) {
        onUploadSuccess(response, file);
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: `Upload failed: ${error.message}` });
      if (onUploadError) {
        onUploadError(error, file);
      }
    } finally {
      setIsUploading(false);
    }
  }, [file, endpoint, validationSchema, validateBeforeUpload, validateFile, validationResult, onUploadSuccess, onUploadError]);

  const canUpload = file && !isValidating && !isParsing && !isUploading && 
    (!validationSchema || !validateBeforeUpload || (validationResult?.isValid ?? true));

  return (
    <Container>
      {!file ? (
        <UploadArea
          $isDragging={isDragging}
          $hasError={uploadStatus?.type === 'error'}
          $isValid={false}
          $disabled={disabled}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <UploadIcon $hasError={false} $isValid={false}>
            <CloudArrowUpIcon style={{ width: 48, height: 48 }} />
          </UploadIcon>
          <UploadText>Drag and drop your CSV file here</UploadText>
          <UploadSubtext>or click to browse</UploadSubtext>
          <UploadSubtext style={{ marginTop: '8px', fontSize: '0.8rem' }}>
            Maximum file size: {maxFileSize}MB
          </UploadSubtext>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes.join(',') + ',.csv'}
            onChange={handleFileInputChange}
            disabled={disabled}
          />
        </UploadArea>
      ) : (
        <>
          <FileInfo>
            <FileDetails>
              <UploadIcon $hasError={validationResult && !validationResult.isValid} $isValid={validationResult?.isValid}>
                {validationResult?.isValid ? (
                  <CheckCircleIcon style={{ width: 24, height: 24 }} />
                ) : validationResult && !validationResult.isValid ? (
                  <ExclamationCircleIcon style={{ width: 24, height: 24 }} />
                ) : (
                  <CloudArrowUpIcon style={{ width: 24, height: 24 }} />
                )}
              </UploadIcon>
              <div>
                <FileName>{file.name}</FileName>
                <FileSize>{formatFileSize(file.size)}</FileSize>
              </div>
            </FileDetails>
            <RemoveButton onClick={handleRemoveFile} disabled={isUploading}>
              <XMarkIcon style={{ width: 20, height: 20 }} />
            </RemoveButton>
          </FileInfo>

          {uploadStatus && (
            <StatusMessage $type={uploadStatus.type}>
              {uploadStatus.type === 'validating' && <Spinner />}
              {uploadStatus.type === 'success' && <CheckCircleIcon style={{ width: 20, height: 20 }} />}
              {uploadStatus.type === 'error' && <ExclamationCircleIcon style={{ width: 20, height: 20 }} />}
              {uploadStatus.message}
            </StatusMessage>
          )}

          {isUploading && (
            <ProgressBar>
              <ProgressFill $progress={uploadProgress} />
            </ProgressBar>
          )}

          {/* Show preview if available - from validation result or parsed data */}
          {showValidationPreview && (
            (validationResult?.parsedData ? (
              <ValidationPreview
                data={validationResult.parsedData}
                headers={validationResult.headers}
                errors={validationResult.errors}
                maxRows={maxPreviewRows}
              />
            ) : parsedData ? (
              <ValidationPreview
                data={parsedData.parsedData}
                headers={parsedData.headers}
                errors={[]}
                maxRows={maxPreviewRows}
              />
            ) : isParsing ? (
              <StatusMessage $type="validating">
                <Spinner />
                Parsing file for preview...
              </StatusMessage>
            ) : null)
          )}

          {validationResult && (
            <ValidationErrors
              errors={validationResult.errors}
              warnings={validationResult.warnings}
              stats={validationResult.stats}
            />
          )}

          <UploadButton
            onClick={handleUpload}
            disabled={!canUpload || disabled}
          >
            {isUploading ? (
              <>
                <Spinner />
                Uploading... {Math.round(uploadProgress)}%
              </>
            ) : (
              'Upload File'
            )}
          </UploadButton>
        </>
      )}
    </Container>
  );
};
