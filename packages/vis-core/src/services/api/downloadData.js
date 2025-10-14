import { create, update } from "lodash";
import BaseService from "./Base";
import Cookies from "js-cookie";
import { REQUEST_CONFIG } from "defaults";

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
    if (clonedQueryParams[key] === 0 || clonedQueryParams[key] === null || clonedQueryParams[key] === undefined) {
      delete clonedQueryParams[key];
    }
  }

  // Remove the "undefined" key if it exists
  if (clonedQueryParams.hasOwnProperty('undefined')) {
    delete clonedQueryParams['undefined'];
  }

  // Process each parameter that is an array
  for (const key of Object.keys(clonedQueryParams)) {
    const paramValue = clonedQueryParams[key];
    if (Array.isArray(paramValue)) {
      clonedQueryParams[key] = paramValue
        .map(item => {
          // Check if the item is a non-null object and not an array
          if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
            if (typeof item.value !== 'undefined') {
              return item.value; // Extract 'value' if present
            } else {
              console.warn(`Object in array parameter '${key}' lacks a 'value' property.`);
              return null; // Mark for removal
            }
          } else {
            return item; // Return primitives, arrays, or null as-is
          }
        })
        .filter(value => value !== null); // Remove null values
    }
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
     * Checks if a GET request to the specified path with the given query parameters would exceed size limits.
     * Only relevant for GET requests, as POST requests can handle larger payloads.
     * 
     * @param {string} [subPath=""] - The sub-path for the request.
     * @param {Object} [queryParams={}] - The query parameters for the request.
     * @returns {Object} An object containing { isValid: boolean, size: number, error: string|null }
     */
    checkGetRequestSize(subPath = "", queryParams = {}) {
      const processedParams = updateQueryParams(queryParams);
      const params = createQueryString(processedParams);
      const path = params ? `${subPath}?${params}` : subPath;
      const url = this._buildUrl(path);
      
      const requestLength = new TextEncoder().encode(url).length;
      const isValid = requestLength <= REQUEST_CONFIG.MAX_GET_REQUEST_SIZE;
      
      return {
        isValid,
        size: requestLength,
        error: isValid ? null : REQUEST_CONFIG.ERROR_MESSAGES.REQUEST_TOO_LARGE(requestLength)
      };
    }
  
  /**
   * Downloads a csv from the specified path with query parameters.
   *
   * @param {string} [subPath=""] - The sub-path for the file request.
   * @param {Object} [options={}] - Additional options, including query parameters and headers.
   * @property {Object} [options.queryParams={}] - The query parameters for the request.
   * @property {boolean} [options.skipAuth=false] - Flag to skip adding Authorization header.
   * @property {Object} [options.headers={}] - Additional headers for the request.
   * @property {string} [options.method="GET"] - HTTP method to use for the request.
   * @returns {Promise<void>} Resolves when the download is initiated.
   * @throws {Error} If the GET request exceeds the maximum size limit.
   */
  async downloadCsv(subPath = "", options = { queryParams: {}, skipAuth: false, headers: {}, method: "GET" }) {
    console.log(options?.queryParams);
    const queryParams = updateQueryParams(options?.queryParams);
    const method = options.method?.toUpperCase() || "GET";
    
    // Check the length of the URL only if it's a GET request
    if (method === "GET") {
      const { isValid, error } = this.checkGetRequestSize(subPath, options.queryParams);
      if (!isValid) {
        throw new Error(error);
      }
    }
    
    const params = createQueryString(queryParams);
    const path = params && method === 'GET' ? `${subPath}?${params}` : subPath;
    const url = this._buildUrl(path);
    
    const jwtToken = options.skipAuth ? null : Cookies.get("token");
    const fetchOptions = {
      method: method,
      headers: {
        ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        ...options.headers,
      },
    };
    
    // If method is not GET and we have query parameters, move them to the request body
    if (method !== "GET" && Object.keys(queryParams).length > 0) {
      fetchOptions.body = JSON.stringify(queryParams);
      fetchOptions.headers = {
        ...fetchOptions.headers,
        "Content-Type": "application/json",
      };
    }
    
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