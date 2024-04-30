import React, { useContext } from "react";
import parse from "html-react-parser";

import "./HomePage.styles.css";
import { AppContext } from 'contexts';

export const HomePage = () => {
  const appContext = useContext(AppContext);
  
  return (
    <div className="landing">
      <div
        className="header-landing"
        placeholder="Background Image for the header"
      >
        <div className="container">
          <h1 className="header-title">{appContext.title}</h1>
        </div>
      </div>
      {appContext.introduction !== "" && (
        <section className="introduction">
          <h2>About this tool</h2>
          <p className="container-intro">{appContext.introduction}</p>
        </section>
      )}
      {appContext.background !== "" && (
        <section className="background">
          <h2>Background of the app</h2>
          <p className="container-bg">{parse(appContext.background)}</p>
        </section>
      )}
      <div className="contacts">
        <p>{appContext.contactText}</p>
        <a className="contact" href={"mailto:" + appContext.contactEmail}>
          {"Email "+ appContext.contactEmail}
        </a>
      </div>
    </div>
  );
};