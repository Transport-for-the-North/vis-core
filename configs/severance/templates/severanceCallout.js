/**
 * Generates a detailed callout HTML template for a given zone.
 * @returns {string} - The HTML template with placeholders for the specified zone.
 */
export function generateDetailedCallout() {

  return `
    <h2>{feature_name}</h2>
    <div class="card-container">
      <div class="card">
        <div class="label">Population</div>
        <div class="value">{formatNumber(population_census_2021)}</div>
      </div>
      <div class="card">
        <div class="label">Overall Decile Risk</div>
        <div class="value">{formatNumber(overall_decile_risk)}</div>
      </div>
      <div class="card">
        <div class="label">Isochrone Reach Decile</div>
        <div class="value">{formatNumber(isochrone_reach_decile)}</div>
      </div>
      <div class="card">
        <div class="label">Perfect Reach Decile</div>
        <div class="value">{formatNumber(perfect_reach_decile)}</div>
      </div>
      <div class="card">
        <div class="label">Severed Reach Decile</div>
        <div class="value">{formatNumber(severed_area_decile)}</div>
      </div>
    </div>
    `;
}

// Export specific implementations
export default generateDetailedCallout;

/**
 * @fileoverview This module provides functions to generate detailed callout HTML templates
 * for severance
 */
