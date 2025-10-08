import BaseService from "./Base";

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
    try {
      const url = this._buildUrl('/swagger/v1/swagger.json');
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const swaggerData = await response.json();
      return swaggerData;
    } catch (error) {
      console.error('Error fetching Swagger file:', error);
      throw error; // Rethrow the error for further handling if necessary
    }
  }
}

export { MetadataService };