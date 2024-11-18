/**
 * Generates a detailed callout HTML template for a given region.
 * @param {string} region - The region identifier (e.g., 'CA', 'LA', 'England').
 * @returns {string} - The HTML template with placeholders for the specified region.
 */
function generateDetailedCallout(region) {
    const rankPrefix = {
      CA: 'ca',
      LA: 'la',
      England: 'eng'
    }[region];
  
    return `
      <h2>{feature_name}</h2>
      <p><strong>Population:</strong> {formatNumber(population)}</p>
      <p><strong>TRSE Percentile:</strong> {formatNumber(${rankPrefix}_trse_rank)}</p>
  
      <details>
        <summary><strong>Vulnerability Percentile:</strong> {formatNumber(${rankPrefix}_vul_rank)}</summary>
        <p><strong>Disability and Caring Percentile:</strong> {formatNumber(${rankPrefix}_vul1_rank)}</p>
        <p><strong>Childcare and Young People Percentile:</strong> {formatNumber(${rankPrefix}_vul2_rank)}</p>
        <p><strong>Low Income and Poverty Percentile:</strong> {formatNumber(${rankPrefix}_vul3_rank)}</p>
      </details>
  
      <details>
        <summary><strong>Access Percentile:</strong> {formatNumber(${rankPrefix}_acc_rank)}</summary>
        <p><strong>Work Access Percentile:</strong> {formatNumber(${rankPrefix}_acc1_rank)}</p>
        <p><strong>Education Access Percentile:</strong> {formatNumber(${rankPrefix}_acc2_rank)}</p>
        <p><strong>Health Access Percentile:</strong> {formatNumber(${rankPrefix}_acc3_rank)}</p>
        <p><strong>Amenities Access Percentile:</strong> {formatNumber(${rankPrefix}_acc4_rank)}</p>
      </details>
    `;
  }
  
  // Export specific implementations
  export const oaCaDetailedCallout = generateDetailedCallout('CA');
  export const oaLaDetailedCallout = generateDetailedCallout('LA');
  export const oaEngDetailedCallout = generateDetailedCallout('England');
  
  /**
   * @fileoverview This module provides functions to generate detailed callout HTML templates
   * for different regions, including CA, LA, and England.
   */