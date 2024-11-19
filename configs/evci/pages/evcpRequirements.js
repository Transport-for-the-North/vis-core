import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const evcpRequirements = {
  pageName: "EVCP Requirements",
  url: "/@stbTag@/evcp-requirements",
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
        visualisationName: "EVCP Requirements",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: true,
        hoverNulls: true,
        hoverTipShouldIncludeMetadata: false,
      },
    ],
    visualisations: [
      {
        name: "EVCP Requirements",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/evcp-requirements",
        legendText: [
          {
            displayValue: "EVCP Requirements",
            legendSubtitleText: "charging points" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.runTypeCodeFixed, visualisations: ['EVCP Requirements'] },
      { ...selectors.year, visualisations: ['EVCP Requirements'] },
      { ...selectors.administrativeBoundary, visualisations: ['EVCP Requirements'] },
      { ...selectors.travelScenarioBase, visualisations: ['EVCP Requirements'] },
      { ...selectors.behaviouralScenario, visualisations: ['EVCP Requirements'] },
      { ...selectors.chargingCategory, visualisations: ['EVCP Requirements'] },
      { ...selectors.stbTag, visualisations: ['EVCP Requirements'] },
      { ...selectors.areaValueDisplay, visualisations: ['EVCP Requirements'] },
      { ...selectors.zoneSelector, visualisations: ['EVCP Requirements'] }
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
          { ...selectors.chargingCategory, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.zoneSelector, multiselect: true, type: 'mapFeatureSelect' },
          { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
        ],
        downloadPath: '/api/evci/evcp-requirements/download'
      },
    },
  },
};

export const tfnEvcpRequirements = {
  ...evcpRequirements,
  config: {
    ...evcpRequirements.config,
    filters: [
      { ...selectors.runTypeCodeDynamic, visualisations: ['EVCP Requirements'] },
      { ...selectors.year, visualisations: ['EVCP Requirements'] },
      { ...selectors.administrativeBoundary, visualisations: ['EVCP Requirements'] },
      { ...selectors.travelScenarioAdditional, visualisations: ['EVCP Requirements'] },
      { ...selectors.behaviouralScenario, visualisations: ['EVCP Requirements'] },
      { ...selectors.chargingCategory, visualisations: ['EVCP Requirements'] },
      { ...selectors.stbTag, visualisations: ['EVCP Requirements'] },
      { ...selectors.areaValueDisplay, visualisations: ['EVCP Requirements'] },
      { ...selectors.zoneSelector, visualisations: ['EVCP Requirements'] }
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
          { ...selectors.behaviouralScenario, multiSelect: true, type: 'dropdown' },
          { ...selectors.chargingCategory, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.zoneSelector, multiselect: true, type: 'mapFeatureSelect' },
          { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
        ],
        downloadPath: '/api/evci/evcp-requirements/download'
      },
    },
  },
};