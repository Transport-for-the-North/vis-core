import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const cpMajorRoad = {
  pageName: "Actual: Chargers/Power by Major Road",
  url: "/@stbTag@/cp-major-road",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  navbarLinkBgColour: "@primaryBgColour@",
  customMapCentre: "@mapCentre@",
  customMapZoom: "@mapZoom@",
  about: `
  <p>This visualisation shows the actual chargers and power numbers across the region’s major roads.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
      {
        name: "Roads",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/evci_links/{z}/{x}/{y}?stb_zone_id=@stbZoneId@", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "line",
        visualisationName: "Chargers/Power by Major Road",
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
      { ...selectors.chargerSpeed, visualisations: ['Chargers/Power by Major Road'] },
      { ...selectors.columnNameCP, visualisations: ['Chargers/Power by Major Road'] },
      { ...selectors.stbTag, visualisations: ['Chargers/Power by Major Road'] },
      { ...selectors.distanceValueDisplay, visualisations: ['Chargers/Power by Major Road'] },
      { ...selectors.zoneSelector, visualisations: ['Chargers/Power by Major Road'], layer: "Roads" }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.chargerSpeed, multiSelect: true, type: 'dropdown' },
          { ...selectors.columnNameCP, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.distanceValueDisplay, multiSelect: true, type: 'toggle' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}] },
        ],
        downloadPath: '/api/evci/cp-major-road/download'
      },
    },
  },
};
