export const socioSummary = `
    <h2>Socio-economic summary for {name}<h2>
    <div class="card-container">
      <div class="card">
        <div class="label">Economically Active (excluding students)</div>
        <div class="value" style="font-size: 1.2em;">{economically_active_exc_students}</div>
      </div>
      <div class="card">
        <div class="label">Economically Active (including students)</div>
        <div class="value" style="font-size: 1.2em;">{economically_active_inc_student}</div>
      </div>
      <div class="card">
        <div class="label">Economically Inactive</div>
        <div class="value" style="font-size: 1.2em;">{economically_inactive}</div>
      </div>
    </div>
`;