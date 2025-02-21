import React, { useContext, useEffect, useState } from "react";
import parse from "html-react-parser";
import { Footer } from "./Footer";
import "./HomePage.styles.css";
import { AppContext } from "contexts";

/**
 * HomePage component represents the main landing page of the application.
 * It displays information retrieved from the AppContext such as title, introduction,
 * background, contact details, and additional sections defined in homePageFragments.
 *
 * @component
 * @returns {JSX.Element} The JSX element representing the HomePage.
 */
export const HomePage = () => {
  const appContext = useContext(AppContext);
  const { footer, homePageFragments } = appContext;
  const [fragmentsContent, setFragmentsContent] = useState({});

  /**
   * Fetches content for each fragment defined in homePageFragments.
   * If a fragment has a URL, it fetches the content from the URL.
   * If a fragment has inline content, it uses that content directly.
   */
  useEffect(() => {
    const fetchFragments = async () => {
      const content = {};
      if (homePageFragments) {
        for (const [key, fragment] of Object.entries(homePageFragments)) {
          if (fragment.url) {
            try {
              const response = await fetch(fragment.url);
              const data = await response.text();
              content[key] = data;
            } catch (error) {
              console.error(`Failed to fetch content for ${key}:`, error);
            }
          } else if (fragment.content) {
            content[key] = fragment.content;
          }
        }
      }
      setFragmentsContent(content);
    };

    fetchFragments();
  }, [homePageFragments]);

  // Build an array for the fixed sections so we can control the alternating styling.
  const fixedSections = [];
  if (appContext.background !== "") {
    fixedSections.push({
      key: "background",
      title: "Background",
      content: parse(appContext.background),
    });
  }
  if (appContext.methodology !== "") {
    fixedSections.push({
      key: "methodology",
      title: "Methodology",
      content: parse(appContext.methodology),
    });
  }

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

        {/* Introduction Section */}
        {appContext.introduction !== "" && (
          <section className="introduction">
            <h2>About</h2>
            <p className="container-intro">{parse(appContext.introduction)}</p>
          </section>
        )}

        {/* Fixed Sections: Background and Methodology */}
        {fixedSections.map((section, index) => (
          <section
            key={section.key}
            className={`${section.key} ${
              index % 2 === 0 ? "even-section" : "odd-section"
            }`}
          >
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </section>
        ))}

        {/* Additional Fragments */}
        {homePageFragments &&
          Object.keys(fragmentsContent).length > 0 &&
          Object.entries(fragmentsContent).map(([title, content], idx) => {
            // Offset the index based on the number of fixedSections rendered.
            const effectiveIndex = fixedSections.length + idx;
            const alignmentClass =
              homePageFragments[title]?.alignment || "center";
            const backgroundColor =
              homePageFragments[title]?.backgroundColor || "";
            const sectionTitle = homePageFragments[title]?.sectionTitle;
            const image = homePageFragments[title]?.image;
            const imagePosition = homePageFragments[title]?.imagePosition || "right";

            return (
              <section
                key={title}
                className={`additional-section ${
                  effectiveIndex % 2 === 0 ? "even-section" : "odd-section"
                }`}
                style={{ backgroundColor }}
              >
                <h2 className={`title-${alignmentClass}`}>{sectionTitle}</h2>
                <div
                  className={`section-content ${
                    imagePosition === "full-width" ? "full-width" : ""
                  }`}
                >
                  {image && imagePosition === "left" && (
                    <img src={image} alt={`${title} image`} />
                  )}
                  <div className="container-section">{parse(content)}</div>
                  {image && imagePosition === "right" && (
                    <img src={image} alt={`${title} image`} />
                  )}
                </div>
                {image && imagePosition === "full-width" && (
                  <img src={image} alt={`${title} image`} />
                )}
              </section>
            );
          })}

        {/* Contact Section */}
        {appContext.contactText && appContext.contactEmail && (
          <div className="contacts">
            <p>{appContext.contactText}</p>
            <a className="contact" href={`mailto:${appContext.contactEmail}`}>
              {"Email: " + appContext.contactEmail}
            </a>
          </div>
        )}

        {/* Legal Section */}
        {appContext.legalText !== "" && (
          <section className="legalText">
            <h2>Legal</h2>
            <p className="container-legalText">{parse(appContext.legalText)}</p>
          </section>
        )}
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
