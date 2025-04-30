import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import glossaryData from "../glossaryData";
import {severancePopup, severanceCallout} from '../templates/index';

export const england = {
  pageName: "Severance in England",
  url: "/severance-in-england",
  category: null,
  type: "MapLayout",
  about: `
  <p>View Severance data nationally.</p>
  <p>This map shows the Severance index for Output Areas in England. Click on areas to see more information.</p>`,
  legalText: termsOfUse,
  termsOfUse: termsOfUse,
  config: {
    layers: [
      {
        name: "Output Areas",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/28/{z}/{x}/{y}", // specify query params empty if to be set
        sourceLayer: "zones",
        minZoom: 10,
        geometryType: "polygon",
        visualisationName: "Severance Decile",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: false,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: false,
        invertedColorScheme: false,
        outlineOnPolygonSelect: true,
        customTooltip: {
          url: `/api/severance/callout-data?zoneId={id}&barrierId={barrierId}&walkSpeed={walkSpeed}&destinationId={destinationId}`,
          htmlTemplate: severancePopup
        }
      },
      {
        name: "Local Authorities",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/29/{z}/{x}/{y}",
        sourceLayer: "zones",
        geometryType: "polygon",
        isHoverable: false,
        isStylable: false,
        shouldHaveTooltipOnHover: false,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: false,
      },
      {
        name: "Major Road Network",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/mrn_links_dft/{z}/{x}/{y}",
        sourceLayer: "geometry",
        geometryType: "line",
        isHoverable: false,
        isStylable: false,
        shouldHaveTooltipOnHover: false,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: false,
        shouldShowInLegend: true
      },
      {
        name: "Strategic Road Network",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/srn_links_dft/{z}/{x}/{y}",
        sourceLayer: "geometry",
        geometryType: "line",
        isHoverable: false,
        isStylable: false,
        shouldHaveTooltipOnHover: false,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: false,
        shouldShowInLegend: true
      },
    ],
    visualisations: [
      {
        name: "Severance Decile",
        type: "joinDataToMap",
        joinLayer: "Output Areas",
        style: "polygon-continuous", //"polygon-categorical"
        joinField: "id",
        valueField: "value",
        shouldFilterDataToViewport: true, // ideally only do this if we have fixed categories, otherwise the classes will shift with each view change
        dataSource: "api",
        dataPath: "/api/severance/decile-data",
        legendText: [
          {
            displayValue: "Output Areas",
            legendSubtitleText: "Decile" 
          }
        ]
      },
      {
        name: "Severance Callout",
        type: "calloutCard",
        cardName: "Output Area Summary",
        dataSource: "api",
        dataPath: "/api/severance/callout-data",
        htmlFragment: severanceCallout
      }
    ],
    metadataTables: [{
      name: "destination_list",
      path: "/api/getgenericdataset?dataset_id=foreign_keys.destination_list"
    },{
      name: "barrier_list",
      path: "/api/getgenericdataset?dataset_id=foreign_keys.barrier_list"
    },{
      name: "v_vis_severance_walk_speed",
      path: "/api/getgenericdataset?dataset_id=views_vis.v_vis_severance_walk_speed"
    }],
    filters: [
      selectors.barrierType,
      selectors.walkSpeed,
      selectors.destinationType,
      selectors.severanceType,
      selectors.zoneId,
      selectors.variable
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: glossaryData
      },
      download: {
        filters: [
          { ...selectors.barrierType, type: 'fixed' },
          { ...selectors.walkSpeed, type: 'fixed' },
          { ...selectors.destinationType, multiSelect: true, type: 'dropdown' },
          { ...selectors.severanceType, multiSelect: true, type: 'dropdown' },
          { ...selectors.downloadLocalAuthority, type: 'mapFeatureSelect' },
          {...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector"}
        ],
        downloadPath: '/api/severance/decile-data/download'
      },
    },
  },
};