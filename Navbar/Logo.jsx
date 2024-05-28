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

export function Logo(props) {
  const handleClick = () => {
    props.onClick();
  };
  return (
    <LogoImage
      src={"/img/tfn-logo-fullsize.png"}
      alt="Logo"
      onClick={handleClick}
    />
  );
}
