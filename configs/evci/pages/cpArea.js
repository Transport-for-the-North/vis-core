
import { selectors } from "../selectorDefinitions";
import { termsOfUse, termsOfUseCP } from "../TermsOfUse";

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
  <p>This visualisation shows the actual chargers and power numbers by area.</p>
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
        name: "Administrative Boundaries",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}?parentZoneType=15&parentZoneId=@stbZoneId@", // matches the path in swagger.json
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
      warning: "This monitoring capability applies Zap Map data, which has been agreed for sharing within TfN’s EVCI Framework. Further information not provided publicly is available for TfNs local authority partners on request.",
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};
