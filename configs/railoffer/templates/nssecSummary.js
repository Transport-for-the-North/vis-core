export const nssecSummary = `
  <h2>NS-SeC summary for {name}</h2>

  <div class="nssec" style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
    <table style="width:100%; border-collapse:collapse; margin: 8px 0 16px;">
      <thead>
        <tr>
          <th style="text-align:left; border-bottom:1px solid #ddd; padding:8px;">Category</th>
          <th style="text-align:right; border-bottom:1px solid #ddd; padding:8px;">Value</th>
          <th style="text-align:left; border-bottom:1px solid #ddd; padding:8px; width:60%;">Bar (px = value)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:8px;">L1, L2 &amp; L3</td>
          <td style="padding:8px; text-align:right;">{l1_l2_l3}</td>
          <td style="padding:8px;">
            <div style="background:#f1f3f5; height:10px; border-radius:4px;">
              <div style="background:#4e79a7; height:100%; width:{l1_l2_l3}px;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px;">L4, L5 &amp; L6</td>
          <td style="padding:8px; text-align:right;">{l4_l5_l6}</td>
          <td style="padding:8px;">
            <div style="background:#f1f3f5; height:10px; border-radius:4px;">
              <div style="background:#4e79a7; height:100%; width:{l4_l5_l6}px;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px;">L7</td>
          <td style="padding:8px; text-align:right;">{l7}</td>
          <td style="padding:8px;">
            <div style="background:#f1f3f5; height:10px; border-radius:4px;">
              <div style="background:#4e79a7; height:100%; width:{l7}px;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px;">L8 &amp; L9</td>
          <td style="padding:8px; text-align:right;">{l8_l9}</td>
          <td style="padding:8px;">
            <div style="background:#f1f3f5; height:10px; border-radius:4px;">
              <div style="background:#4e79a7; height:100%; width:{l8_l9}px;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px;">L10 &amp; L11</td>
          <td style="padding:8px; text-align:right;">{l10_l11}</td>
          <td style="padding:8px;">
            <div style="background:#f1f3f5; height:10px; border-radius:4px;">
              <div style="background:#4e79a7; height:100%; width:{l10_l11}px;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px;">L12</td>
          <td style="padding:8px; text-align:right;">{l12}</td>
          <td style="padding:8px;">
            <div style="background:#f1f3f5; height:10px; border-radius:4px;">
              <div style="background:#4e79a7; height:100%; width:{l12}px;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px;">L13</td>
          <td style="padding:8px; text-align:right;">{l13}</td>
          <td style="padding:8px;">
            <div style="background:#f1f3f5; height:10px; border-radius:4px;">
              <div style="background:#4e79a7; height:100%; width:{l13}px;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px;">L14</td>
          <td style="padding:8px; text-align:right;">{l14_1_l14_2}</td>
          <td style="padding:8px;">
            <div style="background:#f1f3f5; height:10px; border-radius:4px;">
              <div style="background:#4e79a7; height:100%; width:{l14_1_l14_2}px;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px;">L15</td>
          <td style="padding:8px; text-align:right;">{l15}</td>
          <td style="padding:8px;">
            <div style="background:#f1f3f5; height:10px; border-radius:4px;">
              <div style="background:#4e79a7; height:100%; width:{l15}px;"></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div style="font-weight:600; margin: 16px 0 6px;">Distribution</div>
    <div style="display:grid; grid-template-columns: max-content 1fr max-content; gap:8px 12px; align-items:center;">
      <div>L1–L3</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l1_l2_l3}px;"></div>
      </div>
      <div style="text-align:right;">{l1_l2_l3}</div>

      <div>L4–L6</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l4_l5_l6}px;"></div>
      </div>
      <div style="text-align:right;">{l4_l5_l6}</div>

      <div>L7</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l7}px;"></div>
      </div>
      <div style="text-align:right;">{l7}</div>

      <div>L8–L9</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l8_l9}px;"></div>
      </div>
      <div style="text-align:right;">{l8_l9}</div>

      <div>L10–L11</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l10_l11}px;"></div>
      </div>
      <div style="text-align:right;">{l10_l11}</div>

      <div>L12</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l12}px;"></div>
      </div>
      <div style="text-align:right;">{l12}</div>

      <div>L13</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l13}px;"></div>
      </div>
      <div style="text-align:right;">{l13}</div>

      <div>L14</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l14_1_l14_2}px;"></div>
      </div>
      <div style="text-align:right;">{l14_1_l14_2}</div>

      <div>L15</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l15}px;"></div>
      </div>
      <div style="text-align:right;">{l15}</div>
    </div>
  </div>
`;

