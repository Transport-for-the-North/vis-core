import React, { useEffect, useState } from "react";
import styled from "styled-components";

/**
 * Styled container for the logo.
 */
const LogoContainer = styled.div`
  width: 220px;
  min-width: 180px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: ${({ $position }) =>
    $position === "left" ? "flex-start" : "flex-end"};

  @media only screen and (max-width: 1200px) {
    width: 170px;
    min-width: 130px;
    height: 44px;
  }

  @media only screen and (min-width: 768px) {
    padding: 0;
    cursor: ${({ $hasImage }) => ($hasImage ? "pointer" : "default")};
    margin-left: ${({ $position }) => ($position === "left" ? "0" : "auto")};
  }
  @media only screen and (max-width: 767px) {
    width: clamp(110px, 36vw, 160px);
    min-width: 0;
    height: 40px;
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
  width: 100%;
  max-width: 220px;
  max-height: 50px;
  object-fit: contain;

  @media only screen and (max-width: 1200px) {
    max-width: 170px;
    max-height: 44px;
  }

  @media only screen and (max-width: 767px) {
    max-width: 160px;
    max-height: 40px;
  }
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
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [logoImage]);

  const handleClick = () => onClick && onClick();
  const shouldRenderLogo = Boolean(logoImage) && !hasImageError;

  if (!shouldRenderLogo) return null;

  return (
    <LogoContainer onClick={handleClick} $position={position} $hasImage={!!logoImage}>
      <LogoImage src={logoImage} alt="Logo" onError={() => setHasImageError(true)} />
    </LogoContainer>
  );
}
