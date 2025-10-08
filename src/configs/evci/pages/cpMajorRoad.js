import { selectors } from "../selectorDefinitions";
import { termsOfUse, termsOfUseCP } from "../TermsOfUse";

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
  <p>This visualisation shows the actual chargers and power numbers across the region’s major roads.</p>
  <p>TfN can support our local authority partners with further information behind these outputs, 
  this can be accessed by emailing <u>TfNOffer@transportforthenorth.com</u>. <br>Other users can use the contact us section on the 
  home page to get in touch should they wish to explore insights and opportunities arising from this toolkit. TfN’s methodology for the EVCI Framework 
  can be found <a
              href="https://www.transportforthenorth.com/major-roads-network/electric-vehicle-charging-infrastructure/"
              target="_blank"
              rel="noopener noreferrer"
            >
             here</a>.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUseCP,
  config: {
    layers: [
      {
        name: "Roads",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/mrn_links/{z}/{x}/{y}?stb_zone_id=@stbZoneId@", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "line",
        visualisationName: "Chargers/Power by Major Road",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 10,
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
      { ...selectors.linkSelector, visualisations: ['Chargers/Power by Major Road'], layer: "Roads" }
    ],
    additionalFeatures: {
      warning: "This monitoring capability applies Zap Map data, which has been agreed for sharing within TfN’s EVCI Framework. Further information not provided publicly is available for TfNs local authority partners on request.",
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.chargerSpeed, multiSelect: true, shouldBeBlankOnInit: false, type: 'dropdown' },
          { ...selectors.columnNameCP, multiSelect: false, type: 'toggle' },
          { ...selectors.stbTag, type: 'fixed' },
          { ...selectors.distanceValueDisplay, multiSelect: true, type: 'dropdown' },
          { ...selectors.linkSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], layer: "Roads", filterName: "Optional location selector"},
        ],
        downloadPath: '/api/evci/cp-major-road/download'
      }
    },
  },
};
