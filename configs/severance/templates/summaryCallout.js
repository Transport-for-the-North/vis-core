/**
 * Generates a summary callout HTML template for a given zone.
*/

export const severanceSummaryCallout = 
`<h2>Severance index scores based on the presence of {barrier_type}</h2>
<p>
  If this area had no {barrier_type} infrastructure acting as a potential active travel barrier, residents in this OA would have additional walkable access to {formatNumber(perfect_reach_decile)} (current walkable access: {formatNumber(isochrone_reach_decile)}) 
</p>`
;