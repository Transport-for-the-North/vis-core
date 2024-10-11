import { selectors } from "../selectorDefinitions";

export const enrouteChargingSites = {
  pageName: "Potential Charging Sites",
  url: "/@stbTag@/potential-charging-sites",
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
        name: "Potential Charging Sites",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/evci_potential_charging_sites/{z}/{x}/{y}", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "point",
        visualisationName: "Potential Charging Sites",
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
        name: "Potential Charging Sites",
        type: "joinDataToMap",
        joinLayer: "Potential Charging Sites",
        style: "point-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/potential-charging-sites",
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.vehicleType, visualisations: ['Potential Charging Sites'] },
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};
