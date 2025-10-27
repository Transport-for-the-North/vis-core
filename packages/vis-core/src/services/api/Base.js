import Cookies from "js-cookie";
import { getProdOrDev, getApiBaseDomain, getApiBaseDomainDev } from "../../defaults"; 

class BaseService {
  /**
   * Creates an instance of BaseService.
   * @constructor
   * @param {Object} [config={ pathPrefix: "" }] - The configuration object.
   * @property {string} config.pathPrefix - The prefix to be added to the path.
   * @property {string} [config.pathPostfix] - The postfix to be added to the path.
   */
  constructor(config = { pathPrefix: "" }) {
    const postFix = config?.pathPostfix ?? "";
    const mode = (getProdOrDev() || "").toLowerCase();
    const rawBase = mode === "production" ? (getApiBaseDomain() || "") : (getApiBaseDomainDev() || "");
    this._apiBaseUrl = rawBase.trim().replace(/\/+$/, "");
    if (!this._apiBaseUrl) {
      throw new Error(
        `API base URL is not set. Provide ${
          mode === "production" ? "VITE_API_BASE_DOMAIN" : "VITE_API_BASE_DOMAIN_DEV"
        } (full URL incl. protocol, e.g. http://localhost:7177).`
      );
    }
    this._apiBaseUrl = `${this._apiBaseUrl}${postFix}`;
    this._pathPrefix = config?.pathPrefix ?? "";
  }

  /**
   * Builds the full URL using the base URL, path prefix, and provided path.
   * @param {string} path - The path to be appended to the base URL.
   * @returns {string} The full URL.
   */
  _buildUrl(path) {
    let url = this._apiBaseUrl;
    if (this._pathPrefix) url += `/${this._pathPrefix}`;
    url += `${path}`;
    return url;
  }

  /**
   * Builds a query string from a dictionary of query parameters.
   *
   * @param {Object} [queryDict={}] - The dictionary of query parameters.
   * @returns {string} The query string.
   */
  _buildQuery(queryDict = {}) {
    const tokens = this._makeParamTokens(
      ...this._splitDuplicateAndNonDuplicateParams(queryDict)
    );
    return tokens.map(([param, value]) => `${param}=${value}`).join("&");
  }

  /**
   * Splits the query parameters into duplicate and non-duplicate parameters.
   *
   * @param {Object} queryDict - The dictionary of query parameters.
   * @returns {Array} An array containing two dictionaries: one for non-duplicate parameters and one for duplicate parameters.
   */
  _splitDuplicateAndNonDuplicateParams(queryDict) {
    const duplicateParams = Object.fromEntries(
      Object.entries(queryDict).filter(([_, value]) => Array.isArray(value))
    );
    const nonDuplicateParams = Object.fromEntries(
      Object.entries(queryDict).filter(([_, value]) => !Array.isArray(value))
    );
    return [nonDuplicateParams, duplicateParams];
  }

  /**
   * Creates an array of parameter tokens from the non-duplicate and duplicate parameters.
   *
   * @param {Object} [nonDuplicateParams={}] - The dictionary of non-duplicate parameters.
   * @param {Object} [duplicateParams={}] - The dictionary of duplicate parameters.
   * @returns {Array} An array of parameter tokens.
   */
  _makeParamTokens(nonDuplicateParams = {}, duplicateParams = {}) {
    const tokens = [];
    Object.entries(nonDuplicateParams).forEach(([key, value]) =>
      tokens.push([key, value])
    );
    Object.entries(duplicateParams).forEach(([key, arr]) =>
      arr.forEach((value) => tokens.push([key, value]))
    );
    return tokens;
  }

  /**
   * Makes a GET request to the specified path with additional options.
   *
   * @param {string} path - The path for the GET request.
   * @param {Object} [addOptions={}] - Additional options for the fetch request.
   * @param {boolean} [skipAuth=false] - Flag to skip adding Authorization header.
   * @returns {Promise<Object>} The response data.
   */
  async _get(path, addOptions = {}, skipAuth = false) {
    const url = this._buildUrl(path);
    const jwtToken = skipAuth ? null : Cookies.get("token");
    const options = {
      method: "GET",
      headers: {
        ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        ...addOptions.headers,
      },
      ...addOptions,
    };
    const result = await fetch(url, options).catch((error) =>
      console.log(error)
    );
    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }
    const data = await result.json();
    return data;
  }

  /**
   * Makes a GET request to the specified sub-path with query parameters.
   *
   * @param {string} [subPath=""] - The sub-path for the GET request.
   * @param {Object} [options={}] - Additional options, including query parameters.
   * @property {Object} [options.queryParams={}] - The query parameters for the GET request.
   * @param {boolean} [options.skipAuth=false] - Flag to skip adding Authorization header.
   * @returns {Promise<Object>} The response data.
   */
  async get(subPath = "", options = { queryParams: {}, skipAuth: false }) {
    const params = this._buildQuery(options?.queryParams);
    const path = params ? `${subPath}?${params}` : subPath;
    const results = await this._get(path, {}, options.skipAuth);
    return results;
  }

  /**
   * Makes a POST request to the specified path with data and additional options.
   *
   * @param {string} path - The path for the POST request.
   * @param {Object} data - The data to be sent in the request body.
   * @param {Object} [addOptions={}] - Additional options for the fetch request.
   * @param {boolean} [skipAuth=false] - Flag to skip adding Authorization header.
   * @returns {Promise<Object>} The response data.
   */
  async _post(path, data, addOptions = {}, skipAuth = false) {
    const url = this._buildUrl(path);
    const jwtToken = skipAuth ? null : Cookies.get("token"); // Get the JWT token from cookies if skipAuth is false
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        ...addOptions.headers,
      },
      body: JSON.stringify(data),
      ...addOptions,
    };
    const result = await fetch(url, options).catch((error) =>
      console.log(error)
    );
    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }
    const responseData = await result.json();
    return responseData;
  }
  /**
   * Makes a POST request to the specified path with data and query parameters.
   *
   * @param {string} [subPath=""] - The sub-path for the POST request.
   * @param {Object} data - The data to be sent in the request body.
   * @param {Object} [options={}] - Additional options, including query parameters.
   * @property {Object} [options.queryParams={}] - The query parameters for the POST request.
   * @returns {Promise<Object>} The response data.
   */
  async post(
    subPath = "",
    data,
    options = { queryParams: {}, skipAuth: false }
  ) {
    const params = this._buildQuery(options?.queryParams);
    const path = `${subPath}?${params}`;
    const results = await this._post(path, data, {}, options.skipAuth);
    return results;
  }
}

export default BaseService;
