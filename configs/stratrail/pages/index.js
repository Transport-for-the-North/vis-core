import { linkLoadings } from "./linkLoadings"
import { timingLinks } from "./timingLinks"
import { nodeLoadings } from "./nodeLoadings"
import { nodeNSSeC } from "./nodeNSSeC"
import { nodeSocio } from "./nodeSocio"
import { stationInformation } from "./stationInformation"
import { stationInformationBool } from "./stationInformationBool"
import { nodeInvestments } from "./nodeInvestments"
import { linkInvestments } from "./linkInvestments"
import { linkFrequency } from "./linkFrequency"
import { freightNodeInvestments } from "./freightNodeInvestment"
import { freightLinkInvestments } from "./freightLinkInvestment"

export const pages = {
    linkLoadings: linkLoadings,
    timingLinks: timingLinks,
    nodeLoadings: nodeLoadings,
    nodeNSSeC: nodeNSSeC,
    nodeSocio: nodeSocio,
    stationInformation: stationInformation,
    stationInformationBool: stationInformationBool,
    nodeInvestments: nodeInvestments,
    linkInvestments: linkInvestments,
    linkFrequency: linkFrequency,
    freightLinkInvestments: freightLinkInvestments,
    freightNodeInvestments: freightNodeInvestments,
}