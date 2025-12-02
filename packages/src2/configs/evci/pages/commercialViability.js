import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const commercialViability = {
  pageName: "Commercial Viability",
  url: "/@stbTag@/commercial-viability",
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
  <p>This visualisation shows an assessment of investment and revenue potential (areas most likely to see private sector investment) 
  across the TfN region to inform inclusive planning and delivery decisions (i.e. where focus of public funding and interventions should be, 
  or commercial agreements to ensure a whole network outcome). </p>
  <p>This assessment considers 5 factors critical to charging infrastructure suppliers considerations: Population density; Indices of 
  multiple deprivation, proximity to the major road network; Flood risk and Grid Capacity.</p>
  <p>The data layers, and the weightings applied, were identified through industry intelligence to be representative of the 
  factors of influence on commercial viability. </p>
  <p>The weighted sum of each of the 5 factors generates a commercial viability score for 5m-by-5m cells. Each cell is attributed 
  a commercial viability score, then averaged to generate a single averaged commercial viability score for each LSOA.</p>
  <p>It should be emphasised that individual key stakeholders may consider different factors of influence or vary inconsideration 
  of factor importance when deciding if a site is commercially viable, challenged or strategically important. </p>
  <p>TfN can support our local authority partners with further information behind these outputs, this can be accessed 
  by emailing <u>TfNOffer@transportforthenorth.com</u>.</p>
  <p>Other users can use the contact us section on the home page to get in touch should they wish to explore insights 
  and opportunities arising from this toolkit. TfN’s methodology for the EVCI Framework can be found <a
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
        path: "/api/vectortiles/zones/19/{z}/{x}/{y}?parentZoneType=15&parentZoneId=@stbZoneId@", // matches the path in swagger.json
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "Commercial Viability",
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
        name: "Commercial Viability",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/zonal-data",
        legendText: [
          {
            displayValue: "Commercial Viability",
            legendSubtitleText: "" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.administrativeBoundaryFixedLSOA, visualisations: ['Commercial Viability'] },
      { ...selectors.columnNameCVFixed, visualisations: ['Commercial Viability'] },
      { ...selectors.stbTag, visualisations: ['Commercial Viability'] },
      { ...selectors.zoneSelector, visualisations: ['Commercial Viability'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.administrativeBoundaryFixedLSOA, type: 'fixed' },
          { ...selectors.columnNameCVFixed, type: 'fixed' },
          { ...selectors.stbTag, type: 'fixed' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector" },
        ],
        downloadPath: '/api/evci/zonal-data/download'
      },
      warning: `This visualisation shows an assessment of investment and revenue potential (areas most likely to see private sector investment) across the TfN region to inform inclusive planning and delivery decisions (i.e. where focus of public funding and interventions should be, or commercial agreements to ensure a whole network outcome).
       This assessment considers 5 factors critical to charging infrastructure suppliers considerations: Population density; Indices of multiple deprivation, proximity to the major road network; Flood risk and Grid Capacity.
      It should be emphasised that individual key stakeholders may consider different factors of influence or vary inconsideration of factor importance when deciding if a site is commercially viable, challenged or strategically important.`
    },
  },
};
