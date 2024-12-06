import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const offStreetParkingAccess = {
  pageName: "Off-Street Parking Accessibility",
  url: "/@stbTag@/off-street-parking-access",
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
  <p>This visualisation shows off-street parking accessibility for the region, i.e. which of the regions 6.4 million residences have a driveway. 
  More detailed intelligence is available to TfN’s partner authorities. </p>
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
        visualisationName: "Off Street Parking Access",
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
        name: "Off Street Parking Access",
        type: "joinDataToMap",
        joinLayer: "Administrative Boundaries",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/evci/zonal-access",
        legendText: [
          {
            displayValue: "Off Street Parking Access",
            legendSubtitleText: "" 
          }
        ]
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.administrativeBoundaryFixed, visualisations: ['Off Street Parking Access'] },
      { ...selectors.columnNameOSPA, visualisations: ['Off Street Parking Access'] },
      { ...selectors.stbTag, visualisations: ['Off Street Parking Access'] },
      //{ ...selectors.areaValueDisplay, visualisations: ['Off Street Parking Access'] },
      { ...selectors.zoneSelector, visualisations: ['Off Street Parking Access'] }
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      download: {
        filters: [
          { ...selectors.administrativeBoundaryFixed },
          { ...selectors.columnNameOSPA, type: 'dropdown' },
          { ...selectors.stbTag, type: 'fixed' },
          // { ...selectors.areaValueDisplay, multiSelect: true, type: 'toggle' },
          { ...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}] },
        ],
        downloadPath: '/api/evci/zonal-access/download'
      },
      warning: "An MSOA's car park access is an average of its contained LSOAs score. LSOA access is dependent on whether the LSOA's centroid, its geographic middle of population density, is located with ten minutes walking distance to a car park. Although some residencies in an MSOA may have ten minute walking access to a car park, only an LSOA's centroid contributes to the score. Because of this, some MSOAs may appear with a zero score, even when they contain a small number of residencies with access."
    },
  },
};
