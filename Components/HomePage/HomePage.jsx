/**
 * HomePage Component and Helpers
 *
 * This component renders the home page with fragments provided via context.
 * It handles fixed sections plus additional fragments that include content (HTML)
 * and one or more images. When more than one image is provided:
 * • The HTML content is split into smaller blocks that are interleaved with the images.
 * • On wide screens images are rendered to one side of the text (alternating left/right).
 * • On narrow screens, images and content are interleaved vertically.
 */

import React, { useContext, useEffect, useState } from "react";
import parse from "html-react-parser";
import { Footer } from "./Footer";
import { createBlockSections, interweaveContentWithImages } from "./helpers";
import { MAX_IMAGE_HEIGHT, WIDTH_BREAKPOINT, MAX_IMAGES_ALLOWED } from "./constants";
import "./HomePage.styles.css";
import { AppContext } from "contexts";
import { useWindowWidth } from "hooks/useWindowWidth";


/**
 * HomePage Component
 *
 * Renders the main landing page using context values.
 * It displays the header, introduction, fixed sections,
 * additional fragments (with content and images), a contact section,
 * and legal information.
 *
 * The component handles both wide (two-column) and narrower (vertical interleaved)
 * layouts when multiple images are provided in a fragment.
 */
export const HomePage = () => {
  const appContext = useContext(AppContext);
  const { footer, homePageFragments } = appContext;
  const [fragmentsContent, setFragmentsContent] = useState({});
  const windowWidth = useWindowWidth();

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

  // Fixed sections rendered from context (e.g. background, methodology)
  const fixedSections = [];
  if (appContext.background) {
    fixedSections.push({
      key: "background",
      title: "Background",
      content: parse(appContext.background)
    });
  }
  if (appContext.methodology) {
    fixedSections.push({
      key: "methodology",
      title: "Methodology",
      content: parse(appContext.methodology)
    });
  }

  return (
    <>
      <div className="landing">
        {/* Header Section with background image */}
        <div
          className="header-landing"
          style={{ backgroundImage: `url(${appContext.backgroundImage})` }}
        >
          <div className="container">
            <h1 className="header-title">{appContext.title}</h1>
          </div>
        </div>

        {/* Introduction Section */}
        {appContext.introduction && (
          <section className="introduction container-content">
            <h2>About</h2>
            <p className="container-intro">{parse(appContext.introduction)}</p>
          </section>
        )}

        {/* Render Fixed Sections */}
        {fixedSections.map((section, index) => (
          <section
            key={section.key}
            className={`${section.key} ${index % 2 === 0 ? "even-section" : "odd-section"} container-content`}
          >
            <h2>{section.title}</h2>
            <div>{section.content}</div>
          </section>
        ))}

        {/* Additional Fragments */}
        {homePageFragments &&
          Object.keys(fragmentsContent).length > 0 &&
          Object.entries(fragmentsContent).map(([title, content], idx) => {
            const fragment = homePageFragments[title];
            const effectiveIndex = fixedSections.length + idx;
            const alignmentClass = fragment?.alignment || "center";
            const backgroundColor = fragment?.backgroundColor || "";
            const sectionTitle = fragment?.sectionTitle;
            const imagePosition = fragment?.imagePosition || "right";
            // Use provided "images" array if available (limit to MAX_IMAGES_ALLOWED)
            const images =
              fragment.images &&
              Array.isArray(fragment.images) &&
              fragment.images.length
                ? fragment.images.slice(0, MAX_IMAGES_ALLOWED)
                : null;
            // Fallback to a single image if provided.
            const singleImage = !images && fragment.image;

            return (
              <section
                key={title}
                className={`additional-section ${effectiveIndex % 2 === 0 ? "even-section" : "odd-section"} container-content`}
                style={{ backgroundColor }}
              >
                <h2 className={`title-${alignmentClass}`}>{sectionTitle}</h2>

                {images ? (
                  // If more than one image is provided in the array:
                  images.length > 1 ? (
                    // For wide screens, split content into blocks each with text and image side by side.
                    windowWidth >= WIDTH_BREAKPOINT ? (
                      <div className="multiple-blocks">
                        {createBlockSections(content, images).map((block, i) => (
                          <div
                            key={`block-${i}`}
                            className={`alternating-layout-block ${i % 2 === 0 ? "" : "reverse"}`}
                          >
                            <div className="text-block">{block.textSegment}</div>
                            {block.image && (
                              <div className="image-block">
                                <img
                                  src={block.image}
                                  alt={`Image ${i + 1}`}
                                  style={{
                                    width: "100%",
                                    maxHeight: MAX_IMAGE_HEIGHT,
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // For narrow screens, interweave text with images in a single column.
                      <div className="content-wrapper interleaved-content">
                        {interweaveContentWithImages(content, images)}
                      </div>
                    )
                  ) : (
                    // Single image provided in the "images" array (length === 1)
                    <>
                      {singleImage && imagePosition === "left" && (
                        <img
                          src={singleImage}
                          alt={`${sectionTitle} image`}
                          style={{
                            width: "100%",
                            maxHeight: MAX_IMAGE_HEIGHT,
                            objectFit: "cover"
                          }}
                        />
                      )}
                      <div className="container-section">{parse(content)}</div>
                      {singleImage && imagePosition === "right" && (
                        <img
                          src={singleImage}
                          alt={`${sectionTitle} image`}
                          style={{
                            width: "100%",
                            maxHeight: MAX_IMAGE_HEIGHT,
                            objectFit: "cover"
                          }}
                        />
                      )}
                    </>
                  )
                ) : (
                  // Fallback when a single image is provided via fragment.image property.
                  <>
                    {singleImage && imagePosition === "left" && (
                      <img src={singleImage} alt={`${sectionTitle} image`} />
                    )}
                    <div className="container-section">{parse(content)}</div>
                    {singleImage && imagePosition === "right" && (
                      <img src={singleImage} alt={`${sectionTitle} image`} />
                    )}
                  </>
                )}
                {singleImage && imagePosition === "full-width" && (
                  <img src={singleImage} alt={`${sectionTitle} image`} />
                )}
              </section>
            );
          })}

        {/* Contact Section */}
        {appContext.contactText && appContext.contactEmail && (
          <div className="contacts container-content">
            <p>{appContext.contactText}</p>
            <a className="contact" href={`mailto:${appContext.contactEmail}`}>
              {"Email: " + appContext.contactEmail}
            </a>
          </div>
        )}

        {/* Legal Section */}
        {appContext.legalText && (
          <section className="legalText container-content">
            <h2>Legal</h2>
            <div className="container-legalText">{parse(appContext.legalText)}</div>
          </section>
        )}
      </div>

      {/* Footer */}
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