import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const cpLocation = {
  pageName: "Actual: Chargers/Power by Location",
  url: "/@stbTag@/cp-location",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  customMapCentre: "@mapCentre@",
  customMapZoom: "@mapZoom@",
  navbarLinkBgColour: "@primaryBgColour@",
  about: `
  <p>This visualisation shows the actual chargers and power numbers by location.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
      {
        name: "Charging Sites",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/evci_actual_charging_sites/{z}/{x}/{y}?stb_zone_id=@stbZoneId@", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "point",
        visualisationName: "Chargers/Power by Location",
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
        name: "Chargers/Power by Location",
        type: "joinDataToMap",
        joinLayer: "Charging Sites",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/cp-location",
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.chargerSpeed, visualisations: ['Chargers/Power by Location'] },
      { ...selectors.columnNameCP, visualisations: ['Chargers/Power by Location'] },
      { ...selectors.stbTag, visualisations: ['Chargers/Power by Location'] },
      { ...selectors.siteSelector, visualisations: ['Chargers/Power by Location'], layer: "Charging Sites" }
    ],
    additionalFeatures: {
      warning: "This monitoring capability applies Zap Map data, which has been agreed for sharing within TfN’s EVCI Framework. Further information not provided publicly is available for TfNs local authority partners on request.",
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};
