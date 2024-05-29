import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import styled from "styled-components";

import { AppContext } from "contexts";

const StyledLogout = styled.img`
position : absolute;
right : 25px;
bottom : 100px;
`;

export function LateralNavbar(props) {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const appContext = useContext(AppContext); 

  const handleClick = () => { 
    props.onClick()
  }

  useEffect(() => {
    setActiveLink(location.pathname)
  }, [location])

  return (
    <div className={props.className}>
      {props.className === "sideNavbar-shown" && <Link className={activeLink === "/" ? "ActiveLatButton" : "LatButton"} to={"/"} onClick={setActiveLink}>
        Home
      </Link>}
      {props.className === "sideNavbar-shown" && appContext.appPages.map((page) => (
            <Link key={page.pageName} className={activeLink===page.url ? "ActiveLatButton" : "LatButton"} to={page.url} >
              {page.pageName}
            </Link>
      ))}
      <div>
        <StyledLogout src="/img/logout.png" onClick={handleClick}/>
      </div>
    </div>
  );
}
