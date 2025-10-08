/**
 * Generates a popup content HTML template for a given zone.
 */

export const evciPavementRoadWidthsPopup = `
  <div class="popup-content">
    <p class="summary-text">Suitability of zone:</p>
    <p class="feature-name">{zone_name}</p>
    <hr class="divider">
    <div class="metadata-item">
      <span class="metadata-key">Green rated:</span>
      <span class="metadata-value">{perc_green}%</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-key">Amber rated:</span>
      <span class="metadata-value">{perc_amber}%</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-key">Red rated:</span>
      <span class="metadata-value">{perc_red}%</span>
    </div>
    <p>Colouring of the map is based on the green rated %</p>
  </div>
`;
