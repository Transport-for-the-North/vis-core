// Bar chart (vertical) based on max value (single colour). Interactive via hover (title tooltips).
export const nssecBarSummary = `
  <div class="nssec-summary"
       style="
         /* Raw numeric values (no commas / no %) */
         --v1:{l1_l2_l3}; --v2:{l4_l5_l6}; --v3:{l7}; --v4:{l8_l9}; --v5:{l10_l11};
         --v6:{l12}; --v7:{l13}; --v8:{l14_1_l14_2}; --v9:{l15};
         /* max across all values (guard with tiny epsilon to avoid div-by-zero) */
         --maxVal: max(
           max(var(--v1,0), var(--v2,0), var(--v3,0)),
           max(var(--v4,0), var(--v5,0), var(--v6,0)),
           max(var(--v7,0), var(--v8,0), var(--v9,0), 0.00001)
         );
       "
       role="group" aria-labelledby="nssec-summary-title">
    <h2 id="nssec-summary-title">NS-SeC distribution for {name}</h2>

    <div class="nssec-bars" aria-labelledby="nssec-bars-title" style="overflow:hidden;">
      <h3 id="nssec-bars-title" style="margin:6px 0 8px; font-size:1.1.1em; color:#4b3e91;">Bar chart (max‑scaled). Hover bars for values.</h3>

      <div style="
            position: relative;
            height: 190px;
            width: 100%;                   /* fill card width */
            /* unified sizing so bars and labels use identical values */
            --axisLeft: 28px;
            --axisRight: 12px;
            --barsGap: 6px;
            --barsPadLeft: 4px;
            --xArea: 45px;                 /* increased from 30px to accommodate rotated labels */
            padding: 0 0 var(--xArea) 0;   /* reserve for labels */
            border-radius: 0 0 0 2px;
          ">
        <!-- Y grid lines (no numeric labels) -->
        <div aria-hidden="true" style="
              position:absolute; left:var(--axisLeft); right:var(--axisRight); top:8px; bottom:var(--xArea);
              background:
                linear-gradient(to top, rgba(0,0,0,0.06) 1px, transparent 1px) 0 25% / 100% 25% no-repeat,
                linear-gradient(to top, rgba(0,0,0,0.06) 1px, transparent 1px) 0 50% / 100% 50% no-repeat,
                linear-gradient(to top, rgba(0,0,0,0.06) 1px, transparent 1px) 0 75% / 100% 75% no-repeat,
                linear-gradient(to top, rgba(0,0,0,0.06) 1px, transparent 1px) 0 100% / 100% 100% no-repeat;
              pointer-events:none;
              z-index:0;
            "></div>

        <!-- Bars (single colour) -->
        <div style="
              position:absolute; left:var(--axisLeft); right:var(--axisRight); bottom:var(--xArea); top:8px;
              display:grid; grid-template-columns: repeat(9, 1fr); gap:var(--barsGap); align-items:end;
              padding-left:var(--barsPadLeft);  /* slight gap from Y axis */
              padding-bottom:0;                 /* was 2px – remove extra space above X labels */
              z-index:1;
            ">
          <div title="L1–L3: {commify:l1_l2_l3}"
               style="height: calc((var(--v1, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
          <div title="L4–L6: {commify:l4_l5_l6}"
               style="height: calc((var(--v2, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
          <div title="L7: {commify:l7}"
               style="height: calc((var(--v3, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
          <div title="L8–L9: {commify:l8_l9}"
               style="height: calc((var(--v4, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
          <div title="L10–L11: {commify:l10_l11}"
               style="height: calc((var(--v5, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
          <div title="L12: {commify:l12}"
               style="height: calc((var(--v6, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
          <div title="L13: {commify:l13}"
               style="height: calc((var(--v7, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
          <div title="L14: {commify:l14_1_l14_2}"
               style="height: calc((var(--v8, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
          <div title="L15: {commify:l15}"
               style="height: calc((var(--v9, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
        </div>

        <!-- Axes overlay (always on top of bars/grid) -->
        <div aria-hidden="true" style="
              position:absolute; left:var(--axisLeft); right:var(--axisRight); top:8px; bottom:var(--xArea);
              pointer-events:none; z-index:2;
            ">
          <div style="position:absolute; left:0; top:0; bottom:0; width:0; border-left:2px solid #adb5bd;"></div>
          <div style="position:absolute; left:0; right:0; bottom:0; height:0; border-bottom:2px solid #adb5bd;"></div>
        </div>

        <!-- Y-axis tick labels (percent of max) -->
        <div aria-hidden="true" style="
              position:absolute; left:0; top:8px; bottom:var(--xArea);
              display:flex; flex-direction:column; justify-content:space-between;
              font-size:10px; color:#555; text-align:right; padding-right:10px; line-height:1;
              pointer-events:none;
              z-index:3;
            ">
          <div>100%</div>
          <div>75%</div>
          <div>50%</div>
          <div>25%</div>
          <div>0%</div>
        </div>

        <!-- X-axis labels -->
        <div style="
              position:absolute; left:var(--axisLeft); right:var(--axisRight); bottom:-5px;
              display:grid; grid-template-columns: repeat(9, 1fr); gap:var(--barsGap); /* match bars */
              justify-items:center; align-items:start;
              font-size:11px; color:#333; white-space:nowrap;
              line-height:1;
              height: var(--xArea);                   /* same reserved space as plot */
              padding-left:var(--barsPadLeft);        /* match bars */
              z-index:3;
            ">
          <div style="position:relative; width:100%; height:100%;">
            <span style="position:absolute; top:0; right:50%; display:inline-block; transform:rotate(-50deg); transform-origin:100% 0;">L1–L3</span>
          </div>
          <div style="position:relative; width:100%; height:100%;">
            <span style="position:absolute; top:0; right:50%; display:inline-block; transform:rotate(-50deg); transform-origin:100% 0;">L4–L6</span>
          </div>
          <div style="position:relative; width:100%; height:100%;">
            <span style="position:absolute; top:0; right:50%; display:inline-block; transform:rotate(-50deg); transform-origin:100% 0;">L7</span>
          </div>
          <div style="position:relative; width:100%; height:100%;">
            <span style="position:absolute; top:0; right:50%; display:inline-block; transform:rotate(-50deg); transform-origin:100% 0;">L8–L9</span>
          </div>
          <div style="position:relative; width:100%; height:100%;">
            <span style="position:absolute; top:0; right:50%; display:inline-block; transform:rotate(-50deg); transform-origin:100% 0;">L10–L11</span>
          </div>
          <div style="position:relative; width:100%; height:100%;">
            <span style="position:absolute; top:0; right:50%; display:inline-block; transform:rotate(-50deg); transform-origin:100% 0;">L12</span>
          </div>
          <div style="position:relative; width:100%; height:100%;">
            <span style="position:absolute; top:0; right:50%; display:inline-block; transform:rotate(-50deg); transform-origin:100% 0;">L13</span>
          </div>
          <div style="position:relative; width:100%; height:100%;">
            <span style="position:absolute; top:0; right:50%; display:inline-block; transform:rotate(-50deg); transform-origin:100% 0;">L14</span>
          </div>
          <div style="position:relative; width:100%; height:100%;">
            <span style="position:absolute; top:0; right:50%; display:inline-block; transform:rotate(-50deg); transform-origin:100% 0;">L15</span>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// Separate donut pie (interactive legend).
export const nssecPieSummary = `
  <div class="nssec-pie"
       style="
         --v1:{l1_l2_l3}; --v2:{l4_l5_l6}; --v3:{l7}; --v4:{l8_l9}; --v5:{l10_l11};
         --v6:{l12}; --v7:{l13}; --v8:{l14_1_l14_2}; --v9:{l15};
         --total: calc(var(--v1,0) + var(--v2,0) + var(--v3,0) + var(--v4,0) + var(--v5,0) + var(--v6,0) + var(--v7,0) + var(--v8,0) + var(--v9,0));
         --p1: calc(max(var(--v1, 0), 0) / max(var(--total, 0), 0.00001) * 1turn);
         --p2: calc(max(var(--v2, 0), 0) / max(var(--total, 0), 0.00001) * 1turn);
         --p3: calc(max(var(--v3, 0), 0) / max(var(--total, 0), 0.00001) * 1turn);
         --p4: calc(max(var(--v4, 0), 0) / max(var(--total, 0), 0.00001) * 1turn);
         --p5: calc(max(var(--v5, 0), 0) / max(var(--total, 0), 0.00001) * 1turn);
         --p6: calc(max(var(--v6, 0), 0) / max(var(--total, 0), 0.00001) * 1turn);
         --p7: calc(max(var(--v7, 0), 0) / max(var(--total, 0), 0.00001) * 1turn);
         --p8: calc(max(var(--v8, 0), 0) / max(var(--total, 0), 0.00001) * 1turn);
         --p9: calc(max(var(--v9, 0), 0) / max(var(--total, 0), 0.00001) * 1turn);
       "
       role="group" aria-labelledby="nssec-pie-title">
    <h2 id="nssec-pie-title">NS-SeC distribution for {name}</h2>
    <h3 style="margin:0 0 8px; font-size:1.1em; color:#4b3e91;">Hover legend for values</h3>

    <div style="display:flex; gap:20px; align-items:center;">
      <!-- Donut chart (visual only) -->
      <div style="position:relative; width:200px; height:200px; flex-shrink:0;">
        <div aria-label="NS-SeC donut chart"
             role="img"
             style="
               position:absolute; inset:0;
               border-radius: 50%;
               background:
                 conic-gradient(
                   #4e79a7 0 var(--p1),
                   #59a14f var(--p1) calc(var(--p1) + var(--p2)),
                   #9c755f calc(var(--p1) + var(--p2)) calc(var(--p1) + var(--p2) + var(--p3)),
                   #f28e2b calc(var(--p1) + var(--p2) + var(--p3)) calc(var(--p1) + var(--p2) + var(--p3) + var(--p4)),
                   #edc948 calc(var(--p1) + var(--p2) + var(--p3) + var(--p4)) calc(var(--p1) + var(--p2) + var(--p3) + var(--p4) + var(--p5)),
                   #76b7b2 calc(var(--p1) + var(--p2) + var(--p3) + var(--p4) + var(--p5)) calc(var(--p1) + var(--p2) + var(--p3) + var(--p4) + var(--p5) + var(--p6)),
                   #b07aa1 calc(var(--p1) + var(--p2) + var(--p3) + var(--p4) + var(--p5) + var(--p6)) calc(var(--p1) + var(--p2) + var(--p3) + var(--p4) + var(--p5) + var(--p6) + var(--p7)),
                   #e15759 calc(var(--p1) + var(--p2) + var(--p3) + var(--p4) + var(--p5) + var(--p6) + var(--p7)) calc(var(--p1) + var(--p2) + var(--p3) + var(--p4) + var(--p5) + var(--p6) + var(--p7) + var(--p8)),
                   #ff9da7 calc(var(--p1) + var(--p2) + var(--p3) + var(--p4) + var(--p5) + var(--p6) + var(--p7) + var(--p8)) 1turn
                 );
             ">
        </div>
        <!-- Donut hole as separate element -->
        <div style="
             position:absolute; top:50%; left:50%; 
             width:60px; height:60px; 
             margin:-30px 0 0 -30px;
             background:#fff; border-radius:50%;
             border:1px solid rgba(0,0,0,0.1);
           "></div>
      </div>
      
      <!-- Interactive Legend -->
      <div style="flex:1;">
        <div style="display:grid; grid-template-columns: 14px auto; gap:6px 10px; align-items:center; font-size:11px; color:#333;">
          <div style="width:14px; height:14px; background:#4e79a7; border-radius:3px;" title="L1–L3: {commify:l1_l2_l3}"></div><div title="L1–L3: {commify:l1_l2_l3}" style="cursor:help;">L1–L3</div>
          <div style="width:14px; height:14px; background:#59a14f; border-radius:3px;" title="L4–L6: {commify:l4_l5_l6}"></div><div title="L4–L6: {commify:l4_l5_l6}" style="cursor:help;">L4–L6</div>
          <div style="width:14px; height:14px; background:#9c755f; border-radius:3px;" title="L7: {commify:l7}"></div><div title="L7: {commify:l7}" style="cursor:help;">L7</div>
          <div style="width:14px; height:14px; background:#f28e2b; border-radius:3px;" title="L8–L9: {commify:l8_l9}"></div><div title="L8–L9: {commify:l8_l9}" style="cursor:help;">L8–L9</div>
          <div style="width:14px; height:14px; background:#edc948; border-radius:3px;" title="L10–L11: {commify:l10_l11}"></div><div title="L10–L11: {commify:l10_l11}" style="cursor:help;">L10–L11</div>
          <div style="width:14px; height:14px; background:#76b7b2; border-radius:3px;" title="L12: {commify:l12}"></div><div title="L12: {commify:l12}" style="cursor:help;">L12</div>
          <div style="width:14px; height:14px; background:#b07aa1; border-radius:3px;" title="L13: {commify:l13}"></div><div title="L13: {commify:l13}" style="cursor:help;">L13</div>
          <div style="width:14px; height:14px; background:#e15759; border-radius:3px;" title="L14: {commify:l14_1_l14_2}"></div><div title="L14: {commify:l14_1_l14_2}" style="cursor:help;">L14</div>
          <div style="width:14px; height:14px; background:#ff9da7; border-radius:3px;" title="L15: {commify:l15}"></div><div title="L15: {commify:l15}" style="cursor:help;">L15</div>
        </div>
      </div>
    </div>
  </div>
