
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
  <p>Select an output to analyse. Each selection will show further options and fill the map panel with results.
    To get further help, type or select a topic in the glossary box.</p>
  <div class="inset-text-area">
    <p><b>Warning:</b> Beta project to pilot application of the
  <a href="https://chargepoints.dft.gov.uk/">National Chargepoint (NCR) registry</a> as a monitoring and evaluation capability against
  TfN's forecasted requirements (for publicly available charge points).
  All numbers by area, points on map, and applications on road network are based on NCR data downloads.
  The user should verify this data when using beyond strategic planning purposes.
  The user should also note the quality of this data may not be as full as other data sets,
  as it is the responsibility of the operator to add EVI to this database
  (although comparisons have shown reasonable agreement for application in this strategic toolkit).</p>
      </div>`,
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
      download: {
        filters: [
          { ...selectors.administrativeBoundary, multiSelect: true, type: 'toggle' },
          { ...selectors.chargerSpeed, multiSelect: true, type: 'dropdown' },
          { ...selectors.columnNameCP, multiSelect: true, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
          // { ...selectors.zoneSelector, multiselect: true },
        ],
        downloadPath: '/api/evci/cp-area/download'
      },
    },
  },
};
