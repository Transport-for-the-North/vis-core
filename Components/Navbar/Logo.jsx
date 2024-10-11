import styled from "styled-components"; // Ensure styled-components is imported

const LogoContainer = styled.div`
  width: 192px;
  height: 192px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (min-width: 766px) {
    padding: 1rem;
    cursor: pointer;
    padding-right: 35px;
  }

  @media only screen and (max-width: 765px) {
    position: absolute;
    right: 3%;
  }
`;

const LogoImage = styled.img`
  width: auto;
  max-width: 100%;
  max-height: 100%;
`;

/**
 * Renders a logo component.
 * @param {Object} props - The props for the Logo component.
 * @property {Function} props.onClick - The function to handle click events.
 * @property {string} props.logoImage - The URL of the logo image.
 * @returns {JSX.Element} The rendered Logo component.
 */
export function Logo(props) {
  const handleClick = () => {
    props.onClick();
  };

  return (
    <LogoContainer onClick={handleClick}>
      {props.logoImage && <LogoImage src={props.logoImage} alt="Logo" />}
    </LogoContainer>
  );
}
