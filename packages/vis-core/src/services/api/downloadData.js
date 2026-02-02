import BaseService from "./Base";
import Cookies from "js-cookie";
import { REQUEST_CONFIG } from "defaults";

/**
 * Updates the query parameters appropriately.
 * - Removes 0/null/undefined entries.
 * - Extracts `.value` from array items that are objects (e.g. select options).
 *
 * @param {Record<string, any>} queryParams
 * @returns {Record<string, any>}
 */
function updateQueryParams(queryParams) {
  
  // Check if queryParams is falsy and return it as is
  if (!queryParams) {
    return queryParams;
  }

  const cloned = { ...queryParams };

  for (const key in cloned) {
    if (cloned[key] === 0 || cloned[key] === null || cloned[key] === undefined) {
      delete cloned[key];
    }
  }

  if (Object.prototype.hasOwnProperty.call(cloned, "undefined")) {
    delete cloned.undefined;
  }

  for (const key of Object.keys(cloned)) {
    const val = cloned[key];
    if (Array.isArray(val)) {
      cloned[key] = val
        .map((item) => {
          if (item !== null && typeof item === "object" && !Array.isArray(item)) {
            if (typeof item.value !== "undefined") return item.value;
            console.warn(`Object in array parameter '${key}' lacks a 'value' property.`);
            return null;
          }
          return item;
        })
        .filter((v) => v !== null);
    }
  }

  return cloned;
}

export class DownloadService extends BaseService {
  /**
   * Constructs a new DownloadService instance.
   * @constructor
   * @param {Object} options
   */
  constructor(options = {}) {
    super({ pathPrefix: "", ...options });
  }

  /**
   * Checks if a GET request to the specified path with the given query parameters would exceed size limits.
   * Uses BaseService query building (arrays default to CSV; URL-encoded).
   * Only relevant for GET requests, as POST requests can handle larger payloads.
   * 
   * @param {string} [subPath=""] - The sub-path for the request.
   * @param {Object} [queryParams={}] - The query parameters for the request.
   * @returns {Object} An object containing { isValid: boolean, size: number, error: string|null }
 */
  checkGetRequestSize(subPath = "", queryParams = {}) {
    const processedParams = updateQueryParams(queryParams);
    const qs = this._buildQueryString(processedParams);
    const path = qs ? `${subPath}?${qs}` : subPath;
    const url = this._buildUrl(path);

    const requestLength = new TextEncoder().encode(url).length;
    const isValid = requestLength <= REQUEST_CONFIG.MAX_GET_REQUEST_SIZE;

    return {
      isValid,
      size: requestLength,
      error: isValid
        ? null
        : REQUEST_CONFIG.ERROR_MESSAGES.REQUEST_TOO_LARGE(requestLength),
    };
  }

  /**
   * Downloads a CSV file or a Shapefile ZIP archive from the specified path with query parameters.
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
  async downloadFile(subPath = "", options = { queryParams: {}, skipAuth: false, headers: {}, method: "GET" }) {
    console.log(options?.queryParams);
    const queryParams = updateQueryParams(options?.queryParams);
    const method = options.method?.toUpperCase() || "GET";
    
    // Check the length of the URL only if it's a GET request
    if (method === "GET") {
      const { isValid, error } = this.checkGetRequestSize(subPath, options.queryParams);
      if (!isValid) throw new Error(error);
    }

    const qs = this._buildQueryString(queryParams);
    const path = qs && method === "GET" ? `${subPath}?${qs}` : subPath;
    const url = this._buildUrl(path);

    const jwtToken = options.skipAuth ? null : Cookies.get("token");
    const fetchOptions = {
      method,
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

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const blob = await response.blob();
    
    // Assign file name based on url
    let filename = null;
    if (url.includes("shapefile")) {
      filename = "downloads.zip";
    } else {
      filename = "downloads.csv";
    }
    
    // Extract filename from Content-Disposition header, if available
    const disposition = response.headers.get("Content-Disposition");
    if (disposition && disposition.indexOf("attachment") !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, "");
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
}