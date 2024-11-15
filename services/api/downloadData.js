import { create } from "lodash";
import BaseService from "./Base";
import Cookies from "js-cookie";

function createQueryString(queryParams) {
    let queryString = '';

    for (const [key, value] of Object.entries(queryParams)) {
        if (Array.isArray(value)) {
            const joinedValues = value.join(`|${key}=`);
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
    // const params = this._buildQuery(options?.queryParams);
    const params = createQueryString(options?.queryParams);
    console.log(params);
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
    console.log(url);
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