import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

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
  <p>This is a measure of the cumulative CO2 emissions saved over time 
    between the Travel Scenario selected and an EV-free Baseline Scenario.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
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
        labelNulls: true,
        hoverNulls: true,
        hoverTipShouldIncludeMetadata: false,
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
      { ...selectors.vehicleTypeWithoutAll, visualisations: ['CO2 Savings'] },
      { ...selectors.stbTag, visualisations: ['CO2 Savings'] },
      { ...selectors.areaValueDisplay, visualisations: ['CO2 Savings'] },
      { ...selectors.zoneSelector, visualisations: ['CO2 Savings']}
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          selectors.runTypeCodeFixed,
          { ...selectors.year, multiSelect: true, shouldBeBlankOnInit: false, type: 'dropdown' },
          { ...selectors.administrativeBoundary, multiSelect: true, type: 'toggle' },
          { ...selectors.travelScenarioAdditional, multiSelect: true, type: 'dropdown' },
          { ...selectors.vehicleTypeWithoutAll, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
           { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}] },
        ],
        downloadPath: '/api/evci/co2-savings/download'
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
      { ...selectors.vehicleTypeWithoutAll, visualisations: ['CO2 Savings'] },
      { ...selectors.stbTag, visualisations: ['CO2 Savings'] },
      { ...selectors.areaValueDisplay, visualisations: ['CO2 Savings'] },
      { ...selectors.zoneSelector, visualisations: ['CO2 Savings']}
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.runTypeCodeDynamic, multiSelect: true, type: 'toggle' },
          { ...selectors.year, multiSelect: true, shouldBeBlankOnInit: false, type: 'dropdown' },
          { ...selectors.administrativeBoundary, multiSelect: true, type: 'toggle' },
          { ...selectors.travelScenarioAdditional, multiSelect: true, type: 'dropdown' },
          { ...selectors.vehicleTypeWithoutAll, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}] },
        ],
        downloadPath: '/api/evci/co2-savings/download'
      },
    },
  },
};
