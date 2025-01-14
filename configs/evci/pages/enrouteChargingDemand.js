import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const enrouteChargingDemand = {
  pageName: "Forecast En-route Charging Demand",
  url: "/@stbTag@/enroute-charging-demand",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  navbarLinkBgColour: "@primaryBgColour@",
  customMapCentre: "@mapCentre@",
  customMapZoom: "@mapZoom@",
  about: `
  <p>This shows the likelihood of vehicles stopping to charge during their journeys,
     by Major Road Network (MRN) and Strategic Road Network (SRN) segment. </p>
     <p>TfN can support our local authority partners with further information behind these outputs, 
  this can be accessed by emailing <u>TfNOffer@transportforthenorth.com</u>. <br>Other users can use the contact us section on the 
  home page to get in touch should they wish to explore insights and opportunities arising from this toolkit. TfN’s methodology for the EVCI Framework 
  can be found <a
              href="https://www.transportforthenorth.com/major-roads-network/electric-vehicle-charging-infrastructure/"
              target="_blank"
              rel="noopener noreferrer"
            >
             here</a>.</p>
  `,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
      {
        name: "Major Roads",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/mrn_links/{z}/{x}/{y}?stb_zone_id=@stbZoneId@", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "line",
        visualisationName: "Forecast En-route Charging Demand",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: true,
      }
    ],
    visualisations: [
      {
        name: "Forecast En-route Charging Demand",
        type: "joinDataToMap",
        joinLayer: "Major Roads",
        style: "line-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/enroute-charging-sites",
        legendText: [
          {
            displayValue: "Charging sites",
            legendSubtitleText: "/100" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.year, visualisations: ['Forecast En-route Charging Demand'] },
      { ...selectors.columnName, visualisations: ['Forecast En-route Charging Demand'] },
      { ...selectors.vehicleTypeAll, visualisations: ['Forecast En-route Charging Demand'] },
      { ...selectors.stbTag, visualisations: ['Forecast En-route Charging Demand'] },
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      }
    },
  },
};
