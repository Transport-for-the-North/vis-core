import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const cpMajorRoad = {
  pageName: "Chargers/Power by Major Road",
  url: "/@stbTag@/cp-major-road",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  navbarLinkBgColour: "@primaryBgColour@",
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
          { ...selectors.distanceValueDisplay, multiSelect: true, type: 'toggle' },
          // { ...selectors.zoneSelector, multiselect: true, type: 'mapFeatureSelect' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
        ],
        downloadPath: '/api/evci/cp-major-road/download'
      },
    },
  },
};
