import BaseService from "./Base";

/**
 * Represents an HTTP error returned by an API request.
 */
export class HttpError extends Error {
  /**
   * Creates an instance of HttpError.
   * @param {number} status - HTTP status code
   * @param {string} message - Error message
   * @param {string} url - Request URL
   * @param {any} [body=null] - Optional response body
   */
  constructor(status, message, url, body = null) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

/**
 * A service class for fetching metadata.
 * @extends BaseService
 */
class MetadataService extends BaseService {
  /**
   * Creates an instance of MetadataService.
   * @param {Object} [options={}] - Options for configuring the service.
   */
  constructor(options = {}) {
    super(options);
  }

  /**
   * Fetches the Swagger file.
   * @returns {Promise<Object>} A promise that resolves with the Swagger file data.
   * @throws {Error} If there is an error fetching the Swagger file.
   */
  async getSwaggerFile() {
    const url = this._buildUrl('/swagger/v1/swagger.json');
    
    try {
      const response = await fetch(url);
      let responseBody = null;

      try {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          responseBody = await response.json();
        } else {
          responseBody = await response.text();
        }
      } catch {
        responseBody = null;
      }

      if (!response.ok) {
        throw new HttpError(response.status,`HTTP error! status: ${response.status}`,url,responseBody);
      }
      return responseBody;
    } catch (error) {console.error('Error fetching Swagger file:', error);
      throw error; // Rethrow the error for further handling if necessary
    }
  }
}

export { MetadataService };