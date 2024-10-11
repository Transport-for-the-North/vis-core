import { selectors } from "../selectorDefinitions";

export const cpMajorRoad = {
  pageName: "Chargers/Power by Major Road",
  url: "/@stbTag@/cp-major-road",
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
        name: "Roads",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/evci_links/{z}/{x}/{y}", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "line",
        visualisationName: "Chargers/Power by Major Road",
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
        name: "Chargers/Power by Major Road",
        type: "joinDataToMap",
        joinLayer: "Roads",
        style: "line-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/cp-major-road",
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.distanceValueDisplay, visualisations: ['Chargers/Power by Major Road'] },
      { ...selectors.chargerSpeed, visualisations: ['Chargers/Power by Major Road'] },
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};
