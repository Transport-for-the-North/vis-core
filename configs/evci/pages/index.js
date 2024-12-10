import { evUptake, tfnEvUptake } from "./evUptake"
import { annualChargingDemand, tfnAnnualChargingDemand } from "./annualChargingDemand"
import { evcpRequirements, tfnEvcpRequirements } from "./evcpRequirements"
import { potentialChargingSites } from "./potentialChargingSites"
import { cpMajorRoad } from "./cpMajorRoad"
import { cpArea } from "./cpArea"
import { cpLocation } from "./cpLocation"
import { co2Savings, tfnCo2Savings } from "./co2Savings"
import { enrouteChargingDemand } from "./enrouteChargingDemand"
import { commercialViability } from "./commercialViability"
import { multiModalHubs } from "./multiModalHubs"
import { offStreetParkingAccess, offStreetParkingDrivewayOnly } from "./offStreetParkingAccess"
import { energyCapacity } from "./energyCapacity"

export const pages = {
    evUptake: evUptake,
    annualChargingDemand: annualChargingDemand,
    evcpRequirements: evcpRequirements,
    potentialChargingSites: potentialChargingSites,
    enrouteChargingDemand: enrouteChargingDemand,
    cpArea: cpArea,
    cpLocation: cpLocation,
    cpMajorRoad: cpMajorRoad,
    co2Savings: co2Savings,
    commercialViability: commercialViability,
    multiModalHubs: multiModalHubs,
    offStreetParkingAccess: offStreetParkingAccess,
    offStreetParkingDrivewayOnly: offStreetParkingDrivewayOnly,
    energyCapacity: energyCapacity,
    tfnAnnualChargingDemand: tfnAnnualChargingDemand,
    tfnCo2Savings: tfnCo2Savings,
    tfnEvcpRequirements: tfnEvcpRequirements,
    tfnEvUptake: tfnEvUptake
}