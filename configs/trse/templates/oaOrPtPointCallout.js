const baseDetailedCallout = `
<h2>{feature_name}</h2>
<p><strong>Population:</strong> {formatNumber(population)}</p>
<p><strong>TRSE Percentile:</strong> {formatNumber(ca_trse_rank)}</p>

<details>
  <summary><strong>Vulnerability Percentile:</strong> {formatNumber(ca_vul_rank)}</summary>
  <p><strong>Disability and Caring Percentile:</strong> {formatNumber(ca_vul1_rank)}</p>
  <p><strong>Childcare and Young People Percentile:</strong> {formatNumber(ca_vul2_rank)}</p>
  <p><strong>Low Income and Poverty Percentile:</strong> {formatNumber(ca_vul3_rank)}</p>
</details>

<details>
  <summary><strong>Access Percentile:</strong> {formatNumber(ca_acc_rank)}</summary>
  <p><strong>Work Access Percentile:</strong> {formatNumber(ca_acc1_rank)}</p>
  <p><strong>Education Access Percentile:</strong> {formatNumber(ca_acc2_rank)}</p>
  <p><strong>Health Access Percentile:</strong> {formatNumber(ca_acc3_rank)}</p>
  <p><strong>Amenities Access Percentile:</strong> {formatNumber(ca_acc4_rank)}</p>
</details>
`

export const oaDetailedCallout = baseDetailedCallout