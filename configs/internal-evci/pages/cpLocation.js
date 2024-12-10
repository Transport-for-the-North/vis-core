import { selectors } from "../selectorDefinitions";
import { termsOfUse, termsOfUseCP } from "../TermsOfUse";

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
  <p>This visualisation shows the actual chargers and power numbers by location.</p>
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
