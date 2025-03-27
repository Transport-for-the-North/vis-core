import React, { useState, useEffect } from "react";
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { WarningMessage } from "Components";
import { api } from "services";

/**
 * Component to render a warning message.
 * @param {Object} props - The component props.
 * @param {string} props.message - The warning message to display.
 * @param {Function} props.onClose - Function to call when the warning is closed.
 * @returns {JSX.Element} The warning message component.
 */
const Warning = ({ message, onClose }) => (
  <WarningMessage>
    <button className="close-button" onClick={onClose}>
      &times;
    </button>
    <div className="icon-container">
      <ExclamationCircleIcon className="warning-icon" />
    </div>
    <div className="text-container">
      <div className="warning-header">
        <div className="warning-title">Warning</div>
      </div>
      <div className="warning-content">
        {message}
      </div>
    </div>
  </WarningMessage>
);

/**
 * Higher-Order Component that adds a warning message to the wrapped component.
 * It can handle both static and dynamic warnings.
 * @param {React.ComponentType} WrappedComponent - The component to wrap.
 * @returns {React.ComponentType} The wrapped component with a warning message if applicable.
 */
export const withWarning = (WrappedComponent) => {
  return (props) => {
    const { pageConfig } = props;
    const [isVisible, setIsVisible] = useState(true);
    const [dynamicMessage, setDynamicMessage] = useState(null);

    const handleClose = () => {
      setIsVisible(false);
    };

    useEffect(() => {
      const fetchData = async () => {
        const dynamicWarningConfig = pageConfig.config?.additionalFeatures?.dynamicWarning;
        if (dynamicWarningConfig && dynamicWarningConfig.url && dynamicWarningConfig.template) {
          const controller = new AbortController();
          try {
            const response = await api.baseService.get(dynamicWarningConfig.url, { signal: controller.signal });
            console.log("Response Body:", response);
            const data = response.data;
            const message = response.message;
            let dynamicMessage = dynamicWarningConfig.template.replace(/{(\w+)}/g, (_, key) => data || '');
            if (message) {
              dynamicMessage += 
                '\n</span><span class="si">${</span><span class="nx">message</span><span class="si">}</span><span class="sb">';
            }
            setDynamicMessage(dynamicMessage);
          } catch (error) {
            if (error.name !== "AbortError") {
              console.error("Error fetching dynamic warning data:", error);
            }
          }
          return () => {
            controller.abort();
          };
        }
      };
      fetchData();
    }, [pageConfig]);

    const staticWarning = pageConfig.config?.additionalFeatures?.warning;
    const warningMessage = dynamicMessage || staticWarning;

    return (
      <>
        {warningMessage && isVisible && (
          <Warning message={warningMessage} onClose={handleClose} />
        )}
        <WrappedComponent {...props} />
      </>
    );
  };
};