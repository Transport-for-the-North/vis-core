import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const offStreetParkingAccess = {
  pageName: "Off-street parking (Access)",
  url: "/@stbTag@/off-street-parking-access",
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
  <p>This visualisation shows the Off-street parking ('Access').</p>`,
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
        visualisationName: "Off Street Parking Access",
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
        name: "Off Street Parking Access",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/zonal-access",
        legendText: [
          {
            displayValue: "Off Street Parking Access",
            legendSubtitleText: "" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.administrativeBoundary, visualisations: ['Off Street Parking Access'] },
      { ...selectors.columnNameOSPA, visualisations: ['Off Street Parking Access'] },
      { ...selectors.stbTag, visualisations: ['Off Street Parking Access'] },
      { ...selectors.areaValueDisplay, visualisations: ['Off Street Parking Access'] },
      { ...selectors.zoneSelector, visualisations: ['Off Street Parking Access'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.administrativeBoundary, type: 'toggle' },
          { ...selectors.columnNameOSPA, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}] },
        ],
        downloadPath: '/api/evci/zonal-access/download'
      },
    },
  },
};
