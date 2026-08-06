import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Context for managing application-level toast notifications.
 * @type {React.Context<{addToast: Function, removeToast: Function}>}
 */
export const ToastContext = createContext();

/**
 * Custom hook to access toast notification methods.
 * Safely falls back to empty functions if the provider is missing.
 * @returns {{ addToast: ({id: string, message: string, type?: 'info'|'warning'|'error', duration?: number}) => string, removeToast: (id: string) => void }}
 */
export const useToast = () => useContext(ToastContext) || { addToast: () => {}, removeToast: () => {} };

const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ToastWrapper = styled.div`
  pointer-events: auto;
  background-color: #333;
  color: white;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 90vw;
  animation: ${slideUp} 0.3s ease-out forwards;
  position: relative;
  overflow: hidden;

  ${({ $type }) => $type === 'warning' && `
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeeba;
  `}
  ${({ $type }) => $type === 'error' && `
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  `}
  ${({ $type }) => $type === 'info' && `
    background-color: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  `}
`;

const ToastHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  padding: 0;
  font-size: 18px;
  line-height: 1;
  &:hover { opacity: 1; }
`;

const progressAnim = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

const ProgressBar = styled.div`
  height: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  animation: ${progressAnim} ${({ $duration }) => $duration}ms linear forwards;
`;

/**
 * Renders an individual toast message with an optional progress bar for timed dismissals.
 * @component ToastMessage
 * @param {Object} props - The component props.
 * @param {Object} props.toast - The toast object containing id, message, type, and duration.
 * @param {Function} props.onClose - Callback function triggered to remove the toast.
 * @returns {JSX.Element} The rendered ToastMessage component.
 */
const ToastMessage = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => onClose(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return (
    <ToastWrapper $type={toast.type}>
      <ToastHeader>
        <span>{toast.message}</span>
        <CloseButton onClick={() => onClose(toast.id)}>&times;</CloseButton>
      </ToastHeader>
      {toast.duration > 0 && <ProgressBar $duration={toast.duration} />}
    </ToastWrapper>
  );
};

/**
 * Provider component for the ToastContext.
 * Wraps its children to grant them access to the global notification system.
 * @component ToastProvider
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The rendered ToastProvider component.
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ id, message, type = 'info', duration = 0 }) => {
    const toastId = id || Date.now().toString();
    setToasts((prev) => {
      if (prev.find(t => t.id === toastId)) return prev;
      return [...prev, { id: toastId, message, type, duration }];
    });
    return toastId;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};
