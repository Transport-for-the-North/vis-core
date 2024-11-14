import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../TermsOfUse";

export const enrouteChargingSites = {
  pageName: "Enroute Charging Sites",
  url: "/@stbTag@/enroute-charging-sites",
  type: "MapLayout",
  category: "@stbName@",
  customLogoPath: "@logoPath@",
  navbarLinkBgColour: "@primaryBgColour@",
  customMapCentre: "@mapCentre@",
  customMapZoom: "@mapZoom@",
  about: `
  <p>Shows the sites within a region with the most enroute for the installation of en-route charging infrastructure. 
  This ranking is not designed to provide users with specific parcels of land for development but is instead designed to show 
  broader regions where rapid charging hub development looks promising.</p>
  <p>These dots are designed to be used alongside "En-route charging demand by major road" data which can be used to identify regions with a need for public charging. Once a region has been identified the "Enroute en-route charging sites" data provides the user with local information (greenbelt restriction, risk of flooding, local traffic flow, existing local charging hubs, a lack of local off street parking) which can be used to identify areas of interest.</p>

<p>These sites are enroute areas where rapid charging hubs (likely to be 5 or more chargers) could be installed, however a detailed analysis of the local area (including planning restrictions, currently installed chargers, nearby amenities, and electricity grid connection costs) would be required to determine if installation is feasible and how many chargers should be installed.</p>

<p>Sites are expressed relative to the single best scored site in the TfN area. Only sites meeting a minimum threshold have been included. Each point represents a hexagonal cell of side length 620 metres, centred on the point shown.</p>
  <div class="inset-text-area">
    <p><b>Warning: </b>Locations shown are not specific parcels of land for development, but intended to show broader regions where rapid 
  charging hub development looks promising.</p>
  </div>`,
  termsOfUse: termsOfUse,
  config: {
    layers: [
      {
        name: "Enroute Charging Sites",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/evci_links/{z}/{x}/{y}?stb_zone_id=@stbZoneId@", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "line",
        visualisationName: "Enroute Charging Sites",
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
        name: "Enroute Charging Sites",
        type: "joinDataToMap",
        joinLayer: "Enroute Charging Sites",
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
      { ...selectors.year, visualisations: ['Enroute Charging Sites'] },
      { ...selectors.columnName, visualisations: ['Enroute Charging Sites'] },
      { ...selectors.vehicleTypeAll, visualisations: ['Enroute Charging Sites'] },
      { ...selectors.stbTag, visualisations: ['Enroute Charging Sites'] },
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
      warning: "Locations shown are not specific parcels of land for development, but intended to show broader regions where rapid charging hub development looks promising."
    },
  },
};
