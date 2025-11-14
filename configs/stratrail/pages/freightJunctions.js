import { freightJunctionLayerPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";
import { termsOfUse } from "../termsOfUse";

export const freightJunctions = {
  pageName: "Junctions Suppressing Freight Growth by 2040",
  url: "/freight-junctions",
  type: "MapLayout",
  category: "Freight",
  about: `<p>This visualisation shows junctions assessed as suppressing freight growth by 2040 under a TAG compliant business as usual growth scenario (RFRS 2024)</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  customMapZoom: 7,
  customMapCentre: [-2.45, 54.00],
  config: {
    layers: [
        {
            uniqueId: "RailOfferFreightJunctionVectorTile",
            name: "Freight Junctions",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_freight_junctions/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Freight Junctions",
            customPaint: freightJunctionLayerPaint,
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