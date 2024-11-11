import { selectors } from "../selectorDefinitions";

export const co2Savings = {
  pageName: "CO2 Savings",
  url: "/@stbTag@/co2-savings",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  navbarLinkBgColour: "@primaryBgColour@",
  customMapCentre: "@mapCentre@",
  customMapZoom: "@mapZoom@",
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
        path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}?parentZoneType=15&parentZoneId=@stbZoneId@",
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "CO2 Savings",
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
        name: "CO2 Savings",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/co2-savings",
        legendText: [
          {
            displayValue: "Total CO2 Savings",
            legendSubtitleText: "Metric Tons" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.runTypeCodeFixed, visualisations: ['CO2 Savings'] },
      { ...selectors.year, visualisations: ['CO2 Savings'] },
      { ...selectors.administrativeBoundary, visualisations: ['CO2 Savings'] },
      { ...selectors.travelScenarioBase, visualisations: ['CO2 Savings'] },
      { ...selectors.behaviouralScenario, visualisations: ['CO2 Savings'] },
      { ...selectors.vehicleType, visualisations: ['CO2 Savings'] },
      { ...selectors.stbTag, visualisations: ['CO2 Savings'] },
      { ...selectors.areaValueDisplay, visualisations: ['CO2 Savings'] },
      { ...selectors.zoneSelector, visualisations: ['CO2 Savings']}
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};

export const tfnCo2Savings = {
  ...co2Savings,
  config: {
    ...co2Savings.config,
    filters: [
      { ...selectors.runTypeCodeDynamic, visualisations: ['CO2 Savings'] },
      { ...selectors.year, visualisations: ['CO2 Savings'] },
      { ...selectors.administrativeBoundary, visualisations: ['CO2 Savings'] },
      { ...selectors.travelScenarioAdditional, visualisations: ['CO2 Savings'] },
      { ...selectors.behaviouralScenario, visualisations: ['CO2 Savings'] },
      { ...selectors.vehicleType, visualisations: ['CO2 Savings'] },
      { ...selectors.stbTag, visualisations: ['CO2 Savings'] },
      { ...selectors.areaValueDisplay, visualisations: ['CO2 Savings'] },
      { ...selectors.zoneSelector, visualisations: ['CO2 Savings']}
    ],
  },
};
