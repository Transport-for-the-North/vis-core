import { eehEvUptake, evUptake, tfnEvUptake, tfseEvUptake } from "./evUptake"
import { annualChargingDemand, eehAnnualChargingDemand, tfnAnnualChargingDemand, tfseAnnualChargingDemand } from "./annualChargingDemand"
import { eehEvcpRequirements, evcpRequirements, tfnEvcpRequirements, tfseEvcpRequirements } from "./evcpRequirements"
import { eehPotentialChargingSites, potentialChargingSites, tfnPotentialChargingSites } from "./potentialChargingSites"
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
    tfnEvUptake: tfnEvUptake,
    tfnPotentialChargingSites: tfnPotentialChargingSites,
    eehEvUptake: eehEvUptake,
    eehAnnualChargingDemand: eehAnnualChargingDemand,
    eehEvcpRequirements: eehEvcpRequirements,
    eehPotentialChargingSites: eehPotentialChargingSites,
    tfseEvUptake: tfseEvUptake,
    tfseAnnualChargingDemand: tfseAnnualChargingDemand,
    tfseEvcpRequirements: tfseEvcpRequirements
}