import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { defaultMapStyle } from "defaults";
import { defaultMapCentre } from "defaults";
import { defaultMapZoom } from "defaults";

/**
 * Custom hook to initialize and manage a MapLibre map.
 * @function useMap
 * @param {React.RefObject} mapContainerRef - Ref object pointing to the map container DOM element.
 * @param {string} mapStyle - A custom map style.
 * @param {Array<number>} mapCentre - The initial map center coordinates [longitude, latitude].
 * @param {number} mapZoom - The initial map zoom level.
 * @param {string} extraCopyrightText - Extra copyright text that needs to go in the bottom right bar.
 * @returns {Object} An object containing the map instance, map style loaded state, map loaded state, and map ready state.
 */
export const useMap = (mapContainerRef, mapStyle, mapCentre, mapZoom, extraCopyrightText) => {
  const [map, setMap] = useState(null);
  const [isMapStyleLoaded, setIsMapStyleLoaded] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const isMapReady = isMapLoaded && isMapStyleLoaded;
  const belowBarRef = useRef(null);

  useEffect(() => {
    /**
     * Initializes the MapLibre map instance.
     */
    const initializeMap = () => {
      const mql = window.matchMedia('(max-width: 900px)');
      const isMobile = mql.matches;

      const container = mapContainerRef.current;
      if (!container) return;

      let stack = container.parentElement;

      if (isMobile) {
        if (!stack || !stack.classList.contains('map-stack')) {
          const wrapper = document.createElement('div');
          wrapper.className = 'map-stack';
          const parent = container.parentElement;
          parent.insertBefore(wrapper, container); 
          wrapper.appendChild(container);            
          stack = wrapper;
        }

        // map needs an explicit height on mobile
        if (!container.style.height) {
          container.style.height = '56vh';
          container.style.minHeight = '320px';
        }
        container.style.width = '100%';
      }

      const mapInstance = new maplibregl.Map({
        container,
        style: mapStyle || defaultMapStyle,
        center: mapCentre || defaultMapCentre,
        zoom: mapZoom != null ? mapZoom : defaultMapZoom,
        // maxZoom: 15,
        // maxBounds: [
        //   [ -10.76418, 49.528423 ],
        //   [ 1.9134116, 61.331151 ]
        // ],
        attributionControl: false,
        fadeDuration: 0,
        refreshExpiredTiles: false,
        maxTileCacheSize: 500,
        transformRequest: (url, resourceType) => {
          if( resourceType !== 'Style' && url.startsWith('https://api.os.uk') ) {
              url = new URL(url);
              if(! url.searchParams.has('key') ) url.searchParams.append('key', import.meta.env.VITE_MAP_API_TOKEN);
              if(! url.searchParams.has('srs') ) url.searchParams.append('srs', 3857);
              return {
                  url: new Request(url).url
              }
          }
      }
      })
        .on("style.load", () => setIsMapStyleLoaded(true))
        .on("load", () => {
          setIsMapLoaded(true);
        });

      const nav = new maplibregl.NavigationControl({ showZoom: true, showCompass: true });
      const attrib = new maplibregl.AttributionControl({
        compact: false,
        customAttribution: `Contains OS data © Crown copyright and database right ${new Date().getFullYear()}${extraCopyrightText ? ` | ${extraCopyrightText}` : ''}`
      });

      mapInstance.addControl(nav, 'bottom-left');
      mapInstance.addControl(attrib, 'bottom-right');
      attrib._container.classList.add('app-attrib');

      let belowBar = belowBarRef.current;
      if (isMobile) {
        if (!belowBar || !belowBar.isConnected) {
          const existing = stack?.querySelector?.('.map-attrib-bar-mobile');
          belowBar = existing || document.createElement('div');
          if (!existing) {
            belowBar.className = 'map-attrib-bar-mobile';
            (stack || container.parentElement).appendChild(belowBar); // immediately under the map
          }
          belowBarRef.current = belowBar;
        }

        const syncAttrib = () => {
          const inner = attrib?._container?.querySelector('.maplibregl-ctrl-attrib-inner');
          belowBar.innerHTML = inner?.innerHTML || '';
        };
        ['load', 'styledata', 'sourcedata'].forEach(ev => mapInstance.on(ev, syncAttrib));
        syncAttrib();

        // after moving/creating wrapper, ensure MapLibre recalculates size
        requestAnimationFrame(() => mapInstance.resize());
      }

      const updateNavOffset = () => {
        const navEl = nav?._container;
        if (!navEl) return;

        if (mql.matches) {
          // attribution overlay is hidden on mobile, so just a small gap
          navEl.style.marginBottom = 'calc(8px + env(safe-area-inset-bottom))';
        } else {
          const pill = attrib?._container;
          const h = pill ? Math.ceil(pill.getBoundingClientRect().height) : 0;
          navEl.style.marginBottom = `calc(${h + 20}px + env(safe-area-inset-bottom))`;
        }
        navEl.style.marginRight = '6px';
        navEl.style.marginLeft  = '6px';
      };

      // initial placement + listen for breakpoint changes
      requestAnimationFrame(updateNavOffset);
      const onMqChange = (e) => {
        requestAnimationFrame(updateNavOffset);
      };
      if (mql.addEventListener) mql.addEventListener('change', onMqChange);
      else mql.addListener(onMqChange); // Safari

      let ro;
      if ('ResizeObserver' in window && attrib?._container) {
        ro = new ResizeObserver(() => updateNavOffset());
        ro.observe(attrib._container);
      }
      // also recompute on viewport changes
      window.addEventListener('resize', updateNavOffset);
      window.addEventListener('orientationchange', updateNavOffset);

      // keep refs for cleanup
      mapInstance.__nav = nav;
      mapInstance.__navMql = mql;
      mapInstance.__navOnChange = onMqChange;

      mapInstance.resize();

      // Adjust map interactions for mobile devices
      if (mql.matches) {
        mapInstance.scrollZoom.disable();      // prevent single-finger zoom
        mapInstance.dragPan.disable();         // prevent single-finger pan
        mapInstance.doubleClickZoom.disable();
        mapInstance.boxZoom.disable();
        mapInstance.keyboard.disable();

        // keep two-finger zoom/pan
        mapInstance.touchZoomRotate.enable();
        mapInstance.touchZoomRotate.disableRotation(); // optional
      }

      if (mql?.removeEventListener) mql.removeEventListener('change', onMqChange);

      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateNavOffset);
      window.removeEventListener('orientationchange', updateNavOffset);

      setMap(mapInstance);
    };

    if (!map) {
      initializeMap();
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
        setIsMapLoaded(false);
        setIsMapStyleLoaded(false);
      }
    };
  }, []);

  // Update map center if mapCentre changes
  useEffect(() => {
    if (map && Array.isArray(mapCentre) && mapCentre.length === 2) {
      map.setCenter(mapCentre);
    }
  }, [map, mapCentre]);

  // Update map zoom if mapZoom changes
  useEffect(() => {
    if (map && mapZoom != null) {
      map.setZoom(mapZoom);
    }
  }, [map, mapZoom]);

  return { map, isMapStyleLoaded, isMapLoaded, isMapReady };
};