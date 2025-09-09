import { selectors } from "../selectorDefinitions";
import { evciPavementRoadWidthsPopup } from "../templates";
import { termsOfUse } from "../TermsOfUse";

export const pavementRoadWidth = {
  pageName: "Pavement and Road Widths: EV Charging Suitability Support",
  url: "/@stbTag@/pavement-road-widths",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  navbarLinkBgColour: "@primaryBgColour@",
  customMapCentre: "@mapCentre@",
  customMapZoom: "@mapZoom@",
  about: `
  <p>This visualisation shows pavement and road width data aggregated to MSOA zoning for the region, i.e. which of the regions pavements and roads are suitable for on-street EV charging.</p>
  <p>The classifications of pavement widths used in this analysis (as agreed with the EV regional group) are as follows:
  <ul><li>Red: 0 to 1.8m</li>
  <li>Amber: 1.8 to 2.4m</li>
  <li>Green: 2.4m+</li></ul></p>
  <p>The classifications of road widths used in this analysis (as agreed with the EV regional group) are as follows:
  <ul><li>Red: 0 to 4.8m</li>
  <li>Amber: 4.8 to 8.8m</li>
  <li>Green: 8.8m+</li></ul></p>
  <p>Hovering over each MSOA defines the percentages of pavements/roads within that MSOA that fall into each of the Red Amber Green (RAG) categories. The map is coloured/shaded based
  on the green rated percentages as these MSOAs have a higher percentage of pavements/roads suitable for EV charging.</p>
  <p>More detailed intelligence is available to TfN's partner authorities.</p>
  <p>TfN can support our local authority partners with further information behind these outputs, this can be accessed by emailing <a href=mailto:TfNOffer@transportforthenorth.com>TfNOffer@transportforthenorth.com</a>.</p>
  <p>Other users can use the contact us section on the home page to get in touch should they wish to explore insights and opportunities arising from this toolkit. TfN's methodology for the EVCI Framework can be found
  <a
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
        path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}?parentZoneType=15&parentZoneId=@stbZoneId@",
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "Pavement/Road Widths",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: true,
        hoverNulls: true,
        hoverTipShouldIncludeMetadata: false,
        customTooltip: {
            url: `/api/evci/pavement-road-widths-callout?zoneId={id}&infrastructureTypeId={infrastructureTypeId}`,
            htmlTemplate: evciPavementRoadWidthsPopup,
          },
      }
    ],
    visualisations: [
      {
        name: "Pavement/Road Widths",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/pavement-road-widths",
        legendText: [
          {
            displayValue: "Percentage with high suitability",
            legendSubtitleText: "" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.administrativeBoundaryFixed, visualisations: ['Pavement/Road Widths'] },
      { ...selectors.infrastructureType, visualisations: ['Pavement/Road Widths']},
      { ...selectors.zoneSelector, visualisations: ['Pavement/Road Widths']},
      { ...selectors.stbTag, visualisations: ['Pavement/Road Widths']},
    ],
    additionalFeatures: {
      warning: `Key zonal outputs of this assessment are provided in this public EVCI Framework tool. Further data outputs are available to TfN’s local authority partners and statutory partners and should be request directly. This includes geospatial packages of localised street level information and geometries, shareable under Ordnance Survey’s Public Sector Geospatial Agreement (PSGA).`,
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
            { ...selectors.infrastructureType, multiSelect: true, type: 'dropdown'},
            { ...selectors.administrativeBoundaryFixed, type: 'fixed' },
            { ...selectors.stbTag, type: 'fixed' },
            { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector"},
        ],
        downloadPath: '/api/evci/pavement-road-widths/download'
      },
    },
  },
};