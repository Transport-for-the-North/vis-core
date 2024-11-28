
import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const cpArea = {
  pageName: "Actual: Chargers/Power by Area",
  url: "/@stbTag@/cp-area",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  navbarLinkBgColour: "@primaryBgColour@",
  primaryBgColour:"@primaryBgColour@",
  primaryFontColour:"@primaryFontColour@",
  secondaryBgColour:"@secondaryBgColour@",
  secondaryFontColour:"@secondaryFontColour@",
  customMapCentre: "@mapCentre@",
  customMapZoom: "@mapZoom@",
  about: `
  <p>This visualisation shows the actual chargers and power numbers by area.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
      {
        name: "Administrative Boundaries",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}?parentZoneTypeId=15&parentZoneId=@stbZoneId@", // matches the path in swagger.json
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "Chargers/Power by Area",
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
        name: "Chargers/Power by Area",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/cp-area",
        legendText: [
          {
            displayValue: "Installed chargers",
            legendSubtitleText: "" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.administrativeBoundary, visualisations: ['Chargers/Power by Area'] },
      { ...selectors.chargerSpeed, visualisations: ['Chargers/Power by Area'] },
      { ...selectors.columnNameCP, visualisations: ['Chargers/Power by Area'] },
      { ...selectors.stbTag, visualisations: ['Chargers/Power by Area'] },
      { ...selectors.areaValueDisplay, visualisations: ['Chargers/Power by Area'] },
      { ...selectors.zoneSelector, visualisations: ['Chargers/Power by Area'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};
