import React from "react";
import styled from "styled-components";
import { MapLayout, IFrameEmbedPage, DynamicForm, TableLayout } from "Components";
import { FilterProvider, MapProvider, PageContext } from "contexts";

const FormPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
  max-width: 720px;
  margin: 0 auto;
`;

const FormPageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #222;
  margin: 0 0 8px 0;
`;

const FormPageDescription = styled.p`
  font-size: 1rem;
  color: #555;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;
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
          default:
            return <div>Nothing</div>;
        }
      })()}
    </PageContext.Provider>
  );
};
