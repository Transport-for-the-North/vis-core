import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLES = {
  streets: {
    name: 'Streets',
    url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    icon: '🗺️',
  },
  satellite: {
    name: 'Satellite',
    url: {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: '© Esri, Maxar, Earthstar Geographics',
        },
      },
      layers: [
        {
          id: 'esri-satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
    icon: '🛰️',
  },
};

const MapContainer = styled.div`
  width: 100%;
  height: ${props => props.$height || '300px'};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgb(220, 220, 220);
  background: #e8e8e8;
  position: relative;
`;

const HintOverlay = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: #64748b;
  font-size: 0.8rem;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  z-index: 1;
  pointer-events: none;
  max-width: 200px;
`;

const CoordinatesDisplay = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(255, 255, 255, 0.95);
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: 'Hanken Grotesk', monospace;
  color: #333;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  z-index: 1;
`;

const ControlsContainer = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
`;

const LayerToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  overflow: hidden;
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  background: ${props => props.$active ? '#dbeafe' : 'transparent'};
  color: ${props => props.$active ? '#1d4ed8' : '#64748b'};
  font-size: 0.75rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;

  &:hover {
    background: ${props => props.$active ? '#dbeafe' : '#f1f5f9'};
  }

  &:not(:last-child) {
    border-right: 1px solid #e2e8f0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  span.icon {
    font-size: 1rem;
  }
`;

/**
 * CoordinatePreviewMap - A map component for coordinate preview and selection.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number|string} props.lat - Latitude value
 * @param {number|string} props.lng - Longitude value
 * @param {string} [props.height='300px'] - Height of the map container
 * @param {number} [props.zoom=12] - Zoom level when coordinates are set
 * @param {string} [props.markerColor='#dc2626'] - Color of the marker
 * @param {string} [props.mapStyle] - Optional custom map style URL
 * @param {Array} [props.defaultCenter=[-1.5, 53.5]] - Default map center [lng, lat]
 * @param {number} [props.defaultZoom=10] - Default zoom level
 * @param {Function} [props.onMapClick] - Callback when map is clicked
 * @param {boolean} [props.clickToSelect=false] - Enable click-to-select coordinates mode
 */
export const CoordinatePreviewMap = ({
  lat,
  lng,
  height = '300px',
  zoom = 12,
  markerColor = '#dc2626',
  mapStyle,
  defaultCenter = [-1.5, 53.5],
  defaultZoom = 10,
  onMapClick,
  clickToSelect = false,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [activeLayer, setActiveLayer] = useState('streets');

  // Handle layer toggle
  const handleLayerChange = useCallback((layerKey) => {
    if (!mapRef.current || layerKey === activeLayer) return;
    
    const map = mapRef.current;
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    
    map.setStyle(MAP_STYLES[layerKey].url);
    
    map.once('style.load', () => {
      map.setCenter(currentCenter);
      map.setZoom(currentZoom);
      
      // Re-add marker if exists
      if (markerRef.current) {
        const lngLat = markerRef.current.getLngLat();
        markerRef.current.remove();
        
        const el = document.createElement('div');
        el.innerHTML = `
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="${markerColor}"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
          </svg>
        `;
        el.style.cursor = 'pointer';
        el.style.transform = 'translate(-50%, -100%)';
        
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(lngLat)
          .addTo(map);
        
        markerRef.current = marker;
      }
    });
    
    setActiveLayer(layerKey);
  }, [activeLayer, markerColor]);

  // Parse coordinates
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const hasValidCoordinates = !isNaN(parsedLat) && !isNaN(parsedLng) &&
    parsedLat >= -90 && parsedLat <= 90 &&
    parsedLng >= -180 && parsedLng <= 180;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const defaultStyleUrl = mapStyle || MAP_STYLES.streets.url;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: defaultStyleUrl,
      center: defaultCenter,
      zoom: defaultZoom,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      setIsMapReady(true);
    });

    if (clickToSelect && onMapClick) {
      map.getCanvas().style.cursor = 'crosshair';
    }

    mapRef.current = map;

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle]);

  // Handle map click for coordinate selection
  useEffect(() => {
    if (!mapRef.current || !isMapReady || !clickToSelect || !onMapClick) return;

    const map = mapRef.current;
    
    const handleClick = (e) => {
      const { lng, lat } = e.lngLat;
      onMapClick({
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
      });
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [isMapReady, clickToSelect, onMapClick]);

  // Update marker when coordinates change
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const map = mapRef.current;

    if (hasValidCoordinates) {
      if (markerRef.current) {
        markerRef.current.remove();
      }

      const el = document.createElement('div');
      el.innerHTML = `
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="${markerColor}"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      `;
      el.style.cursor = 'pointer';
      el.style.transform = 'translate(-50%, -100%)';

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([parsedLng, parsedLat])
        .addTo(map);

      markerRef.current = marker;

      map.flyTo({
        center: [parsedLng, parsedLat],
        zoom: zoom,
        duration: 1000,
      });
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      map.flyTo({
        center: defaultCenter,
        zoom: defaultZoom,
        duration: 500,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedLat, parsedLng, hasValidCoordinates, isMapReady, zoom, markerColor]);

  // Get hint text
  const getHintText = () => {
    if (clickToSelect) {
      return '📍 Click map or enter coordinates';
    }
    return '📍 Enter coordinates to preview location';
  };

  return (
    <MapContainer $height={height}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      
      <ControlsContainer>
        {/* Layer toggle */}
        <LayerToggle>
          {Object.entries(MAP_STYLES).map(([key, style]) => (
            <ToolButton
              key={key}
              $active={activeLayer === key}
              onClick={() => handleLayerChange(key)}
              title={style.name}
            >
              <span className="icon">{style.icon}</span>
              {style.name}
            </ToolButton>
          ))}
        </LayerToggle>
      </ControlsContainer>
      
      {/* Hint overlay */}
      {!hasValidCoordinates && (
        <HintOverlay>
          {getHintText()}
        </HintOverlay>
      )}
      
      {/* Coordinate display */}
      {hasValidCoordinates && (
        <CoordinatesDisplay>
          {parsedLat.toFixed(5)}, {parsedLng.toFixed(5)}
        </CoordinatesDisplay>
      )}
    </MapContainer>
  );
};
