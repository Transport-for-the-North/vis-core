import { evUptake } from "./evUptake"
import { annualChargingDemand } from "./annualChargingDemand"
import { evcpRequirements } from "./evcpRequirements"
import { enrouteChargingSites } from "./enrouteChargingSites"
import { cpMajorRoad } from "./cpMajorRoad"
import { cpArea } from "./cpArea"
import { cpLocation } from "./cpLocation"

export const pages = {
    evUptake: evUptake,
    annualChargingDemand: annualChargingDemand,
    evcpRequirements: evcpRequirements,
    enrouteChargingSites: enrouteChargingSites,
    cpArea: cpArea,
    cpLocation: cpLocation,
    cpMajorRoad: cpMajorRoad
}