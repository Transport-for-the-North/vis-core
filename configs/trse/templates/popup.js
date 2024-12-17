/**
 * Generates a popup content HTML template for a given region.
 * @param {string} region - The region identifier (e.g., 'CA', 'LA', 'England').
 * @param {boolean} isPtPoint - Flag indicating if the feature is a ptPoint.
 * @returns {string} - The HTML template with placeholders for the specified region.
 */
function generatePopupContent(region, isPtPoint = false) {
  const rankPrefix = {
    CA: "ca",
    LA: "lad",
    England: "eng",
  }[region];

  const summaryText = isPtPoint
    ? `<p class="summary-text">Summary for the neighbourhoods within 500 metres of</p>`
    : "";

  return `
    <div class="popup-content">
      ${summaryText}
      <p class="feature-name">{feature_name}</p>
      <hr class="divider">
      <div class="metadata-item">
        <span class="metadata-key">TRSE risk percentile:</span>
        <span class="metadata-value">{${rankPrefix}_trse_rank}%</span>
      </div>
      <div class="metadata-item">
        <span class="metadata-key">Accessibility percentile:</span>
        <span class="metadata-value">{${rankPrefix}_acc_rank}%</span>
      </div>
      <div class="metadata-item">
        <span class="metadata-key">Vulnerability percentile:</span>
        <span class="metadata-value">{${rankPrefix}_vul_rank}%</span>
      </div>
    </div>
  `;
}

// Export specific implementations
export const caPopupContent = generatePopupContent("CA");
export const laPopupContent = generatePopupContent("LA");
export const engPopupContent = generatePopupContent("England");

// Export implementations for ptPoints with the additional summary text
export const caPtPopupContent = generatePopupContent("CA", true);
export const laPtPopupContent = generatePopupContent("LA", true);
export const engPtPopupContent = generatePopupContent("England", true);

/**
 * @fileoverview This module provides functions to generate popup content HTML templates
 * for different regions, including CA, LA, and England. It includes an additional summary
 * text for ptPoints features when specified.
 */