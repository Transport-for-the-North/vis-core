class BaseService {
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
  
    _buildUrl(path) {
      let url = this._apiBaseUrl;
      if (this._pathPrefix) url += `/${this._pathPrefix}`;
      url += `${path}`;
      return url;
    }
  
    _buildQuery(queryDict = {}) {
      const tokens = this._makeParamTokens(
        ...this._splitDuplicateAndNonDuplicateParams(queryDict))
      return tokens.map(([param, value]) => `${param}=${value}`).join("&");
    }
  
    _splitDuplicateAndNonDuplicateParams(queryDict) {
      const duplicateParams = Object.fromEntries(Object.entries(queryDict)
        .filter(([_, value]) => Array.isArray(value)));
      const nonDuplicateParams = Object.fromEntries(Object.entries(queryDict)
        .filter(([_, value]) => !Array.isArray(value)));
      return [nonDuplicateParams, duplicateParams]
    }
  
    _makeParamTokens(nonDuplicateParams = {}, duplicateParams = {}) {
      const tokens = []
      Object.entries(nonDuplicateParams)
        .forEach(([key, value]) => tokens.push([key, value]));
      Object.entries(duplicateParams)
        .forEach(([key, arr]) => arr.forEach(value => tokens.push([key, value])));
      return tokens;
    }
  
    async _get(path, addOptions = {}) {
      const url = this._buildUrl(path);
      const options = {
        method: "GET",
        ...addOptions,
      };
      const result = await fetch(url, options).catch(error => console.log(error));
      const data = await result.json();
  
      return data;
    }
  
    async get(subPath = "", options = { queryParams: {} }) {
      const params = this._buildQuery(options?.queryParams);
      const path = `${subPath}?${params}`;
      const results = await this._get(path);
      return results;
    }
  }
  
  export default BaseService;
  