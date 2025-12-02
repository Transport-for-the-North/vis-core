import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import glossaryData from "../glossaryData";
import {severancePopup, severanceCallout} from '../templates/index';

/*
  Custom formatting functions for tooltips and callouts.
*/
const customFormattingFunctions = {
  convertDecileNumberToString: (value) => {
    const decileMapping = {
      0: "-",
      999: "-",
    };
    return decileMapping[value] || value;
  },
  formatReach: (value) => {
    const reachMapping = {
      999: "-",
    };
    // Check if the value is in the reachMapping
    if (reachMapping.hasOwnProperty(value)) {
      return reachMapping[value];
    }

    // Format the number with commas
    return value.toLocaleString();
  },
}

export const england = {
  pageName: "Severance across England",
  url: "/severance-in-england",
  category: null,
  type: "MapLayout",
  about: `
  <p>This interactive map shows the severance index for Output Areas across England. These scores indicate the ability to access a range of destination types due to the presence of the SRN, MRN, and Rail infrastructure. </p>
  <p>Zoom in and click on areas to see more information.</p>`,
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
        enforceNoColourSchemeSelector: true,
        enforceNoClassificationMethod: true,
        customTooltip: {
          url: `/api/severance/callout-data?zoneId={id}&barrierId={barrierId}&walkSpeed={walkSpeed}&destinationId={destinationId}`,
          htmlTemplate: severancePopup,
          customFormattingFunctions: customFormattingFunctions
        },
      },
      {
        name: "Local Authorities",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/35/{z}/{x}/{y}",
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
            legendSubtitleText: "Decile",
          },
        ],
      },
      {
        name: "Severance Callout",
        type: "calloutCard",
        cardName: "Output Area Summary",
        dataSource: "api",
        dataPath: "/api/severance/callout-data",
        htmlFragment: severanceCallout,
        customFormattingFunctions: customFormattingFunctions,
      },
    ],
    metadataTables: [
      {
        name: "destination_list",
        path: "/api/getgenericdataset?dataset_id=foreign_keys.destination_list",
      },
      {
        name: "barrier_list",
        path: "/api/getgenericdataset?dataset_id=foreign_keys.barrier_list",
      },
      {
        name: "v_vis_severance_walk_speed",
        path: "/api/getgenericdataset?dataset_id=views_vis.v_vis_severance_walk_speed",
      },
    ],
    filters: [
      selectors.barrierType,
      selectors.walkSpeed,
      selectors.destinationType,
      selectors.severanceType,
      selectors.zoneId,
      selectors.variable,
    ],
    additionalFeatures: {
      mobileWarning: "Please open the filter for more information on how to use this map.",
      glossary: {
        dataDictionary: glossaryData,
      },
      download: {
        filters: [
          { ...selectors.barrierType, type: 'fixed', multiSelect: false },
          { ...selectors.walkSpeed, type: 'fixed' },
          { ...selectors.destinationType, multiSelect: true, type: 'dropdown' },
          { ...selectors.severanceType, multiSelect: true, type: 'dropdown' },
          { ...selectors.downloadLocalAuthority, type: 'mapFeatureSelect', isClearable: true },
          {...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector"}
        ],
        downloadPath: '/api/severance/decile-data/download',
        requestMethod: 'GET',
      },
      download: {
        filters: [
          { ...selectors.barrierType, type: 'fixed', multiSelect: false },
          { ...selectors.walkSpeed, type: 'fixed' },
          { ...selectors.destinationType, multiSelect: true, type: 'dropdown' },
          { ...selectors.severanceType, multiSelect: true, type: 'dropdown' },
          { ...selectors.downloadLocalAuthority, type: 'mapFeatureSelect', isClearable: true },
          {...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector"}
        ],
        downloadPath: '/api/severance/decile-data/download',
        requestMethod: 'GET',
      },
      download: {
        filters: [
          { ...selectors.barrierType, type: 'fixed', multiSelect: false },
          { ...selectors.walkSpeed, type: 'fixed' },
          { ...selectors.destinationType, multiSelect: true, type: 'dropdown' },
          { ...selectors.severanceType, multiSelect: true, type: 'dropdown' },
          { ...selectors.downloadLocalAuthority, type: 'mapFeatureSelect', isClearable: true },
          {...selectors.zoneSelector, actions: [{action: 'SET_SELECTED_FEATURES'}], filterName: "Optional location selector"}
        ],
        downloadPath: '/api/severance/decile-data/download',
        requestMethod: 'GET',
      },
    },
  },
};