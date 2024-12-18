import { create, update } from "lodash";
import BaseService from "./Base";
import Cookies from "js-cookie";

function createQueryString(queryParams) {
    /**
     * Creates the query string from the query parameters, e.g. adding %2C for multiple choices for the
     * same query parameters and adding & between new query parameter entries.
     */
    let queryString = '';

    for (const [key, value] of Object.entries(queryParams)) {
        if (Array.isArray(value)) {
            const joinedValues = value.join(`%2C`);
            queryString += `${key}=${joinedValues}&`;
        } else {
            queryString += `${key}=${value}&`;
        }
    }

    // Remove the trailing '&' if it exists
    if (queryString.endsWith('&')) {
        queryString = queryString.slice(0, -1);
    }

    return queryString;
}

/**
 * Updates the query parameters appropriately, mainly with the zoneIds if they exist.
 * Removes any undefined entries which might be an issue also.
*/
function updateQueryParams(queryParams) {
  
  // Check if queryParams is falsy and return it as is
  if (!queryParams) {
    return queryParams;
  }

  // Create a shallow clone of the queryParams object
  const clonedQueryParams = { ...queryParams };

  // Remove keys with values of 0 or null
  for (const key in clonedQueryParams) {
    if (clonedQueryParams[key] === 0 || clonedQueryParams[key] === null) {
      delete clonedQueryParams[key];
    }
  }

  // Remove the "undefined" key if it exists
  if (clonedQueryParams.hasOwnProperty('undefined')) {
    delete clonedQueryParams['undefined'];
  }

  // If zoneId is an array, update it with the 'value' from each dictionary
  if (Array.isArray(clonedQueryParams.zoneId)) {
    clonedQueryParams.zoneId = clonedQueryParams.zoneId.map(item => {
      if (item && typeof item.value !== 'undefined') {
        return parseInt(item.value, 10);
      }
      return null;
    }).filter(value => value !== null); // Remove any null values
  }

  return clonedQueryParams;
}


export class DownloadService extends BaseService {
    /**
     * Constructs a new GeodataService instance.
     * @constructor
     * @param {Object} options - Optional configuration options.
     */
    constructor(options = {}) {
      super({ pathPrefix: "", ...options });
    }
  
    /**
     * Fetches metadata for all features in the specified table.
     * @param {string} tableName - The name of the table.
     * @param {Object} [options] - Additional options for the request.
     * @param {string} [options.zoneTypeId] - The zone type ID.
     * @returns {Promise<Array>} The metadata of the features.
     */
    JavaScript
  /**
   * Downloads a csv from the specified path with query parameters.
   *
   * @param {string} [subPath=""] - The sub-path for the file request.
   * @param {Object} [options={}] - Additional options, including query parameters and headers.
   * @property {Object} [options.queryParams={}] - The query parameters for the request.
   * @property {boolean} [options.skipAuth=false] - Flag to skip adding Authorization header.
   * @property {Object} [options.headers={}] - Additional headers for the request.
   * @returns {Promise<void>} Resolves when the download is initiated.
   */
  async downloadCsv(subPath = "", options = { queryParams: {}, skipAuth: false, headers: {} }) {
    console.log(options?.queryParams);
    const queryParams = updateQueryParams(options?.queryParams);
    const params = createQueryString(queryParams);
    const path = params ? `${subPath}?${params}` : subPath;
    const url = this._buildUrl(path);
    const jwtToken = options.skipAuth ? null : Cookies.get("token");
    const fetchOptions = {
      method: "GET",
      headers: {
        ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        ...options.headers,
      },
    };
    const response = await fetch(url, fetchOptions).catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    // Extract filename from Content-Disposition header, if available
    let filename = "download.csv"; // Default filename
    const disposition = response.headers.get("Content-Disposition");
    if (disposition && disposition.indexOf("attachment") !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
      }
    }
    // Create a URL and trigger the download
    const urlBlob = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(urlBlob);
  }
};