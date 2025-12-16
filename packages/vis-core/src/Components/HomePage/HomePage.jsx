/**
 * HomePage Component and Helpers
 *
 * This component renders the home page with fragments provided via context.
 * It handles fixed sections plus additional fragments that include content (HTML)
 * and one or more images. When more than one image is provided:
 * • The HTML content is split into smaller blocks that are interleaved with the images.
 * • On wide screens images are rendered to one side of the text (alternating left/right).
 * • On narrow screens, images and content are interleaved vertically.
 *
 * Supports placeholders in HTML fragments.
 * For example:
 *   <span data-placeholder="modelled_date">Loading...</span>
 * If the fragment defines an "apiConfig", the component will fetch additional data
 * and replace any placeholders based on the mapping configuration provided.
 *
 * Also note that if the fetched api url is relative (i.e. starts with '/api/'),
 * then the call is delegated to our baseService. Otherwise, a normal fetch call is used.
 */
import React, { useContext, useEffect, useState } from "react";
import parse from "html-react-parser";
import { Footer } from "./Footer";
import { 
  createBlockSections,
  interweaveContentWithImages,
  processFragmentContent
} from "./helpers";
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
  // Changed fragmentsContent to be an array that corresponds to homePageFragments order.
  const [fragmentsContent, setFragmentsContent] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const windowWidth = useWindowWidth();
  const MOBILE_BREAKPOINT = 948;
  /**
   * Fetches content for each fragment defined in homePageFragments.
   * If a fragment has a URL, it fetches the content from the URL.
   * If a fragment has inline content, it uses that content directly.
   * If a fragment defines an API configuration, it additionally fetches data
   * to replace any placeholders in the content.
   */
  useEffect(() => {
    const fetchFragments = async () => {
      const contentArray = [];
      if (homePageFragments && Array.isArray(homePageFragments)) {
        for (let i = 0; i < homePageFragments.length; i++) {
          const fragment = homePageFragments[i];
          let content = "";
          // Fetch content from URL if provided, else use inline content.
          if (fragment.url) {
            try {
              const response = await fetch(fragment.url);
              content = await response.text();
            } catch (error) {
              console.error(`Failed to fetch content for fragment at index ${i}:`, error);
              content = "";
            }
          } else if (fragment.content) {
            content = fragment.content;
          }
          // Process any placeholders if apiConfig is provided.
          content = await processFragmentContent(fragment, content);
          contentArray.push(content);
        }
      }
      setFragmentsContent(contentArray);
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
  if (appContext.additionalImage) {
    fixedSections.push({
      key: "additionalImage",
      title: "",
      content: <img className="additional-image" src={appContext.additionalImage} alt="Additional Image" />
    });
  }

  return (
    <>
      <div className="landing selectable-text">
        {/* Header Section with background image */}
        <div
          data-testid="background-img"
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
            <div className="container-intro">{parse(appContext.introduction)}</div>
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

        <div className="homepage-grid">
          {/* Additional Fragments */}
          {homePageFragments &&
            Array.isArray(homePageFragments) &&
            fragmentsContent.length === homePageFragments.length &&
            homePageFragments.map((fragment, idx) => {
              const content = fragmentsContent[idx];
              const effectiveIndex = fixedSections.length + idx;
              const alignmentClass = fragment.alignment || "center";
              const backgroundColor = fragment.backgroundColor || "";
              const sectionTitle = fragment.sectionTitle;
              const imagePosition = fragment.imagePosition || "right";
              // Use provided "images" array if available (limit to MAX_IMAGES_ALLOWED)
              const images =
                fragment.images &&
                Array.isArray(fragment.images) &&
                fragment.images.length
                  ? fragment.images.slice(0, MAX_IMAGES_ALLOWED)
                  : null;
              // Fallback to a single image if provided.
              const singleImage = !images && fragment.image;
              const mapUrl = fragment.mapUrl; 
              const isExpanded = expandedIndex === idx;

              const showInlineExpanded = windowWidth < MOBILE_BREAKPOINT;

              return (
                <React.Fragment key={idx}>
                <section
                  className={`additional-section ${
                    effectiveIndex % 2 === 0 ? "even-section" : "odd-section"
                  } container-content tile`}
                  style={{ backgroundColor }}
                >

                  {singleImage && (
                    <img
                      src={singleImage}
                      alt={`${sectionTitle} image`}
                      className="tile-top-image"
                    />
                  )}
                  <div className="tile-section">
                    <h2 className={`title-${alignmentClass}`}>{sectionTitle}</h2>

                    <div className="tile-body">
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
                                <div className="text-block">
                                    <div className="container-section collapsed">{block.textSegment}</div>
                                </div>
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
                            <div className="container-section collapsed">
                              {interweaveContentWithImages(content, images)}
                              </div>
                          </div>
                        )
                      ) : (
                    
                        <>
                          <div className="container-section collapsed">{parse(content)}</div>
                        </>
                      )
                    ) : (
                      
                      <>
                        <div className="container-section collapsed">{parse(content)}</div>
                      </>
                    )}
                    </div>
                    <div className="tile-footer">
                      {mapUrl && (
                        <a href={mapUrl} target="_blank" className="go-to-map">
                          Go to Dashboard
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                      type="button"
                      className={`read-more-toggle ${isExpanded ? "expanded" : ""}`}
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      aria-label="Toggle description"
                    >
                      <span className="arrow-icon"></span>
                  </button>
                </section>

                {/* On tablet/mobile, show expanded block directly under this card */}
                {showInlineExpanded && isExpanded && (
                  <section className="expanded-fragment-block">
                    <div className="expanded-fragment-content">
                      {parse(content)}
                    </div>
                  </section>
                )}
                </React.Fragment>
              );
            })}
        </div>

        {windowWidth >= MOBILE_BREAKPOINT && expandedIndex !== null && (
          <section className="expanded-fragment-block">
            <div className="expanded-fragment-content">
              {parse(fragmentsContent[expandedIndex])}
            </div>
          </section>
        )}

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