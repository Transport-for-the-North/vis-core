import BaseService from "./Base";
import { GeodataService } from "./Geodata";
import { MetadataService } from "./Metadata";

const api ={
  baseService: new BaseService(),
  metadataService: new MetadataService(),
  geodataService: new GeodataService()
};

export default api;
