/**
 * Generates a popup content HTML template for a given zone.
 * @returns {string} - The HTML template with placeholders for the specified zone.
 */
export function generatePopupContent() {

  return `
    <div class="popup-content">
      <p class="summary-text">Severence of zone:</p>
      <p class="feature-name">{feature_name}</p>
      <hr class="divider">
      <div class="metadata-item">
        <span class="metadata-key">Population:</span>
        <span class="metadata-value">{Population}%</span>
      </div>
      <div class="metadata-item">
        <span class="metadata-key">Overall Decile Risk:</span>
        <span class="metadata-value">{overall_decile_risk}%</span>
      </div>
    </div>
  `;
}

// Export specific implementations
export default generatePopupContent;

/**
 * @fileoverview This module provides functions to generate popup content HTML templates
 * for different zones.
 */