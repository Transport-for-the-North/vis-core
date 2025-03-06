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
  <p>This visualisation shows both actual (based on 2023 DVLA data) and forecast EV uptake expected across the region (car, van or heavy goods vehicle).</p>
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
      { ...selectors.vehicleTypeWithoutAll, visualisations: ['EV Uptake'] },
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
          selectors.runTypeCodeFixed,
          { ...selectors.year, multiSelect: true, shouldBeBlankOnInit: false, type: 'dropdown' },
          { ...selectors.administrativeBoundary, multiSelect: true, type: 'toggle' },
          { ...selectors.travelScenarioBase, multiSelect: true, type: 'dropdown' },
          { ...selectors.behaviouralScenario, multiSelect: true, type: 'dropdown' },
          { ...selectors.vehicleTypeWithoutAll, multiSelect: true, type: 'dropdown' },
          { ...selectors.fuelType, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector"},
        ],
        downloadPath: '/api/evci/ev-uptake/download'
      },
    },
  },
};

export const tfnEvUptake = {
  ...evUptake,
  about: `
  <p>This visualisation shows both actual (based on 2023 DVLA data) and forecast
    EV uptake expected across the region (car, van or heavy goods vehicle). </p>
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
    ...evUptake.config,
    filters: [
      { ...selectors.runTypeCodeDynamic, visualisations: ['EV Uptake'] },
      { ...selectors.year, visualisations: ['EV Uptake'] },
      { ...selectors.administrativeBoundary, visualisations: ['EV Uptake'] },
      { ...selectors.travelScenarioAdditional, visualisations: ['EV Uptake'] },
      { ...selectors.tfnBehaviouralScenario, visualisations: ['EV Uptake'] },
      { ...selectors.vehicleTypeWithoutAll, visualisations: ['EV Uptake'] },
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
          { ...selectors.year, multiSelect: true, shouldBeBlankOnInit: false, type: 'dropdown' },
          { ...selectors.administrativeBoundary, multiSelect: true, type: 'toggle' },
          { ...selectors.travelScenarioAdditional, multiSelect: true, type: 'dropdown' },
          { ...selectors.tfnBehaviouralScenario, multiSelect: true, type: 'dropdown' },
          { ...selectors.vehicleTypeWithoutAll, multiSelect: true, type: 'dropdown' },
          { ...selectors.fuelType, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector"},
        ],
        downloadPath: '/api/evci/ev-uptake/download'
      },
    },
  },
};

export const eehEvUptake = {
  ...evUptake,
  about: `
  <p>This visualisation shows both actual (based on 2023 DVLA data) and forecast
    EV uptake expected across the region (car, van or heavy goods vehicle). </p>
    <p>TfN’s methodology for the EVCI Framework can be found <a
      href="https://www.transportforthenorth.com/major-roads-network/electric-vehicle-charging-infrastructure/"
      target="_blank"
      rel="noopener noreferrer"
    >
      here</a>.</p>`,
  config: {
    ...evUptake.config,
    filters: [
      { ...selectors.runTypeCodeFixed, visualisations: ['EV Uptake'] },
      { ...selectors.year, visualisations: ['EV Uptake'] },
      { ...selectors.administrativeBoundary, visualisations: ['EV Uptake'] },
      { ...selectors.travelScenarioBase, visualisations: ['EV Uptake'] },
      { ...selectors.behaviouralScenario, visualisations: ['EV Uptake'] },
      { ...selectors.vehicleTypeWithoutAll, visualisations: ['EV Uptake'] },
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
          { ...selectors.vehicleTypeWithoutAll, multiSelect: true, type: 'dropdown' },
          { ...selectors.fuelType, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector"},
        ],
        downloadPath: '/api/evci/ev-uptake/download'
      },
      warning: "To note- the STB EVCI Framework for the England's Economic Heartland is being updated to reflect the new unitary authority boundaries for Buckinghamshire and Northamptonshire. This will be available early in 2025. Multiple local authority zones can be selected on the tool to create a total output for these areas.",
    },
  },
};

export const tfseEvUptake = {
  ...evUptake,
  about: `
  <p>This visualisation shows both actual (based on 2023 DVLA data) and forecast
    EV uptake expected across the region (car, van, heavy goods vehicle, bus or taxi/private hire vehicle). </p>
    <p>TfN’s methodology for the EVCI Framework can be found <a
      href="https://www.transportforthenorth.com/major-roads-network/electric-vehicle-charging-infrastructure/"
      target="_blank"
      rel="noopener noreferrer"
    >
      here</a>.</p>`,
  config: {
    ...evUptake.config,
    filters: [
      { ...selectors.runTypeCodeFixed, visualisations: ['EV Uptake'] },
      { ...selectors.year, visualisations: ['EV Uptake'] },
      { ...selectors.administrativeBoundary, visualisations: ['EV Uptake'] },
      { ...selectors.travelScenarioBase, visualisations: ['EV Uptake'] },
      { ...selectors.behaviouralScenario, visualisations: ['EV Uptake'] },
      { ...selectors.vehicleTypeWithBusTaxi, visualisations: ['EV Uptake'] },
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
          { ...selectors.vehicleTypeWithBusTaxi, multiSelect: true, type: 'dropdown' },
          { ...selectors.fuelType, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector"},
        ],
        downloadPath: '/api/evci/ev-uptake/download'
      },
    },
  },
};