`;

// Table summary - SIMPLIFIED VERSION
export const nssecTableSummary = `
  <div class="nssec-table" role="group" aria-labelledby="nssec-table-title">
    <div style="overflow-x: auto; margin: 10px 0;">
      <table style="
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 6px;
        overflow: hidden;
      ">
        <thead>
          <tr style="background: #4b3e91; color: white;">
            <th style="padding: 8px; text-align: left; font-weight: 600;">Classification</th>
            <th style="padding: 8px; text-align: right; font-weight: 600;">Count</th>
            <th style="padding: 8px; text-align: right; font-weight: 600;">%</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; border-right: 1px solid #eee;">L1–L3: Higher managerial/professional</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:l1_l2_l3}</td>
            <td style="padding: 8px; text-align: right;">{percent:l1_l2_l3}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; border-right: 1px solid #eee;">L4–L6: Lower managerial/professional</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:l4_l5_l6}</td>
            <td style="padding: 8px; text-align: right;">{percent:l4_l5_l6}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; border-right: 1px solid #eee;">L7: Intermediate occupations</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:l7}</td>
            <td style="padding: 8px; text-align: right;">{percent:l7}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; border-right: 1px solid #eee;">L8–L9: Small employers/own account</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:l8_l9}</td>
            <td style="padding: 8px; text-align: right;">{percent:l8_l9}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; border-right: 1px solid #eee;">L10–L11: Lower supervisory/technical</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:l10_l11}</td>
            <td style="padding: 8px; text-align: right;">{percent:l10_l11}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; border-right: 1px solid #eee;">L12: Semi-routine occupations</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:l12}</td>
            <td style="padding: 8px; text-align: right;">{percent:l12}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; border-right: 1px solid #eee;">L13: Routine occupations</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:l13}</td>
            <td style="padding: 8px; text-align: right;">{percent:l13}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; border-right: 1px solid #eee;">L14: Never worked/long-term unemployed</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:l14_1_l14_2}</td>
            <td style="padding: 8px; text-align: right;">{percent:l14_1_l14_2}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-right: 1px solid #eee;">L15: Full-time students</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:l15}</td>
            <td style="padding: 8px; text-align: right;">{percent:l15}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;

