import React from "react";
import styled from "styled-components";

/**
 * A container component that centers the iframe within the available viewport height.
 * It adjusts for a header height of 75px.
 */
const IFrameContainer = styled.div`
  width: 100%;
  height: calc(100vh - 75px); /* Adjusts for the header height */
  display: flex;
  justify-content: center;
  align-items: center;
`;

/**
 * A styled iframe component that takes up the full width and height of its container.
 */
const StyledIFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

/**
 * Renders an embedded iframe with the provided URL from the `config` object.
 * If no URL is provided, it shows a message indicating that no URL was provided for embedding.
 *
 * @param {Object} config - The configuration object containing the iframe's URL.
 * @param {string} config.url - The URL to be embedded within the iframe.
 * 
 * @returns {JSX.Element} The rendered iframe component or an error message.
 */
export const IFrameEmbedPage = ({ config }) => {
  // Check if config or URL is missing, return a message if true
  if (!config || !config.url) {
    return <div style={{ padding: "20px", textAlign: "center" }}>No URL provided for embedding.</div>;
  }
  // Return the iframe container with the provided URL
  return (
    <IFrameContainer>
      <StyledIFrame src={config.url} title="Embedded Content" allowFullScreen />
    </IFrameContainer>
  );
};