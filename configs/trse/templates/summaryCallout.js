import { replacePlaceholders } from "utils";

const baseSummaryCallout = `<h2>{zone_name} TRSE Risk Summary</h2>
<p>
  In {zone_name}, <span class="highlight">{high_risk_pop}</span> residents <span class="highlight">({high_risk_perc}%)</span> live in neighbourhoods with a nationally high risk of TRSE. 
</p>
<p>
    This area ranks <span class="highlight">{high_risk_rank} out of {zone_count}</span> {authorityType} for the overall level of TRSE risk.
</p>`

export const caSummaryCallout = replacePlaceholders(baseSummaryCallout, { authorityType: 'Combined Authorities' });
export const ladSummaryCallout = replacePlaceholders(baseSummaryCallout, { authorityType: 'Local Authorities' });