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
  <p>This visualisation shows the forecasted annual energy demand which EV uptake will require, for each charging category.</p>
  <p>TfN’s methodology for the EVCI Framework can be found <a
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
        visualisationName: "Annual Charging Demand",
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
      { ...selectors.runTypeCodeDynamic, visualisations: ['Annual Charging Demand'] },
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
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector"},
        ],
        downloadPath: '/api/evci/annual-charging-demand/download'
      },
    },
  },
};


export const tfnAnnualChargingDemand = {
  ...annualChargingDemand,
  about: `
  <p>This visualisation shows the forecasted annual energy demand which EV uptake will require, for each charging category.</p>
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
    ...annualChargingDemand.config,
    filters: [
      { ...selectors.runTypeCodeDynamic, visualisations: ['Annual Charging Demand'] },
      { ...selectors.year, visualisations: ['Annual Charging Demand'] },
      { ...selectors.administrativeBoundary, visualisations: ['Annual Charging Demand'] },
      { ...selectors.travelScenarioAdditional, visualisations: ['Annual Charging Demand'] },
      { ...selectors.tfnBehaviouralScenario, visualisations: ['Annual Charging Demand'] },
      { ...selectors.tfnChargingCategory, visualisations: ['Annual Charging Demand'] },
      { ...selectors.stbTag, visualisations: ['Annual Charging Demand'] },
      { ...selectors.areaValueDisplay, visualisations: ['Annual Charging Demand'] },
      { ...selectors.zoneSelector, visualisations: ['Annual Charging Demand']}
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
        downloadPath: '/api/evci/annual-charging-demand/download'
      },
    },
  },
};

export const tfseAnnualChargingDemand = {
  ...annualChargingDemand,
  about: `
  <p>This visualisation shows the forecasted annual energy demand which EV uptake will require, for each charging category.</p>
  <p>TfN’s methodology for the EVCI Framework can be found <a
      href="https://www.transportforthenorth.com/major-roads-network/electric-vehicle-charging-infrastructure/"
      target="_blank"
      rel="noopener noreferrer"
    >
      here</a>.</p>`,
  config: {
    ...annualChargingDemand.config,
    filters: [
      { ...selectors.runTypeCodeFixed, visualisations: ['Annual Charging Demand'] },
      { ...selectors.year, visualisations: ['Annual Charging Demand'] },
      { ...selectors.administrativeBoundary, visualisations: ['Annual Charging Demand'] },
      { ...selectors.travelScenarioBase, visualisations: ['Annual Charging Demand'] },
      { ...selectors.behaviouralScenario, visualisations: ['Annual Charging Demand'] },
      { ...selectors.tfseChargingCategory, visualisations: ['Annual Charging Demand'] },
      { ...selectors.stbTag, visualisations: ['Annual Charging Demand'] },
      { ...selectors.areaValueDisplay, visualisations: ['Annual Charging Demand'] },
      { ...selectors.zoneSelector, visualisations: ['Annual Charging Demand']}
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
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector" },
        ],
        downloadPath: '/api/evci/annual-charging-demand/download'
      },
    },
  },
};