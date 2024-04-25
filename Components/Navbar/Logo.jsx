import styled from "styled-components"; // Ensure styled-components is imported

const LogoImage = styled.img`
  width: auto;
  max-width: 192px;
  max-height: 192px;
  position: absolute;
  right: 1%;
`;

export function Logo() {
  return <LogoImage src={'/img/tfn-logo-fullsize.png'} alt="Logo" />;
}
