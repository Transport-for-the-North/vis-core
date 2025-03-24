/**
 * Generates a detailed callout HTML template for a given zone.
 */

 export const severanceCallout = `
  <h2>{oa21_cd} ({lsoa21_nm})</h2>
  <div class="card-container">
    <div class="card">
      <div class="label">Population</div>
      <div class="value">{formatNumber(population_census_2021)}</div>
    </div>
    <div class="card">
      <div class="label">Severance Risk Decile</div>
      <div class="value">{formatNumber(overall_decile_risk)}</div>
    </div>
    <div class="card">
    <div class="label">Severance Risk String</div>
    <div class="value">{formatNumber(overall_decile_string)}</div>
    </div>
    <div>
      <h2>Severance index scores based on the presence of {barrier_name}</h2>
      <p>
        If this area had no <span class="highlight">{barrier_name}</span> infrastructure acting as a 
        <span class="highlight">potential active travel barrier</span>, residents in this OA would have 
        <span class="highlight">additional walkable access</span> to 
        {formatNumber(perfect_reach_decile)} <span class="highlight">{destination_name} destinations</span> 
        (current walkable access: {formatNumber(isochrone_reach_decile)}) 
      </p>
    </div>
  </div>
`;
