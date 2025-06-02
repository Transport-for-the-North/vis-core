import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const enrouteNetworkDemand = {
  pageName: "Forecast En-route Charging Demand",
  url: "/@stbTag@/enroute-network-demand",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  navbarLinkBgColour: "@primaryBgColour@",
  customMapCentre: "@mapCentre@",
  customMapZoom: "@mapZoom@",
  about: `
  <p>This shows metrics based on the likelihood of vehicles stopping to charge on segments of TfN's NoHAM (TfN's northern highways model) network. The two metric options are:</p>
      <ul><li>Number of units (chargers)</li><li>Charger power required per year in Kilowatt hours (kWh)</li></ul>
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
        name: "NoHAM network",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/noham_links/{z}/{x}/{y}", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "line",
        visualisationName: "Forecast En-route Charging Demand",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 10,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: true,
      }
    ],
    visualisations: [
      {
        name: "Forecast En-route Charging Demand",
        type: "joinDataToMap",
        joinLayer: "NoHAM network",
        style: "line-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/enroute-network",
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
      { ...selectors.columnNameRapid, visualisations: ['Forecast En-route Charging Demand'] },
      { ...selectors.vehicleType, visualisations: ['Forecast En-route Charging Demand'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.year, multiSelect: true, shouldBeBlankOnInit: false, type: 'dropdown' },
          { ...selectors.columnNameRapid, multiSelect: false, type: 'toggle' },
          { ...selectors.vehicleType, multiSelect: true, type: 'dropdown' },
          { ...selectors.linkSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector", layer: "NoHAM network"},
        ],
        downloadPath: '/api/evci/enroute-network/download'
      }
    },
  },
};
