import React, { useEffect, useState, useContext, useMemo } from "react";
import { FullScreenCalloutCardVisualisation } from "./FullScreenCalloutCardVisualisation";
import { CalloutCardVisualisation } from "./CalloutCardVisualisation";
import { useFetchVisualisationData } from "hooks";
import { MapContext } from "contexts";
import DOMPurify from "dompurify";
import { replacePlaceholders } from "utils";

export const BaseCalloutCardVisualisation = ({
  type = "small",
  visualisationName,
  cardName,
  onUpdate,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { state } = useContext(MapContext);
  const visualisation = state.visualisations[visualisationName];

  // Real
  // const { isLoading, data } = useFetchVisualisationData(visualisation);
  // Mock
  let isLoading = false;
  let data;

  if (type === "fullscreen")
    data = [
      {
        programme_id: 0,
        scenario_id: 12,
        point_geom: {
          type: "Point",
          coordinates: [-1.553621, 53.79969],
        },
        polygon_geom: {
          type: "Polygon",
          coordinates: [
            [
              [-1.554, 53.799],
              [-1.552, 53.799],
              [-1.552, 53.8],
              [-1.554, 53.8],
              [-1.554, 53.799],
            ],
          ],
        },
        image: "https://www.w3schools.com/howto/img_avatar.png",
        label: "Huddersfield College",
        text_with_placeholders:
          "Lorem ipsum dolor sit amet, <strong>{distance}</strong> consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        values: {
          distance: 2,
          duration: 30,
        },
      },
      {
        programme_id: 1,
        scenario_id: 13,
        point_geom: {
          type: "Point",
          coordinates: [-1.56, 53.8],
        },
        polygon_geom: {
          type: "Polygon",
          coordinates: [
            [
              [-1.561, 53.799],
              [-1.559, 53.799],
              [-1.559, 53.801],
              [-1.561, 53.801],
              [-1.561, 53.799],
            ],
          ],
        },
        image: "https://www.w3schools.com/howto/img_avatar2.png",
        label: "Scenario Baseline",
        text_with_placeholders:
          "For this scenario, the distance is <strong>{distance}</strong> kilometres and the journey time is <strong>{duration}</strong> minutes.",
        values: {
          distance: 3,
          duration: 40,
        },
      },
      {
        programme_id: 2,
        scenario_id: 14,
        point_geom: {
          type: "Point",
          coordinates: [-1.57, 53.805],
        },
        polygon_geom: {
          type: "Polygon",
          coordinates: [
            [
              [-1.571, 53.804],
              [-1.569, 53.804],
              [-1.569, 53.806],
              [-1.571, 53.806],
              [-1.571, 53.804],
            ],
          ],
        },
        image: "https://fail",
        label: "Optimistic Future",
        text_with_placeholders:
          "In the optimistic future, the student travels <strong>{distance}</strong> kilometres in just <strong>{duration}</strong> minutes.",
        values: {
          distance: 1,
          duration: 15,
        },
      },
    ];
  else
    data = {
      temperature: 25,
      humidity: 10,
    };

  let includeCarouselNavigation;
  let possibleCarouselNavData;
  if (type === "fullscreen") {
    includeCarouselNavigation = data && data.length > 1;
    possibleCarouselNavData = data
      ? data.map((item) => ({ key: item.scenario_id, value: item.label }))
      : [];
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (isLoading || !data || !isVisible) return null;

  return type === "fullscreen" ? (
    <FullScreenCalloutCardVisualisation
      data={data}
      includeCarouselNavigation={includeCarouselNavigation}
      possibleCarouselNavData={possibleCarouselNavData}
      toggleVisibility={toggleVisibility}
    />
  ) : (
    <CalloutCardVisualisation
      visualisationName={visualisationName}
      cardName={cardName}
      onUpdate={onUpdate}
      data={data}
      isLoading={isLoading}
      toggleVisibility={toggleVisibility}
    />
  );
};
