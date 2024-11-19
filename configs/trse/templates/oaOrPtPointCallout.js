/**
 * Generates a detailed callout HTML template for a given region.
 * @param {string} region - The region identifier (e.g., 'CA', 'LA', 'England').
 * @returns {string} - The HTML template with placeholders for the specified region.
 */
function generateDetailedCallout(region) {
  const rankPrefix = {
    CA: "ca",
    LA: "la",
    England: "eng",
  }[region];

  return `
    <h2>{feature_name}</h2>
    <div class="card-container">
      <div class="card">
        <div class="value">{formatNumber(population)}</div>
        <div class="label">Population</div>
      </div>
      <div class="card">
        <div class="value">{formatNumber(${rankPrefix}_trse_rank)}</div>
        <div class="label">TRSE Percentile</div>
      </div>
    </div>

    <details>
      <summary><strong>Vulnerability Percentile:</strong> {formatNumber(${rankPrefix}_vul_rank)}</summary>
      <div class="card-container">
        <div class="card">
        <div class="value">{formatNumber(${rankPrefix}_vul1_rank)}</div>
        <div class="label">Disability and Caring Percentile</div>
        </div>
        <div class="card">
        <div class="value">{formatNumber(${rankPrefix}_vul2_rank)}</div>
        <div class="label">Childcare and Young People Percentile</div>
        </div>
        <div class="card">
        <div class="value">{formatNumber(${rankPrefix}_vul3_rank)}</div>
        <div class="label">Low Income and Poverty Percentile</div>
        </div>
      </div>
    </details>

    <details>
      <summary><strong>Access Percentile:</strong> {formatNumber(${rankPrefix}_acc_rank)}</summary>
      <div class="card-container">
        <div class="card">
        <div class="value">{formatNumber(${rankPrefix}_acc1_rank)}</div>
        <div class="label">Work Access Percentile</div>
        </div>
        <div class="card">
        <div class="value">{formatNumber(${rankPrefix}_acc2_rank)}</div>
        <div class="label">Education Access Percentile</div>
        </div>
        <div class="card">
        <div class="value">{formatNumber(${rankPrefix}_acc3_rank)}</div>
        <div class="label">Health Access Percentile</div>
        </div>
        <div class="card">
        <div class="value">{formatNumber(${rankPrefix}_acc4_rank)}</div>
        <div class="label">Amenities Access Percentile</div>
        </div>
      </div>
    </details>
    `;
}

// Export specific implementations
export const oaCaDetailedCallout = generateDetailedCallout("CA");
export const oaLaDetailedCallout = generateDetailedCallout("LA");
export const oaEngDetailedCallout = generateDetailedCallout("England");

/**
 * @fileoverview This module provides functions to generate detailed callout HTML templates
 * for different regions, including CA, LA, and England.
 */
