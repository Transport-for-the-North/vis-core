import BaseService from "./Base";
import { HttpError } from "./HttpError";

export { HttpError };


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
    const response = await fetch(url);
    let responseBody = null;

    try {
      const contentType = (response.headers.get("content-type") || "").toLowerCase();
      if (contentType.includes("application/json")) {
          responseBody = await response.json();
      }   else {
          responseBody = await response.text();
      }
    } catch {
        responseBody = null;
    }

    if (!response.ok) {
      throw new HttpError(
        response.status,
        `HTTP error! status: ${response.status}`,
        url,
        responseBody
      );
    }
    return responseBody;
  }

}
export { MetadataService };