import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { PageContext, AppContext } from "contexts";
import { useMapContext } from "hooks";
import { TextSection } from "./Accordion";
import { SelectorSection } from "./Selectors";

const LayerControlEntry = ({ layer }) => {
  const { state } = useMapContext();
  const { map } = state;
  const [visibility, setVisibility] = useState(layer.layout.visibility);
  const [opacity, setOpacity] = useState(layer.paint["fill-opacity"] || 1);

  const toggleVisibility = () => {
    const newVisibility = visibility === "visible" ? "none" : "visible";
    map.setLayoutProperty(layer.id, "visibility", newVisibility);
    setVisibility(newVisibility);
  };

  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    map.setPaintProperty(layer.id, "fill-opacity", newOpacity);
    setOpacity(newOpacity);
  };

  return (
    <div>
      <label>{layer.id}</label>
      <input
        type="checkbox"
        checked={visibility === "visible"}
        onChange={toggleVisibility}
      />
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={opacity}
        onChange={handleOpacityChange}
      />
    </div>
  );
};

// Styled components for the sidebar
const SidebarHeader = styled.h2`
  font-size: 1.2em;
  color: #4b3e91;
  font-weight: bold;
  text-align: left;
  padding-left: 5px;
  color: #333;
  user-select: none;
  background-color: rgba(255, 255, 255, 0);
`;

const SidebarContainer = styled.div`
  width: 300px;
  max-height: calc(100vh - 235px);
  background-color: rgba(240, 240, 240, 0.65);
  padding: 10px;
  overflow-y: auto;
  text-align: left;
  position: fixed;
  left: 10px;
  top: 85px;
  z-index: 1000;
  border-radius: 10px;
  backdrop-filter: blur(8px);
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
`;

export const Sidebar = () => {
  const { state, dispatch } = useMapContext();
  const pageContext = useContext(PageContext);
  const appContext = useContext(AppContext);
  const initializedRef = useRef(false); // Ref to track if initialisation has occurred
  // Destructure visualisations from state
  const { visualisations, map } = state;

  const [layers, setLayers] = useState([]);

  useEffect(() => {
    if (map) {
      const updateLayers = () => {
        const newLayers = map.getStyle().layers;
        setLayers(
          newLayers.filter(
            (layer) =>
              layer.type === "fill" ||
              layer.type === "line" ||
              layer.type === "circle"
          )
        );
      };

      // Update layers on initial load
      updateLayers();

      // Update layers whenever the map style changes
      map.on("styledata", updateLayers);

      // Clean up event listener when component unmounts
      return () => {
        map.off("styledata", updateLayers);
      };
    }
  }, [map]);

  useEffect(() => {
    // Check if visualisations are ready and initialisation has not occurred yet
    if (!initializedRef.current && Object.keys(visualisations).length > 0) {
      // Initialize query params for each filter with a defaultValue
      pageContext.config.filters.forEach((filter) => {
        if (filter.action === "UPDATE_QUERY_PARAMS") {
          let defaultValue;
          if (filter.type === "dropdown") {
            defaultValue = filter.values?.values[0]?.paramValue;
          } else if (filter.type === "slider") {
            defaultValue = filter.min;
          }

          if (defaultValue !== undefined) {
            dispatch({
              type: filter.action,
              payload: { filter, value: defaultValue },
            });
          }
        }
      });
      // Mark initialisation as done
      initializedRef.current = true;
    }
  }, [pageContext.config.filters, dispatch, visualisations]);

  useEffect(() => {
    // Effect to reset initialised when pageContext changes.
    initializedRef.current = false;
  }, [pageContext]);

  const handleFilterChange = (filter, value) => {
    dispatch({
      type: filter.action,
      payload: { filter, value },
    });
  };

  return (
    <SidebarContainer key={pageContext.pageName}>
      <SidebarHeader>
        {pageContext.pageName || "Visualisation Framework"}
      </SidebarHeader>
      <TextSection title="About this visualisation" text="Placeholder" />
      <SelectorSection
        filters={pageContext.config.filters}
        onFilterChange={handleFilterChange}
      />
      {/* <AccordionSection title="Layer Control">
        {layers.map((layer) => (
          <LayerControlEntry key={layer.id} layer={layer} />
        ))}
      </AccordionSection> */}
      <TextSection title="Legal" text={appContext.legalText} />
    </SidebarContainer>
  );
};
