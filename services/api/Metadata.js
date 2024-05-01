import BaseService from "./Base";

class MetadataService extends BaseService {
  constructor(options = {}) {
    super(options);
  }

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