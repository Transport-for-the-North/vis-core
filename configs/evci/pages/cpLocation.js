import { selectors } from "../selectorDefinitions";

export const cpLocation = {
  pageName: "Chargers/Power by Location",
  url: "/@stbTag@/cp-location",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  navbarLinkBgColour: "@primaryBgColour@",
  about: `
  <p>Select an output to analyse. Each selection will show further options and fill the map panel with results.
    To get further help, type or select a topic in the glossary box.</p>
  <p>EV uptake gives the number of electric vehicles (EVs) that are expected across the region, 
    split by powertrain type (battery electric or plug-in hybrid) and vehicle type (car, van, or heavy goods vehicle).</p>`,
  config: {
    layers: [
      {
        name: "Charging Sites",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/evci_actual_charging_sites/{z}/{x}/{y}", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "point",
        visualisationName: "Chargers/Power by Location",
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
        name: "Chargers/Power by Location",
        type: "joinDataToMap",
        joinLayer: "Charging Location",
        style: "point-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/cp-location",
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.chargerSpeed, visualisations: ['Chargers/Power by Location'] },
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};
