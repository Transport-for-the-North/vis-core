import { selectors } from "../selectorDefinitions";

export const annualChargingDemand = {
  pageName: "Annual Charging Demand",
  url: "/@stbTag@/annual-charging-demand",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  about: `
  <p>Select an output to analyse. Each selection will show further options and fill the map panel with results.
    To get further help, type or select a topic in the glossary box.</p>
  <p>EV uptake gives the number of electric vehicles (EVs) that are expected across the region, 
    split by powertrain type (battery electric or plug-in hybrid) and vehicle type (car, van, or heavy goods vehicle).</p>`,
  config: {
    layers: [
      {
        name: "Administrative Boundaries",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}", // matches the path in swagger.json
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "Annual Charging Demand",
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
        name: "Annual Charging Demand",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/annual-charging-demand",
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.year, visualisations: ['Annual Charging Demand'] },
      { ...selectors.administrativeBoundary, visualisations: ['Annual Charging Demand'] },
      { ...selectors.travelScenario, visualisations: ['Annual Charging Demand'] },
      { ...selectors.behaviouralScenario, visualisations: ['Annual Charging Demand'] },
      { ...selectors.chargingCategory, visualisations: ['Annual Charging Demand'] },
      { ...selectors.areaValueDisplay, visualisations: ['Annual Charging Demand'] },
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};
