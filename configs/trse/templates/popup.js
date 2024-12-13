/**
 * Generates a popup content HTML template for a given region.
 * @param {string} region - The region identifier (e.g., 'CA', 'LA', 'England').
 * @returns {string} - The HTML template with placeholders for the specified region.
 */
function generatePopupContent(region) {
  const rankPrefix = {
    CA: "ca",
    LA: "lad",
    England: "eng",
  }[region];

  return `
    <div class="popup-content">
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

/**
 * @fileoverview This module provides functions to generate popup content HTML templates
 * for different regions, including CA, LA, and England.
 */