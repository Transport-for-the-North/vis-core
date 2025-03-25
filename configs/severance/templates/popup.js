/**
 * Generates a popup content HTML template for a given zone.
 */

export const severancePopup = `
  <div class="popup-content">
    <p class="summary-text">Severance of zone:</p>
    <p class="feature-name">{lsoa21_nm}</p>
    <hr class="divider">
    <div class="metadata-item">
      <span class="metadata-key">Population:</span>
      <span class="metadata-value">{population_census_2021}</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-key">Overall Decile Risk:</span>
      <span class="metadata-value"> {overall_decile_risk} ({overall_decile_string})</span>
    </div>
  </div>
`;
