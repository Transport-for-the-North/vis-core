import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const actualRoad = {
  pageName: "Actual: Chargers/power by major road",
  url: "/@stbTag@/actual-road",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  about: `
  <p>Select an output to analyse. Each selection will show further options and fill the map panel with results.
    To get further help, type or select a topic in the glossary box.</p>
  <p>EV uptake gives the number of electric vehicles (EVs) that are expected across the region, 
    split by powertrain type (battery electric or plug-in hybrid) and vehicle type (car, van, or heavy goods vehicle).</p>`,
  termsOfUse: termsOfUse,
  config: {
    layers: [
      {
        name: "Administrative Boundaries",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}", // matches the path in swagger.json
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "Actual Road",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: true,
      }
    ],
    visualisations: [
      {
        name: "Actual Road",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/actual-road",
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.distanceValueDisplay, visualisations: ['Actual Road'] },
      { ...selectors.chargerSpeed, visualisations: ['Actual Road'] },
    ],
  },
};