// Scatter chart summary
export const nssecScatterSummary = `
  <div class="nssec-scatter"
       style="
         --v1:{l1_l2_l3}; --v2:{l4_l5_l6}; --v3:{l7}; --v4:{l8_l9}; --v5:{l10_l11};
         --v6:{l12}; --v7:{l13}; --v8:{l14_1_l14_2}; --v9:{l15};
         --maxVal: max(
           max(var(--v1,0), var(--v2,0), var(--v3,0)),
           max(var(--v4,0), var(--v5,0), var(--v6,0)),
           max(var(--v7,0), var(--v8,0), var(--v9,0), 1)
         );
       "
       role="group" aria-labelledby="nssec-scatter-title">
    <h2 id="nssec-scatter-title">NS-SeC distribution for {name}</h2>
    <h3 style="margin:0 0 8px; font-size:1.1em; color:#4b3e91;">Scatter plot view. Hover points for values.</h3>

    <div style="
      position: relative;
      height: 190px;
      width: 100%;
      --axisLeft: 28px;
      --axisRight: 12px;
      --barsGap: 6px;
      --barsPadLeft: 4px;
      --xArea: 45px;
      padding: 0 0 var(--xArea) 0;
      background: #fafafa;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      box-sizing: border-box;
    ">
      <!-- Grid lines -->
      <div aria-hidden="true" style="
        position: absolute;
        left: var(--axisLeft); right: var(--axisRight); top: 8px; bottom: var(--xArea);
        background:
          linear-gradient(to top, rgba(0,0,0,0.06) 1px, transparent 1px) 0 20% / 100% 20% no-repeat,
          linear-gradient(to top, rgba(0,0,0,0.06) 1px, transparent 1px) 0 40% / 100% 40% no-repeat,
          linear-gradient(to top, rgba(0,0,0,0.06) 1px, transparent 1px) 0 60% / 100% 60% no-repeat,
          linear-gradient(to top, rgba(0,0,0,0.06) 1px, transparent 1px) 0 80% / 100% 80% no-repeat,
          linear-gradient(to top, rgba(0,0,0,0.06) 1px, transparent 1px) 0 100% / 100% 100% no-repeat,
          repeating-linear-gradient(to right, transparent 0, transparent calc(100%/8), rgba(0,0,0,0.06) calc(100%/8), rgba(0,0,0,0.06) calc(100%/8 + 1px));
        pointer-events: none;
        z-index: 0;
      "></div>

      <!-- Plot area with full grid coverage -->
      <div style="
        position: absolute; 
        left: var(--axisLeft); right: var(--axisRight); 
        top: 8px; bottom: var(--xArea);
        display: grid; 
        grid-template-columns: repeat(9, 1fr); 
        gap: var(--barsGap); 
        align-items: end;
        padding-left: var(--barsPadLeft);
        z-index: 1;
      ">
        <!-- L1-L3 -->
        <div style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: end;">
          <div title="L1–L3: {commify:l1_l2_l3}" style="
            width: 12px; height: 12px;
            background: #4e79a7;
            border: 2px solid white;
            border-radius: 50%;
            cursor: help;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 10;
            position: absolute;
            bottom: calc((var(--v1, 0) / var(--maxVal)) * 100%);
            transform: translateY(50%);
          "></div>
        </div>
        
        <!-- L4-L6 -->
        <div style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: end;">
          <div title="L4–L6: {commify:l4_l5_l6}" style="
            width: 12px; height: 12px;
            background: #59a14f;
            border: 2px solid white;
            border-radius: 50%;
            cursor: help;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 10;
            position: absolute;
            bottom: calc((var(--v2, 0) / var(--maxVal)) * 100%);
            transform: translateY(50%);
          "></div>
        </div>
        
        <!-- L7 -->
        <div style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: end;">
          <div title="L7: {commify:l7}" style="
            width: 12px; height: 12px;
            background: #9c755f;
            border: 2px solid white;
            border-radius: 50%;
            cursor: help;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 10;
            position: absolute;
            bottom: calc((var(--v3, 0) / var(--maxVal)) * 100%);
            transform: translateY(50%);
          "></div>
        </div>
        
        <!-- L8-L9 -->
        <div style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: end;">
          <div title="L8–L9: {commify:l8_l9}" style="
            width: 12px; height: 12px;
            background: #f28e2b;
            border: 2px solid white;
            border-radius: 50%;
            cursor: help;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 10;
            position: absolute;
            bottom: calc((var(--v4, 0) / var(--maxVal)) * 100%);
            transform: translateY(50%);
          "></div>
        </div>
        
        <!-- L10-L11 -->
        <div style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: end;">
          <div title="L10–L11: {commify:l10_l11}" style="
            width: 12px; height: 12px;
            background: #edc948;
            border: 2px solid white;
            border-radius: 50%;
            cursor: help;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 10;
            position: absolute;
            bottom: calc((var(--v5, 0) / var(--maxVal)) * 100%);
            transform: translateY(50%);
          "></div>
        </div>
        
        <!-- L12 -->
        <div style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: end;">
          <div title="L12: {commify:l12}" style="
            width: 12px; height: 12px;
            background: #76b7b2;
            border: 2px solid white;
            border-radius: 50%;
            cursor: help;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 10;
            position: absolute;
            bottom: calc((var(--v6, 0) / var(--maxVal)) * 100%);
            transform: translateY(50%);
          "></div>
        </div>
        
        <!-- L13 -->
        <div style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: end;">
          <div title="L13: {commify:l13}" style="
            width: 12px; height: 12px;
            background: #b07aa1;
            border: 2px solid white;
            border-radius: 50%;
            cursor: help;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 10;
            position: absolute;
            bottom: calc((var(--v7, 0) / var(--maxVal)) * 100%);
            transform: translateY(50%);
          "></div>
        </div>
        
        <!-- L14 -->
        <div style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: end;">
          <div title="L14: {commify:l14_1_l14_2}" style="
            width: 12px; height: 12px;
            background: #e15759;
            border: 2px solid white;
            border-radius: 50%;
            cursor: help;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 10;
            position: absolute;
            bottom: calc((var(--v8, 0) / var(--maxVal)) * 100%);
            transform: translateY(50%);
          "></div>
        </div>
        
        <!-- L15 -->
        <div style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: end;">
          <div title="L15: {commify:l15}" style="
            width: 12px; height: 12px;
            background: #ff9da7;
            border: 2px solid white;
            border-radius: 50%;
            cursor: help;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 10;
            position: absolute;
            bottom: calc((var(--v9, 0) / var(--maxVal)) * 100%);
            transform: translateY(50%);
          "></div>
        </div>
      </div>

      <!-- Axes overlay -->
      <div aria-hidden="true" style="
        position: absolute; 
        left: var(--axisLeft); right: var(--axisRight); 
        top: 8px; bottom: var(--xArea);
        pointer-events: none; 
        z-index: 2;
      ">
        <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 0; border-left: 2px solid #adb5bd;"></div>
        <div style="position: absolute; left: 0; right: 0; bottom: 0; height: 0; border-bottom: 2px solid #adb5bd;"></div>
      </div>

      <!-- Y-axis tick labels -->
      <div aria-hidden="true" style="
        position: absolute; 
        left: 0; top: 8px; bottom: var(--xArea);
        display: flex; flex-direction: column; justify-content: space-between;
        font-size: 10px; color: #555; text-align: right; 
        padding-right: 10px; line-height: 1;
        pointer-events: none;
        z-index: 3;
      ">
        <div>100%</div>
        <div>80%</div>
        <div>60%</div>
        <div>40%</div>
        <div>20%</div>
        <div>0%</div>
      </div>

      <!-- X-axis labels (rotated like bar chart) -->
      <div style="
        position: absolute; 
        left: var(--axisLeft); right: var(--axisRight); 
        bottom: -5px;
        display: grid; grid-template-columns: repeat(9, 1fr); 
        gap: var(--barsGap);
        justify-items: center; align-items: start;
        font-size: 11px; color: #333; white-space: nowrap;
        line-height: 1;
        height: var(--xArea);
        padding-left: var(--barsPadLeft);
        z-index: 3;
      ">
        <div style="position: relative; width: 100%; height: 100%;">
          <span style="position: absolute; top: 0; right: 50%; display: inline-block; transform: rotate(-50deg); transform-origin: 100% 0;">L1–L3</span>
        </div>
        <div style="position: relative; width: 100%; height: 100%;">
          <span style="position: absolute; top: 0; right: 50%; display: inline-block; transform: rotate(-50deg); transform-origin: 100% 0;">L4–L6</span>
        </div>
        <div style="position: relative; width: 100%; height: 100%;">
          <span style="position: absolute; top: 0; right: 50%; display: inline-block; transform: rotate(-50deg); transform-origin: 100% 0;">L7</span>
        </div>
        <div style="position: relative; width: 100%; height: 100%;">
          <span style="position: absolute; top: 0; right: 50%; display: inline-block; transform: rotate(-50deg); transform-origin: 100% 0;">L8–L9</span>
        </div>
        <div style="position: relative; width: 100%; height: 100%;">
          <span style="position: absolute; top: 0; right: 50%; display: inline-block; transform: rotate(-50deg); transform-origin: 100% 0;">L10–L11</span>
        </div>
        <div style="position: relative; width: 100%; height: 100%;">
          <span style="position: absolute; top: 0; right: 50%; display: inline-block; transform: rotate(-50deg); transform-origin: 100% 0;">L12</span>
        </div>
        <div style="position: relative; width: 100%; height: 100%;">
          <span style="position: absolute; top: 0; right: 50%; display: inline-block; transform: rotate(-50deg); transform-origin: 100% 0;">L13</span>
        </div>
        <div style="position: relative; width: 100%; height: 100%;">
          <span style="position: absolute; top: 0; right: 50%; display: inline-block; transform: rotate(-50deg); transform-origin: 100% 0;">L14</span>
        </div>
        <div style="position: relative; width: 100%; height: 100%;">
          <span style="position: absolute; top: 0; right: 50%; display: inline-block; transform: rotate(-50deg); transform-origin: 100% 0;">L15</span>
        </div>
      </div>
    </div>
  </div>
`;