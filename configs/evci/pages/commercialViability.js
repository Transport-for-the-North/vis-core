import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const commercialViability = {
  pageName: "Commercial Viability",
  url: "/@stbTag@/commercial-viability",
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
  <p>This visualisation shows the Commercial Viability.</p>`,
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
        visualisationName: "Commercial Viability",
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
        name: "Commercial Viability",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/zonal-data",
        legendText: [
          {
            displayValue: "Commercial Viability",
            legendSubtitleText: "" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.administrativeBoundaryFixed, visualisations: ['Commercial Viability'] },
      { ...selectors.columnNameCVFixed, visualisations: ['Commercial Viability'] },
      { ...selectors.stbTag, visualisations: ['Commercial Viability'] },
      { ...selectors.areaValueDisplay, visualisations: ['Commercial Viability'] },
      { ...selectors.zoneSelector, visualisations: ['Commercial Viability'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.administrativeBoundaryFixed, type: 'fixed' },
          { ...selectors.columnNameCVFixed, type: 'fixed' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}] },
        ],
        downloadPath: '/api/evci/zonal-data/download'
      },
    },
  },
};
