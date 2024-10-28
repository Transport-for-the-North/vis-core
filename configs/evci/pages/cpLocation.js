import { selectors } from "../selectorDefinitions";

export const cpLocation = {
  pageName: "Chargers/Power by Location",
  url: "/@stbTag@/cp-location",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  customMapCentre: "@mapCentre@",
  customMapZoom: "@mapZoom@",
  navbarLinkBgColour: "@primaryBgColour@",
  about: `
  <p>Select an output to analyse. Each selection will show further options and fill the map panel with results.
    To get further help, type or select a topic in the glossary box.</p>
  <div class="inset-text-area">
    <p><b>Warning:</b> Beta project to pilot application of the
  <a href="https://chargepoints.dft.gov.uk/">National Chargepoint (NCR) registry</a> as a monitoring and evaluation capability against
  TfN's forecasted requirements (for publicly available charge points).
  All numbers by area, points on map, and applications on road network are based on NCR data downloads.
  The user should verify this data when using beyond strategic planning purposes.
  The user should also note the quality of this data may not be as full as other data sets,
  as it is the responsibility of the operator to add EVI to this database
  (although comparisons have shown reasonable agreement for application in this strategic toolkit).</p>
      </div>`,
  config: {
    layers: [
      {
        name: "Charging Sites",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/evci_actual_charging_sites/{z}/{x}/{y}", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "point",
        visualisationName: "Chargers/Power by Location",
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
        name: "Chargers/Power by Location",
        type: "joinDataToMap",
        joinLayer: "Charging Location",
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
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};
