import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const annualChargingDemand = {
  pageName: "Annual Charging Demand",
  url: "/@stbTag@/annual-charging-demand",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  customMapCentre: "@mapCentre@",
  customMapZoom: "@mapZoom@",
  navbarLinkBgColour: "@primaryBgColour@",
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
        path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}?parentZoneType=15&parentZoneId=@stbZoneId@",
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
        legendText: [
          {
            displayValue: "Annual charging demand",
            legendSubtitleText: "kWh" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.runTypeCodeFixed, visualisations: ['Annual Charging Demand'] },
      { ...selectors.year, visualisations: ['Annual Charging Demand'] },
      { ...selectors.administrativeBoundary, visualisations: ['Annual Charging Demand'] },
      { ...selectors.travelScenarioBase, visualisations: ['Annual Charging Demand'] },
      { ...selectors.behaviouralScenario, visualisations: ['Annual Charging Demand'] },
      { ...selectors.chargingCategory, visualisations: ['Annual Charging Demand'] },
      { ...selectors.stbTag, visualisations: ['Annual Charging Demand'] },
      { ...selectors.areaValueDisplay, visualisations: ['Annual Charging Demand'] },
      { ...selectors.zoneSelector, visualisations: ['Annual Charging Demand']}
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};


export const tfnAnnualChargingDemand = {
  ...annualChargingDemand,
  config: {
    ...annualChargingDemand.config,
    filters: [
      { ...selectors.runTypeCodeDynamic, visualisations: ['Annual Charging Demand'] },
      { ...selectors.year, visualisations: ['Annual Charging Demand'] },
      { ...selectors.administrativeBoundary, visualisations: ['Annual Charging Demand'] },
      { ...selectors.travelScenarioAdditional, visualisations: ['Annual Charging Demand'] },
      { ...selectors.behaviouralScenario, visualisations: ['Annual Charging Demand'] },
      { ...selectors.chargingCategory, visualisations: ['Annual Charging Demand'] },
      { ...selectors.stbTag, visualisations: ['Annual Charging Demand'] },
      { ...selectors.areaValueDisplay, visualisations: ['Annual Charging Demand'] },
      { ...selectors.zoneSelector, visualisations: ['Annual Charging Demand']}
    ],
  },
};