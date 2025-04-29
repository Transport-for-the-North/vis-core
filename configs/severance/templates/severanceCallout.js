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
      <div class="label">Severance index</div>
      <div class="value">{convertDecileNumberToString(overall_decile_risk)}</div>
    </div>
    <div class="card">
    <div class="label">Severance risk classification</div>
    <div class="value">{overall_decile_string}</div>
    </div>
  </div>
  <div>
      <p>
        If this area had no <span class="highlight">{barrier_name}</span> infrastructure acting as a 
        potential active travel barrier, residents in this OA would have 
        walkable access to 
        <span class="highlight">{formatReach(perfect_reach_decile)} {destination_name} destinations</span> 
        (current walkable access: <span class="highlight">{formatReach(isochrone_reach_decile)}</span>) 
      </p>
    </div>
`;
