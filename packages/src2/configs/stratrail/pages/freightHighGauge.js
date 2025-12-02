import { freightLocationLayerPaint, gaugeClearanceCustomPaint, highGaugeLayerPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";
import { termsOfUse } from "../termsOfUse";

export const freightHighGauge = {
  pageName: "Freight high gauge types",
  url: "/freight-high-gauge-types",
  type: "MapLayout",
  category: "Freight",
  about: `<p>This map shows the proposed additional high gauge (W12) clearance to interventions to support full TRU freight benefit realisation.</p
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
            name: "TRU freight benefit realisation MVP (subject to approval)",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_freight_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Freight High Gauge Network",
            customPaint: highGaugeLayerPaint,
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