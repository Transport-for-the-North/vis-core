import React from 'react';
import { CalloutCardVisualisation } from './CalloutCardVisualisation';
import { MapVisualisation } from './MapVisualisation';

/**
 * VisualisationRenderer component that renders the appropriate visualisation
 * based on the type specified in the visualisation configuration.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.visualisationConfig - The configuration object for the visualisation.
 * @param {Object} props.map - The Maplibre JS map instance.
 * @param {Object} props.maps - The Maplibre JS map instances for left and right maps.
 * @returns {JSX.Element|null} The rendered visualisation component or null if type is unknown.
 */
export const VisualisationManager = ({ visualisationConfig, map, maps, ...props }) => {
  switch (visualisationConfig.type) {
    case 'calloutCard':
      return <CalloutCardVisualisation visualisationName={visualisationConfig.name} {...props} />;
    case 'joinDataToMap':
      return <MapVisualisation visualisationName={visualisationConfig.name} map={map} maps={maps} left={props.left} {...props} />;
    default:
      console.warn(`Unknown visualisation type: ${visualisationConfig.type}`);
      return null;
  }
};