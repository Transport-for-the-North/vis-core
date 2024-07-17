class BaseService {
  /**
   * Creates an instance of BaseService.
   * @constructor
   * @param {Object} [config={ pathPrefix: "" }] - The configuration object.
   * @property {string} config.pathPrefix - The prefix to be added to the path.
   * @property {string} [config.pathPostfix] - The postfix to be added to the path.
   */
  constructor(config = { pathPrefix: "" }) {
    const postFix = config?.pathPostfix ?? ""
    switch(process.env.REACT_APP_PROD_OR_DEV) {
      case "production":
        this._apiBaseUrl = process.env.REACT_APP_API_BASE_DOMAIN.trim()
        if(this._apiBaseUrl.length > 0 && this._apiBaseUrl.slice(this._apiBaseUrl.length - 1) === "/") {
          this._apiBaseUrl = this._apiBaseUrl.slice(0, -1);
        }
        break;

      case "development":
        if(process.env.REACT_APP_API_BASE_DOMAIN_DEV) {
          this._apiBaseUrl = process.env.REACT_APP_API_BASE_DOMAIN_DEV.trim()
          if(this._apiBaseUrl.length > 0 && this._apiBaseUrl.slice(this._apiBaseUrl.length - 1) === "/") {
            this._apiBaseUrl = this._apiBaseUrl.slice(0, -1);
          }
        }
        else {
          this._apiBaseUrl = `https://localhost:7127`;
        }
        break;

      default:
        this._apiBaseUrl = `https://localhost:7127`;      
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
      ...this._splitDuplicateAndNonDuplicateParams(queryDict))
    return tokens.map(([param, value]) => `${param}=${value}`).join("&");
  }

  /**
   * Splits the query parameters into duplicate and non-duplicate parameters.
   *
   * @param {Object} queryDict - The dictionary of query parameters.
   * @returns {Array} An array containing two dictionaries: one for non-duplicate parameters and one for duplicate parameters.
   */
  _splitDuplicateAndNonDuplicateParams(queryDict) {
    const duplicateParams = Object.fromEntries(Object.entries(queryDict)
      .filter(([_, value]) => Array.isArray(value)));
    const nonDuplicateParams = Object.fromEntries(Object.entries(queryDict)
      .filter(([_, value]) => !Array.isArray(value)));
    return [nonDuplicateParams, duplicateParams]
  }

  /**
   * Creates an array of parameter tokens from the non-duplicate and duplicate parameters.
   *
   * @param {Object} [nonDuplicateParams={}] - The dictionary of non-duplicate parameters.
   * @param {Object} [duplicateParams={}] - The dictionary of duplicate parameters.
   * @returns {Array} An array of parameter tokens.
   */
  _makeParamTokens(nonDuplicateParams = {}, duplicateParams = {}) {
    const tokens = []
    Object.entries(nonDuplicateParams)
      .forEach(([key, value]) => tokens.push([key, value]));
    Object.entries(duplicateParams)
      .forEach(([key, arr]) => arr.forEach(value => tokens.push([key, value])));
    return tokens;
  }

  /**
   * Makes a GET request to the specified path with additional options.
   *
   * @param {string} path - The path for the GET request.
   * @param {Object} [addOptions={}] - Additional options for the fetch request.
   * @returns {Promise<Object>} The response data.
   */
  async _get(path, addOptions = {}) {
    const url = this._buildUrl(path);
    const jwtToken = process.env.REACT_APP_TAME_WEB_API_JWT;
    // Ensure the JWT token is available before adding it to the headers
    if (!jwtToken) {
      throw new Error('JWT token is not available in the environment variables.');
    }
    const options = {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${jwtToken}`, // Add the JWT token to the Authorization header
        ...addOptions.headers, // Spread any additional headers provided in addOptions
      },
      ...addOptions,
    };
    const result = await fetch(url, options).catch(error => console.log(error));
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
   * @returns {Promise<Object>} The response data.
   */
  async get(subPath = "", options = { queryParams: {} }) {
    const params = this._buildQuery(options?.queryParams);
    const path = `${subPath}?${params}`;
    const results = await this._get(path);
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
    const jwtToken = null; // Get the JWT token from cookies if skipAuth is false
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
