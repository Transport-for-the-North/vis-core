import { linkLoadings } from "./linkLoadings"
import { timingLinks } from "./timingLinks"
import { nodeLoadings } from "./nodeLoadings"
import { nodeNSSeC } from "./nodeNSSeC"
import { nodeSocio } from "./nodeSocio"
import { stationInformation } from "./stationInformation"
import { nodeInvestments } from "./nodeInvestments"
import { linkInvestments } from "./linkInvestments"
import { linkFrequency } from "./linkFrequency"
import { freightNodeInvestments } from "./freightNodeInvestment"
import { freightLinkInvestments } from "./freightLinkInvestment"
import { performanceBi } from "./performanceBi"
import { nodeCarOrVan } from "./nodeCarOrVan"
import { nodeHouseholdDeprivation } from "./nodeHouseholdDeprivation"
import { nodeWorkTravelDistance } from "./nodeWorkTravelDistance"
import { nodeWorkTravelMethod } from "./nodeWorkTravelMethod"
import { freightHighGaugeCleared } from "./freightHighGaugeCleared"
import { freightHighGauge } from "./freightHighGauge"
import { freightAvgWeekdayFlows } from "./freightAvgWeekdayFlows"

export const pages = {
    linkLoadings: linkLoadings,
    timingLinks: timingLinks,
    nodeLoadings: nodeLoadings,
    nodeNSSeC: nodeNSSeC,
    nodeSocio: nodeSocio,
    stationInformation: stationInformation,
    nodeInvestments: nodeInvestments,
    linkInvestments: linkInvestments,
    linkFrequency: linkFrequency,
    freightLinkInvestments: freightLinkInvestments,
    freightNodeInvestments: freightNodeInvestments,
    performanceBi: performanceBi,
    nodeCarOrVan: nodeCarOrVan,
    nodeHouseholdDeprivation: nodeHouseholdDeprivation,
    nodeWorkTravelDistance: nodeWorkTravelDistance,
    nodeWorkTravelMethod: nodeWorkTravelMethod,
    freightHighGaugeCleared: freightHighGaugeCleared,
    freightHighGauge: freightHighGauge,
    freightAvgWeekdayFlows: freightAvgWeekdayFlows,
}