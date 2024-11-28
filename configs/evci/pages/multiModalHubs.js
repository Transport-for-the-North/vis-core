import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const multiModalHubs = {
  pageName: "Multi-Modal Hubs",
  url: "/@stbTag@/multi-modal-hubs",
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
  <p>This visualisation shows the Multi-Modal Hubs.</p>`,
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
        visualisationName: "Multi-Modal Hubs",
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
        name: "Multi-Modal Hubs",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/zonal-data",
        legendText: [
          {
            displayValue: "Multi-Modal Hubs",
            legendSubtitleText: "" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.administrativeBoundaryFixed, visualisations: ['Multi-Modal Hubs'] },
      { ...selectors.columnNameMMHFixed, visualisations: ['Multi-Modal Hubs'] },
      { ...selectors.stbTag, visualisations: ['Multi-Modal Hubs'] },
      //{ ...selectors.areaValueDisplay, visualisations: ['Multi-Modal Hubs'] },
      { ...selectors.zoneSelector, visualisations: ['Multi-Modal Hubs'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.administrativeBoundaryFixed, type: 'fixed' },
          { ...selectors.columnNameMMHFixed, type: 'fixed' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}] },
        ],
        downloadPath: '/api/evci/zonal-data/download'
      },
      warning: "This monitoring capability applies Zap Map data, which has been agreed for sharing within TfN’s EVCI Framework. Further information not provided publicly is available for TfNs local authority partners on request."
    },
  },
};
