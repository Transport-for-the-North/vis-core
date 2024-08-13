import React from "react";
import { MapLayout } from "Components";
import { FilterProvider, MapProvider, PageContext } from "contexts";

/**
 * PageSwitch component dynamically renders different page layouts based on the provided page configuration.
 * It switches between different page types and renders the corresponding components.
 * @component
 * @param {object} pageConfig - The configuration object for the page, containing information about the type of page to render.
 * @property {string} pageConfig.type - The type of page layout to render.
 * @returns {JSX.Element} The rendered PageSwitch component.
 */
export const PageSwitch = ({ pageConfig }) => {
  return (
    <PageContext.Provider value={pageConfig}>
      {(() => {
        switch (pageConfig.type) {
          case "DualMapLayout":
          case "MapLayout":
            return (
              <FilterProvider>
                <MapProvider>
                  <MapLayout />
                </MapProvider>
              </FilterProvider>
            );
          default:
            return <div>Nothing</div>;
        }
      })()}
    </PageContext.Provider>
  );
};
