import React, { useState, useEffect } from 'react';

/**
 * **MapStatus Component**
 *
 * A React component that displays the current zoom level and center coordinates
 * of a Maplibre map. It overlays this information at the bottom right-hand corner
 * of the map container.
 *
 * @component
 * @example
 * // Assuming 'map' is an instance of a Maplibre map
 * <MapStatus map={map} />
 *
 * @param {Object} props - The component props.
 * @param {Object} props.map - An instance of a Maplibre map object.
 *
 * @returns {JSX.Element|null} Returns a JSX element displaying map status,
 * or null if the map is not initialized.
 */
export const MapStatus = ({ map }) => {
  // Initialize the state with the current zoom and center from the map
  const [zoom, setZoom] = useState(map ? map.getZoom() : null);
  const [center, setCenter] = useState(map ? map.getCenter() : null);

  useEffect(() => {
    if (!map) return;

    const updateStatus = () => {
      setZoom(map.getZoom());
      setCenter(map.getCenter());
    };

    // Ensure we have the current state from the map
    updateStatus();

    // Listen to 'move' event to update status when the map is interacted with
    map.on('move', updateStatus);

    // Clean up the event listener on component unmount
    return () => {
      map.off('move', updateStatus);
    };
  }, [map]);

  if (zoom === null || center === null) {
    return null;
  }

  // Inline styles for the overlay positioned at the bottom right corner
  const overlayStyle = {
    position: 'absolute',
    bottom: '110px',
    left: '10px',
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    align: 'left',
    lineHeight: '1.5',
    borderRadius: '4px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
    zIndex: 1,
  };

  return (
    <div style={overlayStyle}>
      <div>Zoom: {zoom.toFixed(2)}</div>
      <div>
        Center: [{center.lng.toFixed(5)}, {center.lat.toFixed(5)}]
      </div>
    </div>
  );
};