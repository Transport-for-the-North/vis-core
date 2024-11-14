import { evUptake, tfnEvUptake } from "./evUptake"
import { annualChargingDemand, tfnAnnualChargingDemand } from "./annualChargingDemand"
import { evcpRequirements, tfnEvcpRequirements } from "./evcpRequirements"
import { potentialChargingSites } from "./potentialChargingSites"
import { cpMajorRoad } from "./cpMajorRoad"
import { cpArea } from "./cpArea"
import { cpLocation } from "./cpLocation"
import { co2Savings, tfnCo2Savings } from "./co2Savings"
import { enrouteChargingSites } from "./enrouteChargingSites"

export const pages = {
    evUptake: evUptake,
    annualChargingDemand: annualChargingDemand,
    evcpRequirements: evcpRequirements,
    potentialChargingSites: potentialChargingSites,
    enrouteChargingSites: enrouteChargingSites,
    cpArea: cpArea,
    cpLocation: cpLocation,
    cpMajorRoad: cpMajorRoad,
    co2Savings: co2Savings,
    tfnAnnualChargingDemand: tfnAnnualChargingDemand,
    tfnCo2Savings: tfnCo2Savings,
    tfnEvcpRequirements: tfnEvcpRequirements,
    tfnEvUptake: tfnEvUptake
}