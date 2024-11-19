import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const evUptake = {
  pageName: "EV Uptake",
  url: "/@stbTag@/ev-uptake",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  navbarLinkBgColour: "@primaryBgColour@",
  customMapCentre: "@mapCentre@",
  customMapZoom: "@mapZoom@",
  about: `
  <p>Select an output to analyse. Each selection will show further options and fill the map panel with results.
    To get further help, type or select a topic in the glossary box.</p>`,
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
        visualisationName: "EV Uptake",
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
        name: "EV Uptake",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/ev-uptake",
        legendText: [
          {
            displayValue: "Number of EVs",
            legendSubtitleText: "vehicles" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.runTypeCodeFixed, visualisations: ['EV Uptake'] },
      { ...selectors.year, visualisations: ['EV Uptake'] },
      { ...selectors.administrativeBoundary, visualisations: ['EV Uptake'] },
      { ...selectors.travelScenarioBase, visualisations: ['EV Uptake'] },
      { ...selectors.behaviouralScenario, visualisations: ['EV Uptake'] },
      { ...selectors.vehicleType, visualisations: ['EV Uptake'] },
      { ...selectors.fuelType, visualisations: ['EV Uptake'] },
      { ...selectors.stbTag, visualisations: ['EV Uptake'] },
      { ...selectors.areaValueDisplay, visualisations: ['EV Uptake'] },
      { ...selectors.zoneSelector, visualisations: ['EV Uptake'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.runTypeCodeFixed, multiSelect: true, type: 'toggle' },
          { ...selectors.year, multiSelect: true, shouldBeBlankOnInit: false, type: 'dropdown' },
          { ...selectors.administrativeBoundary, multiSelect: true, type: 'toggle' },
          { ...selectors.travelScenarioBase, multiSelect: true, type: 'dropdown' },
          { ...selectors.behaviouralScenario, multiSelect: true, type: 'dropdown' },
          { ...selectors.vehicleType, multiSelect: true, type: 'dropdown' },
          { ...selectors.fuelType, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.zoneSelector, multiselect: true, type: 'mapFeatureSelect' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
        ],
        downloadPath: '/api/evci/ev-uptake/download'
      },
    },
  },
};

export const tfnEvUptake = {
  ...evUptake,
  config: {
    ...evUptake.config,
    filters: [
      { ...selectors.runTypeCodeDynamic, visualisations: ['EV Uptake'] },
      { ...selectors.year, visualisations: ['EV Uptake'] },
      { ...selectors.administrativeBoundary, visualisations: ['EV Uptake'] },
      { ...selectors.travelScenarioAdditional, visualisations: ['EV Uptake'] },
      { ...selectors.behaviouralScenario, visualisations: ['EV Uptake'] },
      { ...selectors.vehicleType, visualisations: ['EV Uptake'] },
      { ...selectors.fuelType, visualisations: ['EV Uptake'] },
      { ...selectors.stbTag, visualisations: ['EV Uptake'] },
      { ...selectors.areaValueDisplay, visualisations: ['EV Uptake'] },
      { ...selectors.zoneSelector, visualisations: ['EV Uptake'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.runTypeCodeDynamic, multiSelect: true, type: 'toggle' },
          { ...selectors.year, multiSelect: true, type: 'dropdown' },
          { ...selectors.administrativeBoundary, multiSelect: true, type: 'toggle' },
          { ...selectors.travelScenarioAdditional, multiSelect: true, type: 'dropdown' },
          { ...selectors.behaviouralScenario, multiSelect: true, type: 'dropdown' },
          { ...selectors.vehicleType, multiSelect: true, type: 'dropdown' },
          { ...selectors.fuelType, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.zoneSelector, multiselect: true, type: 'mapFeatureSelect' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
        ],
        downloadPath: '/api/evci/ev-uptake/download'
      },
    },
  },
};
