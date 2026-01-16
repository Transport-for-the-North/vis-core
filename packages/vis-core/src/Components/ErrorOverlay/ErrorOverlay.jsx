import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  overflow-y: auto;
`;

const ErrorContainer = styled.div`
  background: white;
  border-radius: 8px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  margin: auto 0;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
`;

const ErrorHeader = styled.div`
  background: ${props => props.$color || '#d32f2f'};
  color: white;
  padding: 24px;
  text-align: left;
`;

const ErrorTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  text-align: left;
`;

const ErrorSubtitle = styled.p`
  margin: 0;
  font-size: 16px;
  opacity: 0.95;
  text-align: left;
`;

const ErrorContent = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

const ErrorMessage = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
`;

const ErrorMessageText = styled.p`
  margin: 0;
  color: #856404;
  font-size: 14px;
  line-height: 1.6;
  text-align: left;
`;

const SupportBox = styled.div`
  background: #f5f5f5;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
`;

const SupportText = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  text-align: left;
`;

const ContactInfo = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  text-align: left;
`;

const CollapsibleSection = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const CollapsibleHeader = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: #fafafa;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: background 0.2s;
  text-align: left;

  &:hover {
    background: #f0f0f0;
  }

  &:focus {
    outline: 2px solid #1976d2;
    outline-offset: -2px;
  }
`;

const ChevronIcon = styled.span`
  transition: transform 0.2s;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  display: inline-block;
  font-size: 12px;
`;

const CollapsibleContent = styled.div`
  background: white;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  padding: 16px;
  border-top: 1px solid #e0e0e0;
`;

const ErrorDetails = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 13px;
  background: #f8f8f8;
  padding: 12px;
  border-radius: 4px;
  color: #d32f2f;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
`;

/**
 * Generic ErrorOverlay component for displaying errors with support contact and technical details.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Main error title
 * @param {string} props.subtitle - Error subtitle
 * @param {string|React.ReactNode} props.message - Error message to display
 * @param {string} props.supportMessage - Support contact message
 * @param {string} props.supportDetails - Additional support details
 * @param {string|React.ReactNode} props.technicalDetails - Technical details to show in collapsible section
 * @param {string} props.headerColor - Header background color (default: #d32f2f)
 * @param {boolean} props.showTechnicalDetails - Whether to show technical details section (default: true)
 * @returns {JSX.Element} Error overlay component
 */
export const ErrorOverlay = ({ 
  title = 'Error',
  subtitle = 'Something went wrong',
  message,
  supportMessage = 'Please contact support for assistance',
  supportDetails,
  technicalDetails,
  headerColor,
  showTechnicalDetails = true
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  return (
    <Overlay>
      <ErrorContainer>
        <ErrorHeader $color={headerColor}>
          <ErrorTitle>{title}</ErrorTitle>
          <ErrorSubtitle>{subtitle}</ErrorSubtitle>
        </ErrorHeader>
        
        <ErrorContent>
          {message && (
            <ErrorMessage>
              <ErrorMessageText>
                {message}
              </ErrorMessageText>
            </ErrorMessage>
          )}

          <SupportBox>
            <SupportText>{supportMessage}</SupportText>
            {supportDetails && (
              <ContactInfo>{supportDetails}</ContactInfo>
            )}
          </SupportBox>

          {showTechnicalDetails && technicalDetails && (
            <CollapsibleSection>
              <CollapsibleHeader 
                onClick={toggleDetails}
                aria-expanded={isDetailsOpen}
                aria-controls="error-details"
              >
                <span>Technical Details</span>
                <ChevronIcon $isOpen={isDetailsOpen}>▼</ChevronIcon>
              </CollapsibleHeader>
              <CollapsibleContent 
                id="error-details" 
                $isOpen={isDetailsOpen}
                role="region"
              >
                <ErrorDetails>
                  {technicalDetails}
                </ErrorDetails>
              </CollapsibleContent>
            </CollapsibleSection>
          )}
        </ErrorContent>
      </ErrorContainer>
    </Overlay>
  );
};

