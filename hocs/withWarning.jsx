import React, { useState } from "react";
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { WarningMessage } from "Components";

/**
 * Higher-Order Component that adds a warning message to the wrapped component if the pageConfig contains a warning property.
 * @param {React.ComponentType} WrappedComponent - The component to wrap.
 * @returns {React.ComponentType} The wrapped component with a warning message if applicable.
 */
export const withWarning = (WrappedComponent) => {
  return (props) => {
    const { pageConfig } = props;
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
      setIsVisible(false);
    };

    return (
      <>
        {pageConfig.config?.additionalFeatures?.warning && isVisible && (
          <WarningMessage>
            <button className="close-button" onClick={handleClose}>
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
                {pageConfig.config?.additionalFeatures?.warning}
              </div>
            </div>
          </WarningMessage>
        )}
        <WrappedComponent {...props} />
      </>
    );
  };
};
