// Centralized tooltip helpers to keep Map and DualMaps lean
// NOTE: Keep templates minimal and consistent with existing CSS classes

/**
 * Build the default tooltip HTML (title/value/metadata-section wrapper) used by maps.
 * Returns empty string if nothing to render.
 */
export function buildDefaultTooltip({
  featureName,
  featureValueDisplay,
  legendText,
  metadataHtml = "",
}) {
  const hasValue = featureValueDisplay !== undefined && featureValueDisplay !== null && featureValueDisplay !== "";
  const hasName = !!featureName;

  if (!hasName && !hasValue && !metadataHtml) return "";

  // Minimal structure; match existing classes exactly
  if (hasName && hasValue) {
    return `
      <div class="popup-content">
        <p class="feature-name">${featureName}</p>
        <hr class="divider">
        <div class="metadata-item">
          <span class="metadata-key">Value:</span>
          <span class="metadata-value">${featureValueDisplay} ${legendText ?? ""}</span>
        </div>
        ${metadataHtml}
      </div>`;
  }

  if (hasName) {
    return `
      <div class="popup-content">
        <p class="feature-name">${featureName}</p>
        ${metadataHtml}
      </div>`;
  }

  // Value only case (rare)
  if (hasValue) {
    return `
      <div class="popup-content">
        <div class="metadata-item">
          <span class="metadata-key">Value:</span>
          <span class="metadata-value">${featureValueDisplay} ${legendText ?? ""}</span>
        </div>
        ${metadataHtml}
      </div>`;
  }

  return "";
}

/**
 * Build a simple loading tooltip block.
 */
export function buildLoadingTooltip(featureName = "") {
  return `
    <div class="popup-content">
      ${featureName ? `<p class="feature-name">${featureName}</p>` : ""}
      <p>Loading data...</p>
    </div>`;
}

/**
 * Build a simple error tooltip block.
 */
export function buildErrorTooltip(featureName = "") {
  return `
    <div class="popup-content">
      ${featureName ? `<p class="feature-name">${featureName}</p>` : ""}
      <p>Data unavailable.</p>
    </div>`;
}

/**
 * Build a loading section that can be inserted into existing tooltip content.
 */
export function buildLoadingSection() {
  return `<p>Loading data...</p>`;
}

/**
 * Insert custom HTML into a default tooltip's HTML string between title and value.
 * - If there's a loading section (from buildLoadingSection), replace it with the custom content.
 * - If the standard divider exists, insert before it, prefixed with a divider.
 * - Else, insert after the title paragraph, prefixed with a divider.
 * - Else, append just before the closing container, or at end.
 */
export function insertCustomIntoDefault(defaultHtml, customHtml) {
  if (!defaultHtml) return customHtml;
  
  // Check if there's a loading section to replace
  const loadingPattern = buildLoadingSection();
  const loadingIdx = defaultHtml.indexOf(loadingPattern);
  if (loadingIdx !== -1) {
    // Replace the loading section with custom content, adding divider after custom content
    return defaultHtml.slice(0, loadingIdx) + customHtml + '<hr class="divider">' + defaultHtml.slice(loadingIdx + loadingPattern.length);
  }
  
  const dividerTag = '<hr class="divider">';
  const dividerIdx = defaultHtml.indexOf(dividerTag);
  if (dividerIdx !== -1) {
    return defaultHtml.slice(0, dividerIdx) + dividerTag + customHtml + defaultHtml.slice(dividerIdx + dividerTag.length);
  }
  const titleClassIdx = defaultHtml.indexOf('class="feature-name"');
  if (titleClassIdx !== -1) {
    const pCloseIdx = defaultHtml.indexOf('</p>', titleClassIdx);
    if (pCloseIdx !== -1) {
      const insertionPoint = pCloseIdx + 4;
      return defaultHtml.slice(0, insertionPoint) + dividerTag + customHtml + defaultHtml.slice(insertionPoint);
    }
  }
  const insertAt = defaultHtml.lastIndexOf('</div>');
  if (insertAt !== -1) {
    return defaultHtml.slice(0, insertAt) + customHtml + defaultHtml.slice(insertAt);
  }
  return defaultHtml + customHtml;
}

/**
 * Append loading section to existing tooltip HTML.
 * Inserts loading content before the closing </div> tag.
 */
export function appendLoadingToTooltip(tooltipHtml, loadingHtml) {
  if (!tooltipHtml) return loadingHtml;
  const insertAt = tooltipHtml.lastIndexOf('</div>');
  if (insertAt !== -1) {
    return tooltipHtml.slice(0, insertAt) + loadingHtml + tooltipHtml.slice(insertAt);
  }
  return tooltipHtml + loadingHtml;
}

/**
 * Resolve the effective tooltip request URL (supports dynamic requestUrl fallback to url).
 */
export function resolveTooltipRequestUrl(customTooltip, featureId) {
  if (!customTooltip) return null;
  const { requestUrl, url } = customTooltip;
  const base = requestUrl || url;
  if (!base) return null;
  return base.replace('{id}', featureId);
}