// Table-only template
export const nsecTableSummary = `
  <h2>NS-SeC summary for {name}</h2>
  <table style="width:100%; border-collapse:collapse; margin: 8px 0 16px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
    <thead>
      <tr>
        <th style="text-align:left; border-bottom:1px solid #ddd; padding:8px;">Category</th>
        <th style="text-align:right; border-bottom:1px solid #ddd; padding:8px;">Value</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding:8px;">L1, L2 &amp; L3</td><td style="padding:8px; text-align:right;">{l1_l2_l3}</td></tr>
      <tr><td style="padding:8px;">L4, L5 &amp; L6</td><td style="padding:8px; text-align:right;">{l4_l5_l6}</td></tr>
      <tr><td style="padding:8px;">L7</td><td style="padding:8px; text-align:right;">{l7}</td></tr>
      <tr><td style="padding:8px;">L8 &amp; L9</td><td style="padding:8px; text-align:right;">{l8_l9}</td></tr>
      <tr><td style="padding:8px;">L10 &amp; L11</td><td style="padding:8px; text-align:right;">{l10_l11}</td></tr>
      <tr><td style="padding:8px;">L12</td><td style="padding:8px; text-align:right;">{l12}</td></tr>
      <tr><td style="padding:8px;">L13</td><td style="padding:8px; text-align:right;">{l13}</td></tr>
      <tr><td style="padding:8px;">L14</td><td style="padding:8px; text-align:right;">{l14_1_l14_2}</td></tr>
      <tr><td style="padding:8px;">L15</td><td style="padding:8px; text-align:right;">{l15}</td></tr>
    </tbody>
  </table>
`;

// Bar-chart-only template (raw px widths)
export const nssecGraphSummary = `
  <h2>NS-SeC distribution for {name}</h2>
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
    <div style="display:grid; grid-template-columns: max-content 1fr max-content; gap:8px 12px; align-items:center;">
      <div>L1–L3</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l1_l2_l3}px;"></div>
      </div>
      <div style="text-align:right;">{l1_l2_l3}</div>

      <div>L4–L6</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l4_l5_l6}px;"></div>
      </div>
      <div style="text-align:right;">{l4_l5_l6}</div>

      <div>L7</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l7}px;"></div>
      </div>
      <div style="text-align:right;">{l7}</div>

      <div>L8–L9</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l8_l9}px;"></div>
      </div>
      <div style="text-align:right;">{l8_l9}</div>

      <div>L10–L11</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l10_l11}px;"></div>
      </div>
      <div style="text-align:right;">{l10_l11}</div>

      <div>L12</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l12}px;"></div>
      </div>
      <div style="text-align:right;">{l12}</div>

      <div>L13</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l13}px;"></div>
      </div>
      <div style="text-align:right;">{l13}</div>

      <div>L14</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l14_1_l14_2}px;"></div>
      </div>
      <div style="text-align:right;">{l14_1_l14_2}</div>

      <div>L15</div>
      <div style="background:#f1f3f5; height:10px; border-radius:4px;">
        <div style="background:#4e79a7; height:100%; width:{l15}px;"></div>
      </div>
      <div style="text-align:right;">{l15}</div>
    </div>
  </div>
`;