import React from "react";
import { MapLayout, IFrameEmbedPage, TableLayout } from "Components";
import { FilterProvider, MapProvider, PageContext } from "contexts";
import { DirectoryScorecardsPage } from "Components";

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
          case "IFrameEmbed":
            return <IFrameEmbedPage config={pageConfig.config} />;
          case "TableLayout":
            return <TableLayout config={pageConfig.config} />;
          case "DirectoryScorecards":
            return (
              <FilterProvider>
                <DirectoryScorecardsPage/>
              </FilterProvider>
            )
            default:
            return <div>Nothing</div>;
        }
      })()}
    </PageContext.Provider>
  );
};
