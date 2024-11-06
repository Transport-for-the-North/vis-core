import { selectors } from "../selectorDefinitions";

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
        visualisationName: "EV Uptake",
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
      { ...selectors.travelScenario, visualisations: ['EV Uptake'] },
      { ...selectors.behaviouralScenario, visualisations: ['EV Uptake'] },
      { ...selectors.vehicleType, visualisations: ['EV Uptake'] },
      { ...selectors.fuelType, visualisations: ['EV Uptake'] },
      { ...selectors.stbTag, visualisations: ['EV Uptake'] },
      { ...selectors.areaValueDisplay, visualisations: ['EV Uptake'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};
