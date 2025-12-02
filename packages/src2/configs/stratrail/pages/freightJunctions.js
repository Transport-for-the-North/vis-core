import { freightJunctionLayerPaint, gaugeClearanceCustomPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";
import { termsOfUse } from "../termsOfUse";

export const freightJunctions = {
  pageName: "Junctions suppressing freight growth by 2040",
  url: "/freight-junctions",
  type: "MapLayout",
  category: "Freight",
  about: `<p>This visualisation shows junctions assessed as suppressing freight growth by 2040 under a TAG compliant business as usual growth scenario (RFRS 2024).</p>
          <p>Please note analysis suggests Weaver Junction is not anticipated to suppress freight growth until 2050.</p>`,
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