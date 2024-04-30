/*
This component returns a page component corresponding to the correct component type for the
provided page.
*/
import React from "react";
import { MapLayout } from "Components";
import { MapProvider, PageContext } from "contexts";

export const PageSwitch = ({ pageConfig }) => {
  return (
    <PageContext.Provider value={pageConfig}>
      {(() => {
        switch (pageConfig.type) {
          case "MapLayout":
            return (
              <MapProvider>
                <MapLayout />
              </MapProvider>
            );
          default:
            return <div>Nothing</div>;
        }
      })()}
    </PageContext.Provider>
  );
};
