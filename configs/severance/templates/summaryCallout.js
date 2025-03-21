/**
 * Generates a summary callout HTML template for a given zone.
*/

export const severanceSummaryCallout = 
`<h2>Severance index scores based on the presence of {barrierId}</h2>
<p>
  If this area had no <span class="highlight">{barrierId}</span> infrastructure acting as a 
  <span class="highlight">potential active travel barrier</span>, residents in this OA would have 
  <span class="highlight">additional walkable access</span> to {formatNumber(perfect_reach_decile)} {destinationId} (current walkable access: {formatNumber(isochrone_reach_decile)} {destinationId}) 
</p>`
;
