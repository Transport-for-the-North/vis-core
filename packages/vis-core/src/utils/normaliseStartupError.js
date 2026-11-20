/**
 * Maps runtime/bootstrap errors into the structure expected by ErrorOverlay.
 *
 * @param {Error} error 
 * @returns {Object} 
 */
export function normaliseStartupError(error) {
  const status = error?.status;

  const technicalDetails = `${error?.message || String(error)}${
    error?.url ? `\nURL: ${error.url}` : ""
  }`;

  switch (true) {
    case status === 403:
      return {
        title: "Access Denied",
        subtitle: "You do not have permission to access this resource",
        message:
          "The application could not load because access to a required resource was denied.",
        supportMessage:
          "Please contact support if you believe you should have access.",
        supportDetails:
          "Include the page URL and the time of the error when reporting this issue.",
        technicalDetails,
        headerColor: "#c62828",
        showTechnicalDetails: true
      };

    case status >= 500:
      return {
        title: "Server Error",
        subtitle: "A server error occurred while loading the application",
        message:
          "The application could not load required configuration from the server.",
        supportMessage:
          "Please try again later or contact support if the issue persists.",
        supportDetails:
          "If reporting this issue, include the time and any relevant request details.",
        technicalDetails,
        headerColor: "#c62828",
        showTechnicalDetails: true
      };

    default:
      return {
        title: "Application Error",
        subtitle: "Failed to load application configuration",
        message:
          "The application could not start because a required configuration request failed.",
        supportMessage:
          "Please refresh the page or contact support if the issue persists.",
        supportDetails:
          "Include the page URL and any visible error details when reporting this issue.",
        technicalDetails: error?.stack || technicalDetails,
        headerColor: "#d32f2f",
        showTechnicalDetails: true
      };
  }
}