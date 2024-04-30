import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import { AppContext } from "contexts";

export function LateralNavbar(props) {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const appContext = useContext(AppContext); 

  useEffect(() => {
    setActiveLink(location.pathname)
  }, [location])

  return (
    <div className={props.className}>
      <Link className={activeLink==="/" ? "ActiveLatButton" : "LatButton"} to={"/"} onClick={setActiveLink}>
        Home
      </Link>
      {appContext.appPages.map((page) => (
            <Link key={page.pageName} className={activeLink===page.url ? "ActiveLatButton" : "LatButton"} to={page.url} >
              {page.pageName}
            </Link>
        ))}
    </div>
  );
}
