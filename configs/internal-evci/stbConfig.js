import { stbConfig as baseStbConfig } from "../evci/stbConfig";

// Modified pages list for each stbTag. If an STB is not included,
// assumes unmodified page list from evci app.
const pagesMap = {
  tfn: [
    "cpArea",
    "cpLocation",
    "cpMajorRoad",
    "tfnEvUptake",
    "tfnEvcpRequirements",
    "tfnAnnualChargingDemand",
    "potentialChargingSites",
    "tfnCo2Savings",
    "enrouteChargingDemand",
    "offStreetParkingAccess",
    "energyCapacity",
    "commercialViability",
    "multiModalHubs",
    "freightHubs"
  ]
};

// Function to modify the pages array for each STB using the pagesMap
function modifyStbConfig(config, pagesMap) {
  return config.map((stb) => {
    // Create a copy of the stb object to avoid mutating the original
    const modifiedStb = { ...stb };

    // Update the pages array using the pagesMap
    if (pagesMap[stb.stbTag]) {
      modifiedStb.pages = pagesMap[stb.stbTag];
    }

    // Return the modified STB object
    return modifiedStb;
  });
}

// Export the modified configuration
export const stbConfig = modifyStbConfig(baseStbConfig, pagesMap);
