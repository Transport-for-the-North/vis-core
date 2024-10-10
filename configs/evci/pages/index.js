import { evUptake } from "./evUptake"
import { annualChargingDemand } from "./annualChargingDemand"
import { evcpRequirements } from "./evcpRequirements"
import { enrouteChargingSites } from "./enrouteChargingSites"
import { actualArea } from "./actualArea"
import { actualLocation } from "./actualLocation"
import { actualRoad } from "./actualMajorRoad"

export const pages = {
    evUptake: evUptake,
    annualChargingDemand: annualChargingDemand,
    evcpRequirements: evcpRequirements,
    enrouteChargingSites: enrouteChargingSites,
    actualArea: actualArea,
    actualLocation: actualLocation,
    actualRoad: actualRoad
}