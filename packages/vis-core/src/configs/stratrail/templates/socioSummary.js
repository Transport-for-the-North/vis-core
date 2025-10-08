// Bar chart (vertical) based on max value (single colour). Interactive via hover (title tooltips).
export const socioBarSummary = `
  <div class="socio-summary"
       style="
         /* Raw numeric values (no commas / no %) */
         --v1:{economically_active_exc_students}; --v2:{economically_active_inc_student}; --v3:{economically_inactive};
         /* max across all values (guard with tiny epsilon to avoid div-by-zero) */
         --maxVal: max(
           max(var(--v1,0), var(--v2,0), var(--v3,0), 0.00001)
         );
       "
       role="group" aria-labelledby="socio-summary-title">
    <h2 id="socio-summary-title">Socio-economic distribution for {name}</h2>

    <div class="socio-bars" aria-labelledby="socio-bars-title" style="overflow:hidden;">
      <h3 id="socio-bars-title" style="margin:6px 0 8px; font-size:1.1em; color:#4b3e91;">Bar chart (max‑scaled). Hover bars for values.</h3>

      <div style="
            position: relative;
            height: 190px;
            width: 100%;                   /* fill card width */
            /* unified sizing so bars and labels use identical values */
            --axisLeft: 28px;
            --axisRight: 12px;
            --barsGap: 6px;
            --barsPadLeft: 4px;
            --xArea: 40px;                 /* increased further for word-wrapped labels */
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
              display:grid; grid-template-columns: repeat(3, 1fr); gap:var(--barsGap); align-items:end;
              padding-left:var(--barsPadLeft);  /* slight gap from Y axis */
              padding-bottom:0;                 /* was 2px – remove extra space above X labels */
              z-index:1;
            ">
          <div title="Economically Active (excl. students): {commify:economically_active_exc_students}"
               style="height: calc((var(--v1, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
          <div title="Economically Active (incl. students): {commify:economically_active_inc_student}"
               style="height: calc((var(--v2, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
          <div title="Economically Inactive: {commify:economically_inactive}"
               style="height: calc((var(--v3, 0) / var(--maxVal)) * 100%); background:#4b3e91; border-radius:4px 4px 0 0; transition:height .35s ease;"></div>
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

        <!-- X-axis labels (word-wrapped) -->
        <div style="
              position:absolute; left:var(--axisLeft); right:var(--axisRight); bottom:0;
              display:grid; grid-template-columns: repeat(3, 1fr); gap:var(--barsGap); /* match bars */
              justify-items:center; align-items:start;
              font-size:10px; color:#333;
              line-height:1.3;
              height: var(--xArea);                   /* same reserved space as plot */
              padding-left:var(--barsPadLeft);        /* match bars */
              padding-top: 5px;                       /* small gap from axis */
              z-index:3;
            ">
          <div style="
            text-align: center;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            max-width: 100%;
          ">
            Economically<br>Active<br>(excl. students)
          </div>
          <div style="
            text-align: center;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            max-width: 100%;
          ">
            Economically<br>Active<br>(incl. students)
          </div>
          <div style="
            text-align: center;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            max-width: 100%;
          ">
            Economically<br>Inactive
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// Table summary
export const socioTableSummary = `
  <div class="socio-table" role="group" aria-labelledby="socio-table-title">
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
            <th style="padding: 8px; text-align: left; font-weight: 600;">Category</th>
            <th style="padding: 8px; text-align: right; font-weight: 600;">Count</th>
            <th style="padding: 8px; text-align: right; font-weight: 600;">%</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; border-right: 1px solid #eee;">Economically Active (excluding students)</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:economically_active_exc_students}</td>
            <td style="padding: 8px; text-align: right;">{percent:economically_active_exc_students}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; border-right: 1px solid #eee;">Economically Active (including students)</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:economically_active_inc_student}</td>
            <td style="padding: 8px; text-align: right;">{percent:economically_active_inc_student}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-right: 1px solid #eee;">Economically Inactive</td>
            <td style="padding: 8px; text-align: right; border-right: 1px solid #eee;">{commify:economically_inactive}</td>
            <td style="padding: 8px; text-align: right;">{percent:economically_inactive}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;