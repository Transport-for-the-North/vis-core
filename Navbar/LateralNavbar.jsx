import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { LateralDropdown } from "./LateralDropdown";
import styled from "styled-components";

import { AppContext } from "contexts";

const StyledLogout = styled.img`
`;

export function LateralNavbar(props) {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const [scrollable, setScrollable] = useState(false);
  const listCategories = [];
  const appContext = useContext(AppContext);

  const handleClick = () => {
    props.onClick();
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  useEffect(() => {
    const calulateOverflow = () => {
      const elements = document.querySelector(".sideNavbar-shown")?.children;
      if (elements) {
        let totalHeight = 0;
        for (let i = 0; i < elements.length; i++) {
          totalHeight += elements[i].offsetHeight;
        }
        if (
          totalHeight + 280 >
          document.querySelector(".sideNavbar-shown").clientHeight
        ) {
          setScrollable(true);
        } else {
          setScrollable(false);
        }
      }
    };
    document.addEventListener("click", calulateOverflow);

    return () => {
      document.removeEventListener("click", calulateOverflow);
    };
  }, []);

  return (
    <div className={props.className}>
      {props.className === "sideNavbar-shown" && (
        <Link
          className={activeLink === "/" ? "ActiveLatButton" : "LatButton"}
          to={"/"}
          onClick={setActiveLink}
        >
          Home
        </Link>
      )}
      {props.className === "sideNavbar-shown" &&
        appContext.appPages.map((page) => {
          if (page.category === null) {
            return (
              <Link
                key={page.pageName}
                className={
                  activeLink === page.url ? "ActiveLatButton" : "LatButton"
                }
                to={page.url}
              >
                {page.pageName}
              </Link>
            );
          } else if (!listCategories.includes(page.category)) {
            listCategories.push(page.category);
            const dropdownItems = appContext.appPages.filter(
              (pageToTest) => pageToTest.category === page.category
            );
            return (
              <LateralDropdown
                key={page.category}
                dropdownItems={dropdownItems}
                activeLink={activeLink}
                dropdownName={page.category}
              />
            );
          } else {
            return null;
          }
        })}
      <div className={scrollable ? "scrollable" : "notScrollable"}>
        <StyledLogout src="/img/logout.png" onClick={handleClick} />
      </div>
    </div>
  );
}
