import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { WarningMessage } from "./WarningMessage";

/**
 * A dismissible warning box (the shared top-right toast styling).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.message - The warning message to display.
 * @param {Function} [props.onClose] - Called when the warning's close button is clicked.
 * @param {string} [props.title="Warning"] - The heading shown above the message.
 * @returns {JSX.Element} The warning box.
 */
export const Warning = ({ message, onClose, title = "Warning" }) => (
  <WarningMessage>
    {onClose && (
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
    )}
    <div className="icon-container">
      <ExclamationCircleIcon className="warning-icon" />
    </div>
    <div className="text-container">
      <div className="warning-header">
        <div className="warning-title">{title}</div>
      </div>
      <div className="warning-content">{message}</div>
    </div>
  </WarningMessage>
);
