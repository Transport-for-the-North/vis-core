import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const multiModalHubs = {
  pageName: "Multi-Modal hub EV demand assessment",
  url: "/@stbTag@/multi-modal-hubs",
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
  <p>This function provides an assessment of EV demand for key potential multi modal hub locations across the region. </p>
  <p>Datasets have been collected which cover the factors of influence identified for multi modal hubs. Including: 
  Existing EVCI network; Grid capacity; EV and EV charging forecasts; Environmental considerations; Proximity to the Highway Network; 
  Transport Hub Infrastructure; and Origin / Destination demand of rail passengers. </p>
  <p>These are geospatial datasets, downloaded from publicly available data sources and from TfN data and evidence.</p>
  <p>A scoring system was developed and agreed with the TfN partnership for each parameter/layer, to provide an assessment of potential requirements for EV charging.</p>
  <p>It should be emphasised that individual key stakeholders may consider different factors of influence when deciding if a site is appropriate for multi modal hubs. 
  Further specific site investigation and development work is advised for any locations of interest.</p>
  <p>TfN can support our local authority partners with further information behind these outputs, this can be 
  accessed by emailing <u>TfNOffer@transportforthenorth.com</u>.</p>
  <p>Other users can use the contact us section on the home page to get in touch should they wish to explore insights and opportunities arising from this toolkit. 
  TfN’s methodology for the EVCI Framework can be found <a
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
        visualisationName: "Multi-Modal Hubs",
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
        name: "Multi-Modal Hubs",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/zonal-data",
        legendText: [
          {
            displayValue: "Multi-Modal Hubs",
            legendSubtitleText: "" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.administrativeBoundaryFixedLSOA, visualisations: ['Multi-Modal Hubs'] },
      { ...selectors.columnNameMMHFixed, visualisations: ['Multi-Modal Hubs'] },
      { ...selectors.stbTag, visualisations: ['Multi-Modal Hubs'] },
      //{ ...selectors.areaValueDisplay, visualisations: ['Multi-Modal Hubs'] },
      { ...selectors.zoneSelector, visualisations: ['Multi-Modal Hubs'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.administrativeBoundaryFixedLSOA, type: 'fixed' },
          { ...selectors.columnNameMMHFixed, type: 'fixed' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector" },
        ],
        downloadPath: '/api/evci/zonal-data/download'
      },
      warning: `Datasets have been collected which cover the factors of influence identified for multi modal hubs. Including: Existing EVCI network; Grid capacity; EV and EV charging forecasts; Environmental considerations; Proximity to the Highway Network; Transport Hub Infrastructure; and Origin / Destination demand of rail passengers.
      These are geospatial datasets, downloaded from publicly available data sources and from TfN data and evidence.
      Further specific site investigation and development work is advised for any locations of interest.`,
    },
  },
};
