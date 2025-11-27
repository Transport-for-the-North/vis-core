import { freightLocationLayerPaint, highGaugeClearedLayerPaint, gaugeClearanceCustomPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";
import { termsOfUse } from "../termsOfUse";

export const freightHighGaugeCleared = {
  pageName: "Freight high gauge cleared network",
  url: "/freight-high-gauge-cleared",
  type: "MapLayout",
  category: "Freight",
  about: `<p>This map shows the TRU benefit realisation in full - showing routings for the first Trans-Pennine high gauge cleared network.</p
        <p>The map also shows the existing high gauge (W10/12) cleared network for rail freight demonstrating a gap across the Pennines.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  customMapZoom: 7,
  customMapCentre: [-2.45, 54.00],
  config: {
    layers: [
        {
            uniqueId: "RailOfferFreightGaigeClearanceVectorTile",
            name: "Loading Gauge Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_freight_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Freight Gauge Network",
            customPaint: gaugeClearanceCustomPaint,
            isHoverable: false,
            isStylable: false,
            shouldShowInLegend: true,
        },
        {
            uniqueId: "RailOfferFreightHGCVectorTile",
            name: "Trans-Pennine High Gauge Cleared Network - TRU freight benefits realisation in full",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_freight_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Freight High Gauge Cleared Network",
            customPaint: highGaugeClearedLayerPaint,
            isHoverable: false,
            isStylable: false,
            shouldShowInLegend: true,
        },
        {
            uniqueId: "RailOfferFreightLocationVectorTile",
            name: "Freight Locations",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_freight_locations/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Freight Locations",
            customPaint: freightLocationLayerPaint,
            isHoverable: false,
            isStylable: false,
            shouldShowInLegend: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 7,
        }
    ],
    visualisations: [{}],
    metadataTables: [],
    filters: [],
    additionalFeatures: {
        glossary: { 
            dataDictionary: glossaryData
        }
    }
  },
};