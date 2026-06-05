import BaseService from "./Base";
import { GeodataService } from "./Geodata";
import { MetadataService } from "./Metadata";
import { DownloadService } from "./downloadData";
import { EndpointDefinitionClient } from "./EndpointDefinitionClient";
import { FileUploadService } from "./FileUpload";

/**
 * Object containing instances of various services.
 * @property {BaseService} baseService - Instance of BaseService.
 * @property {MetadataService} metadataService - Instance of MetadataService.
 * @property {GeodataService} geodataService - Instance of GeodataService.
 * @property {DownloadService} downloadService - Instance of DownloadService.
 * @property {FileUploadService} fileUploadService - Instance of FileUploadService.
 */
const api = {
  baseService: new BaseService(),
  metadataService: new MetadataService(),
  geodataService: new GeodataService(),
  downloadService: new DownloadService(),
  fileUploadService: new FileUploadService()
};

api.endpointDefinitionClient = new EndpointDefinitionClient({
  baseService: api.baseService,
});

export default api;