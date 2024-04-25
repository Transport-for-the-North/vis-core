/*
This component returns a page component corresponding to the correct component type for the
provided page.
*/
import React from "react";
import { MapLayout } from "Components";
import { PageConfigContext } from "contexts";

export const PageSwitch = ({ pageConfig }) => {
  return (
    <PageConfigContext.Provider value={pageConfig}>
      {(() => {
        switch (pageConfig.type) {
          case "MapLayout":
            return <MapLayout />;
          default:
            return <div>Nothing</div>;
        }
      })()}
    </PageConfigContext.Provider>
  );
};
