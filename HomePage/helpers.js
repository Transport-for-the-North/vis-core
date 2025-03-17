import React from "react";
import parse from "html-react-parser";

import { MAX_IMAGE_HEIGHT } from "./constants";

/**
 * interweaveContentWithImages
 *
 * Given an HTML string and an array of image URLs, this helper function:
 * 1. Uses DOMParser to get all top-level elements (paragraphs, lists, etc.)
 * 2. Calculates a segment size (for n images, produces n+1 text segments)
 * 3. Interleaves an <img> element after every segment.
 *
 * @param {string} htmlContent - The raw HTML content (as string)
 * @param {string[]} images - Array of image URLs
 * @returns {Array} An array of React elements, interleaving text blocks and images
 */
export const interweaveContentWithImages = (htmlContent, images) => {
  // Create a DOM document from the content so that all top-level block elements are preserved.
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${htmlContent}</div>`, "text/html");

  // Get all top-level child elements (e.g. paragraphs, ul, etc.)
  const children = Array.from(doc.body.firstElementChild.children);

  // If there are no child elements, simply render the HTML content inside a div.
  if (!children.length) {
    return [<div key="content" dangerouslySetInnerHTML={{ __html: htmlContent }} />];
  }

  const imageCount = images.length;
  // We want (imageCount + 1) segments of text content.
  const segmentSize = Math.ceil(children.length / (imageCount + 1));
  let imageIdx = 0;
  const elements = [];

  // Loop through each block element and interweave images after each segment.
  children.forEach((child, idx) => {
    // Use html-react-parser so that any HTML (including lists) is correctly rendered.
    elements.push(parse(child.outerHTML));
    // After each segment, if there is an image available, insert it.
    if ((idx + 1) % segmentSize === 0 && imageIdx < imageCount) {
      elements.push(
        <img
          key={`img-${imageIdx}`}
          src={images[imageIdx]}
          alt={`Image ${imageIdx + 1}`}
          style={{
            width: "100%",
            maxHeight: MAX_IMAGE_HEIGHT,
            objectFit: "cover",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            margin: "10px 0"
          }}
        />
      );
      imageIdx++;
    }
  });
  return elements;
};

/**
 * createBlockSections
 *
 * This helper function splits the provided HTML content into (images.length + 1)
 * text segments and returns an array of block sections. Each section is paired
 * with an image (if available). On wide screens, each block will be rendered
 * as a row with text on one side and the image on the other.
 *
 * @param {string} htmlContent - The original HTML content as a string.
 * @param {string[]} images - Array of image URLs.
 * @returns {Array} Array of objects with keys:
 *   - textSegment: an array of React elements representing a text block.
 *   - image: the image URL (or null if not available for this block)
 */
export const createBlockSections = (htmlContent, images) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${htmlContent}</div>`, "text/html");

  // Get all top-level child elements (will include paragraphs, lists, etc.)
  const children = Array.from(doc.body.firstElementChild.children);
  const totalSegments = images.length + 1;
  const segmentSize = Math.ceil(children.length / totalSegments);
  const blocks = [];

  for (let i = 0; i < totalSegments; i++) {
    // Slice the array for this segment
    const segmentNodes = children.slice(i * segmentSize, (i + 1) * segmentSize);
    // Map each node to React elements preserving the original HTML
    const textSegment = segmentNodes.map((node, idx) => (
      <React.Fragment key={`segment-${i}-child-${idx}`}>{parse(node.outerHTML)}</React.Fragment>
    ));
    // For every segment except the last one, assign an image if available.
    blocks.push({ textSegment, image: images[i] || null });
  }
  return blocks;
};