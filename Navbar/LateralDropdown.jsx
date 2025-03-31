import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  font-family: var(--standardFontFamily);
  width: 100%;
  font-size: larger;
  text-decoration: 0;
  text-align: center;
  cursor: pointer;
  padding: 1vh 0;
  margin: 3vh 0;
  font-weight: bold;
`;

const DropdownMenu = styled.div`
  display: ${(props) => (props.open ? "block" : "none")};
  background-color: #f1f1f1;
  width: 100%;
`;

const DropdownItem = styled(Link)`
  width: 100%;
  text-decoration: none;
  display: block;
  font-size: large;
  border-radius: 2px;
  padding: 1vh 0;
  margin: 0;
  font-weight: normal;
`;

const AccordionIcon = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-right: 2px solid #333;
  border-bottom: 2px solid #333;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(45deg)" : "rotate(-45deg)")};
  transition: transform 0.3s ease;
`;

export function LateralDropdown(props) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClick = () => {};

  return (
    <DropdownContainer className="LatButton" onClick={handleToggle}>
      <span
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
          marginBottom: open ? "3vh" : "0",
          alignItems: "center",
        }}
      >
        {props.dropdownName}
        <AccordionIcon $isOpen={open} />
      </span>
      <DropdownMenu open={open}>
        {props.dropdownItems.map((page) => (
          <DropdownItem
            key={page.pageName}
            className={
              props.activeLink === page.url ? "ActiveLatButton" : "LatButton"
            }
            to={page.url}
            onClick={handleClick}
          >
            {page.pageName}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
}
