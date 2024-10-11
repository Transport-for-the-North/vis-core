import styled from "styled-components"; // Ensure styled-components is imported

const LogoImage = styled.img`
  width: auto;
  max-width: 192px;
  max-height: 192px;

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

/**
 * Renders a logo component.
 * @param {Object} props - The props for the Logo component.
 * @property {Function} props.onClick - The function to handle click events.
 * @returns {JSX.Element} The rendered Logo component.
 */
export function Logo(props) {
  const handleClick = () => {
    props.onClick();
  };
  return (
    props.logoImage && <LogoImage
      src={props.logoImage}
      alt="Logo"
      onClick={handleClick}
    />
  );
}
