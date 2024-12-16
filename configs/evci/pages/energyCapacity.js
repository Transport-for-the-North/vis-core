import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const energyCapacity = {
  pageName: "Forecast Charging Demand vs Electricity Headroom",
  url: "/@stbTag@/energy-capacity",
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
  <p>This visualisation shows the forecast EV charging demand (of TfN’s lowest demand scenario) vrs current electricity headroom 
  (as per Distribution Network Operator data mapped in 2024). The energy capacity is given in MegaWatts. </p>
  <p>This does not account for other demands on the grid such as housing and heating. </p>
  <ul>
  <li>Green zones – Capacity exists. No grid upgrades required at this time. </li>
  <li>Yellow zones – Low capacity. Planning should be undertaken and upgrades sought in near future. </li>
  <li>Red zones – No capacity expected and areas should be future proofed to ensure adequate resilience to support EV transition.  </li></ul>
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
  legalText: termsOfUse,
  config: {
    layers: [
      {
        name: "Administrative Boundaries",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}?parentZoneType=15&parentZoneId=@stbZoneId@", // matches the path in swagger.json
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "Energy Capacity",
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
        name: "Energy Capacity",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-diverging",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/energy-capacity",
        colorValue: { value: "RdYlGn", label: "RdYlGn" },
        legendText: [
          {
            displayValue: "Energy Capacity",
            legendSubtitleText: "MW",
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.administrativeBoundaryFixed, visualisations: ['Energy Capacity'] },
      { ...selectors.yearTriplet, visualisations: ['Energy Capacity'] },
      { ...selectors.stbTag, visualisations: ['Energy Capacity'] },
      { ...selectors.zoneSelector, visualisations: ['Energy Capacity'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.administrativeBoundaryFixed, type: 'fixed' },
          { ...selectors.yearTriplet, type: 'dropdown', multiSelect: true },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}] },
        ],
        downloadPath: '/api/evci/energy-capacity/download'
      },
      warning: "The forecasted headroom data used for this assessment is changeable as grid demand, supply and connections change over time. This will be intermittently updated with new data made available by our DNOs. The EVCI Framework provides evidence to shape strategic planning, decisions and collaboration around the enabling infrastructure for EV charging. This does not replace DNO advice on specific connection requests or latest headroom capacity. Users should contact the relevant DNO for more detailed information and timeframes for any connection request."
    },
  },
};
