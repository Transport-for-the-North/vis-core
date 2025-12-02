import { linkLoadings } from "./linkLoadings"
import { timingLinks } from "./timingLinks"
import { nodeLoadings } from "./nodeLoadings"
import { nodeNSSeC } from "./nodeNSSeC"
import { nodeSocio } from "./nodeSocio"
import { stationInformation } from "./stationInformation"
import { linkFrequency } from "./linkFrequency"
import { performanceBi } from "./performanceBi"
import { nodeCarOrVan } from "./nodeCarOrVan"
import { nodeHouseholdDeprivation } from "./nodeHouseholdDeprivation"
import { nodeWorkTravelDistance } from "./nodeWorkTravelDistance"
import { nodeWorkTravelMethod } from "./nodeWorkTravelMethod"

export const pages = {
    linkLoadings: linkLoadings,
    timingLinks: timingLinks,
    nodeLoadings: nodeLoadings,
    nodeNSSeC: nodeNSSeC,
    nodeSocio: nodeSocio,
    stationInformation: stationInformation,
    linkFrequency: linkFrequency,
    performanceBi: performanceBi,
    nodeCarOrVan: nodeCarOrVan,
    nodeHouseholdDeprivation: nodeHouseholdDeprivation,
    nodeWorkTravelDistance: nodeWorkTravelDistance,
    nodeWorkTravelMethod: nodeWorkTravelMethod
}