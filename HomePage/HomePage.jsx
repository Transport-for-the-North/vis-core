import React, { useContext } from "react";
import parse from "html-react-parser";

import "./HomePage.styles.css";
import { AppConfigContext } from 'contexts';

export const HomePage = () => {
  const appConfig = useContext(AppConfigContext);
  
  return (
    <div className="landing">
      <div
        className="header-landing"
        placeholder="Background Image for the header"
      >
        <div className="container">
          <h1 className="header-title">{appConfig.title}</h1>
        </div>
      </div>
      {appConfig.introduction !== "" && (
        <section className="introduction">
          <h2>About this tool</h2>
          <p className="container-intro">{appConfig.introduction}</p>
        </section>
      )}
      {appConfig.background !== "" && (
        <section className="background">
          <h2>Background of the app</h2>
          <p className="container-bg">{parse(appConfig.background)}</p>
        </section>
      )}
      <div className="contacts">
        <p>{appConfig.contactText}</p>
        <a className="contact" href={"mailto:" + appConfig.contactEmail}>
          {"Email "+ appConfig.contactEmail}
        </a>
      </div>
    </div>
  );
};