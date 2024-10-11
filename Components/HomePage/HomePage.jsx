import React, { useContext } from "react";
import parse from "html-react-parser";
import { Footer } from "./Footer";
import "./HomePage.styles.css";
import { AppContext } from "contexts";

/**
 * HomePage component represents the main landing page of the application.
 * It displays information retrieved from the AppContext such as title, introduction, background,
 * and contact details.
 *
 * @component
 * @returns {JSX.Element} The JSX element representing the HomePage.
 */
export const HomePage = () => {
  const appContext = useContext(AppContext);

  const { footer } = appContext;

  return (
    <>
      <div className="landing">
        <div
          className="header-landing"
          style={{
            backgroundImage: `url(${appContext.backgroundImage})`,
          }}
        >
          <div className="container">
            <h1 className="header-title">{appContext.title}</h1>
          </div>
        </div>
        {appContext.introduction !== "" && (
          <section className="introduction">
            <h2>About</h2>
            <p className="container-intro">{parse(appContext.introduction)}</p>
          </section>
        )}
        {appContext.background !== "" && (
          <section className="background">
            <h2>Background</h2>
            <p className="container-bg">{parse(appContext.background)}</p>
          </section>
        )}
        <div className="contacts">
          <p>{appContext.contactText}</p>
          <a className="contact" href={"mailto:" + appContext.contactEmail}>
            {"Email: " + appContext.contactEmail}
          </a>
        </div>
      </div>
      {footer && (
        <Footer
          creditsText={footer.creditsText}
          privacyPolicyLink={footer.privacyPolicyLink}
          cookiesLink={footer.cookiesLink}
          contactUsLink={footer.contactUsLink}
        />
      )}
    </>
  );
};
