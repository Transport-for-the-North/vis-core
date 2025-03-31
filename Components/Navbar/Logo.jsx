import styled from "styled-components"; // Ensure styled-components is imported 

const LogoContainer = styled.div`
  width: 192px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.position === 'left' ? 'flex-start' : 'flex-end')};

  @media only screen and (min-width: 766px) {
    padding: 0rem 1rem;
    cursor: pointer;
    margin-left: ${(props) => (props.position === 'left' ? '0' : 'auto')}; /* Pushes the logo to the right or left based on position */
  }

  @media only screen and (max-width: 765px) {
    position: absolute;
    ${(props) => (props.position === 'left' ? 'left: 0;' : 'right: 0;')} /* Ensure the logo is at the edge based on position */
  }
`;

const LogoImage = styled.img`
  min-width: 192px;
  max-width: 100%;
  max-height: 100%;
`;

/**
 * Renders a logo component.
 * @param {Object} props - The props for the Logo component.
 * @property {Function} props.onClick - The function to handle click events.
 * @property {string} props.logoImage - The URL of the logo image.
 * @property {string} props.position - The position of the logo ('left' or 'right').
 * @returns {JSX.Element} The rendered Logo component.
 */
export function Logo(props) {
  const handleClick = () => {
    props.onClick();
  };

  return (
    <LogoContainer onClick={handleClick} position={props.position}>
      {props.logoImage && <LogoImage src={props.logoImage} alt="Logo" />}
    </LogoContainer>
  );
}
