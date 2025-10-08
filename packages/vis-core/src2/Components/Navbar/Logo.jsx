import React from "react";
import styled from "styled-components";

/**
 * Styled container for the logo.
 */
const LogoContainer = styled.div`
  width: 192px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: ${({ $position }) =>
    $position === "left" ? "flex-start" : "flex-end"};
  @media only screen and (min-width: 768px) {
    padding: 0 1rem;
    cursor: ${({ $hasImage }) => ($hasImage ? "pointer" : "default")};
    margin-left: ${({ $position }) => ($position === "left" ? "0" : "auto")};
  }
  @media only screen and (max-width: 767px) {
    position: relative;
    margin: 0 auto;
    left: 0;
    right: 0;
  }
`;

/**
 * Styled image element for the logo.
 */
const LogoImage = styled.img`
  min-width: 192px;
  max-width: 100%;
  max-height: 100%;
`;

/**
 * Renders a logo component.
 * @param {Object} param0 - The properties for the Logo component.
 * @property {Function} onClick - The function to handle click events.
 * @property {string} logoImage - The URL of the logo image.
 * @property {string} position - The position of the logo ('left' or 'right').
 * @returns {JSX.Element} The rendered Logo component.
 */
export function Logo({ onClick, logoImage, position }) {
  const handleClick = () => onClick && onClick();

  return (
    <LogoContainer onClick={handleClick} $position={position} $hasImage={!!logoImage}>
      {logoImage && <LogoImage src={logoImage} alt="Logo" />}
    </LogoContainer>
  );
}
