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
  <p>This visualisation shows the forecasted number and type of charging infrastructure requirements across the region.</p>
  <p>TfN’s methodology for the EVCI Framework 
  can be found <a
              href="https://www.transportforthenorth.com/major-roads-network/electric-vehicle-charging-infrastructure/"
              target="_blank"
              rel="noopener noreferrer"
            >
             here</a>.</p>`,
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
      { ...selectors.runTypeCodeDynamic, visualisations: ['EVCP Requirements'] },
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
          selectors.runTypeCodeDynamic,
          { ...selectors.year, multiSelect: true, shouldBeBlankOnInit: false, type: 'dropdown' },
          { ...selectors.administrativeBoundary, multiSelect: true, type: 'toggle' },
          { ...selectors.travelScenarioBase, multiSelect: true, type: 'dropdown' },
          { ...selectors.behaviouralScenario, multiSelect: true, type: 'dropdown' },
          { ...selectors.chargingCategory, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector" },
        ],
        downloadPath: '/api/evci/evcp-requirements/download'
      },
    },
  },
};

export const tfnEvcpRequirements = {
  ...evcpRequirements,
  about: `
  <p>This visualisation shows the forecasted number and type of charging infrastructure requirements across the region.</p>
  <p>TfN can support our local authority partners with further information behind these outputs, 
  this can be accessed by emailing <u>TfNOffer@transportforthenorth.com</u>. <br>Other users can use the contact us section on the 
  home page to get in touch should they wish to explore insights and opportunities arising from this toolkit. TfN’s methodology for the EVCI Framework 
  can be found <a
              href="https://www.transportforthenorth.com/major-roads-network/electric-vehicle-charging-infrastructure/"
              target="_blank"
              rel="noopener noreferrer"
            >
             here</a>.</p>`,
  config: {
    ...evcpRequirements.config,
    filters: [
      { ...selectors.runTypeCodeDynamic, visualisations: ['EVCP Requirements'] },
      { ...selectors.year, visualisations: ['EVCP Requirements'] },
      { ...selectors.administrativeBoundary, visualisations: ['EVCP Requirements'] },
      { ...selectors.travelScenarioAdditional, visualisations: ['EVCP Requirements'] },
      { ...selectors.tfnBehaviouralScenario, visualisations: ['EVCP Requirements'] },
      { ...selectors.tfnChargingCategory, visualisations: ['EVCP Requirements'] },
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
          { ...selectors.tfnBehaviouralScenario, multiSelect: true, type: 'dropdown' },
          { ...selectors.tfnChargingCategory, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector" },
        ],
        downloadPath: '/api/evci/evcp-requirements/download'
      },
    },
  },
};

export const tfseEvcpRequirements = {
  ...evcpRequirements,
  about: `
  <p>This visualisation shows the forecasted number and type of charging infrastructure requirements across the region.</p>
  <p>TfN’s methodology for the EVCI Framework 
  can be found <a
              href="https://www.transportforthenorth.com/major-roads-network/electric-vehicle-charging-infrastructure/"
              target="_blank"
              rel="noopener noreferrer"
            >
             here</a>.</p>`,
  config: {
    ...evcpRequirements.config,
    filters: [
      { ...selectors.runTypeCodeFixed, visualisations: ['EVCP Requirements'] },
      { ...selectors.year, visualisations: ['EVCP Requirements'] },
      { ...selectors.administrativeBoundary, visualisations: ['EVCP Requirements'] },
      { ...selectors.travelScenarioBase, visualisations: ['EVCP Requirements'] },
      { ...selectors.behaviouralScenario, visualisations: ['EVCP Requirements'] },
      { ...selectors.tfseChargingCategory, visualisations: ['EVCP Requirements'] },
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
          { ...selectors.tfseChargingCategory, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}] , filterName: "Optional location selector"},
        ],
        downloadPath: '/api/evci/evcp-requirements/download'
      },
    },
  },
};