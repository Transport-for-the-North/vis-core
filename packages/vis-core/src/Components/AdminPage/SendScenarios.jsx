import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "styled-components";
import Select from "react-select";
import { makeSelectStyles } from "utils/selectStyles";
// Direct module path: the cache is deliberately not re-exported from the utils barrel.
import { clearMetadataCache } from "utils/metadataCache";
import { AppButton } from "Components/AppButton";
import { useAdminApi, useAdminCanEdit, useAdminRefresh } from "hooks";
import { LookupSelect } from "./LookupSelect";
import { SectionTitle, ErrorMessage, SuccessMessage, WarnMessage, AddRow, SelectWrap } from "./styles";

/**
 * Renders an option's label with any `descriptions` (extra source columns) as muted
 * secondary lines in the menu; selected chips stay compact (label only). Mirrors
 * {@link LookupSelect}'s option rendering so the multi-select reads the same.
 *
 * @param {{label: string, descriptions?: Object}} option - The option data.
 * @param {{context: "menu"|"value"|"input"}} meta - react-select render context.
 * @returns {JSX.Element|string} The rendered option.
 */
function formatOptionLabel(option, meta) {
  const descriptions = option.descriptions
    ? Object.values(option.descriptions).filter((d) => d != null && d !== "")
    : [];
  if (meta.context === "value" || descriptions.length === 0) {
    return option.label;
  }
  return (
    <div>
      <div>{option.label}</div>
      {descriptions.map((d, i) => (
        <div key={i} style={{ fontSize: "0.72rem", color: "#6b7280", lineHeight: 1.3 }}>
          {d}
        </div>
      ))}
    </div>
  );
}

/**
 * "Send scenarios to app" section: pick several scenarios and a destination app, then
 * register all of them to that app in one action. Unlike the registrations editor (which is
 * fixed to the current app), the destination is chosen here, so an admin can push scenarios
 * to another app. View-only users don't see it. Each successful registration also appends a
 * REGISTERED entry to the pipeline audit log (handled server-side).
 *
 * @param {Object} props
 * @param {Object} props.config - The `sendScenarios` config
 *   ({ title?, scenarioSource, appSource, refreshTables? }). `scenarioSource`/`appSource`
 *   are lookup configs ({ table, schema, valueColumn, labelColumn, filter?,
 *   descriptionColumns?, placeholder? }).
 * @returns {JSX.Element|null} The section, or null when not applicable/permitted.
 */
export function SendScenarios({ config }) {
  const adminApi = useAdminApi();
  const canEdit = useAdminCanEdit();
  const { requestRefresh } = useAdminRefresh();
  const theme = useTheme();
  const selectStyles = useMemo(
    () => makeSelectStyles(theme, { minHeight: 36, fontSize: "0.85rem", borderColor: "#d1d5db" }),
    [theme]
  );

  const scenarioSource = config?.scenarioSource;
  const appSource = config?.appSource;
  const refreshTables = config?.refreshTables ?? [];

  const [scenarioOptions, setScenarioOptions] = useState([]);
  const [appOptions, setAppOptions] = useState([]);
  // True once destinations have loaded and the current app is permitted to send to none
  // (it feeds no other app per the approved data pathways).
  const [noTargets, setNoTargets] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [targetApp, setTargetApp] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [skippedNotice, setSkippedNotice] = useState(null);

  useEffect(() => {
    if (!scenarioSource) return;
    adminApi.getLookup(scenarioSource).then((opts) => setScenarioOptions(opts ?? [])).catch(() => {});
  }, [adminApi, scenarioSource]);

  // Destinations are the approved data pathways for the current app (enforced server-side),
  // not every app. If the pathway endpoint is unavailable, fall back to the raw app lookup so
  // the tool still works against an older backend.
  useEffect(() => {
    adminApi
      .getSendTargets()
      .then((targets) => {
        const opts = (targets ?? []).map((t) => ({ value: t.appId, label: t.appName }));
        setAppOptions(opts);
        setNoTargets(opts.length === 0);
      })
      .catch(() => {
        setNoTargets(false);
        if (appSource) {
          adminApi.getLookup(appSource).then((opts) => setAppOptions(opts ?? [])).catch(() => {});
        }
      });
  }, [adminApi, appSource]);

  // View-only users, or a page without the sources configured, render nothing.
  if (!canEdit || !scenarioSource || !appSource) return null;

  const canSend = selectedScenarios.length > 0 && targetApp !== "" && !sending;

  /**
   * Maps scenario ids back to their display labels (scenario codes), for naming the
   * duplicates that were skipped.
   * @param {Array<number|string>} ids - Scenario ids.
   * @returns {string} A comma-separated list of labels (falling back to the id).
   */
  const labelsForScenarioIds = (ids) =>
    (ids ?? [])
      .map((id) => scenarioOptions.find((o) => String(o.value) === String(id))?.label ?? id)
      .join(", ");

  /**
   * Registers every selected scenario to the chosen destination app, then reports how many
   * were registered vs. skipped (already registered, so not duplicated) and refreshes
   * affected sections.
   * @returns {Promise<void>}
   */
  const handleSend = async () => {
    setSending(true);
    setError(null);
    setSuccess(null);
    setSkippedNotice(null);
    try {
      const res = await adminApi.sendScenarios({
        targetAppId: targetApp,
        scenarioIds: selectedScenarios.map((o) => o.value),
      });
      const registered = res?.registered ?? 0;
      const skipped = res?.skipped ?? 0;
      const appLabel =
        appOptions.find((o) => String(o.value) === String(targetApp))?.label ?? "the selected app";

      if (registered > 0) {
        setSuccess(
          `Successfully registered ${registered} scenario${registered === 1 ? "" : "s"} to ${appLabel}.`
        );
      }
      // Highlight any that were already registered (skipped, not duplicated), naming them.
      if (skipped > 0) {
        const names = labelsForScenarioIds(res?.skippedScenarioIds);
        setSkippedNotice(
          `${skipped} scenario${skipped === 1 ? " was" : "s were"} already registered to ${appLabel} and ` +
            `${skipped === 1 ? "was" : "were"} skipped${names ? `: ${names}` : ""}.`
        );
      }
      // When everything was a duplicate there's no "success" line, so make the outcome clear.
      if (registered === 0 && skipped === 0) {
        setSuccess("No scenarios were selected to send.");
      }

      setSelectedScenarios([]);
      setTargetApp("");
      // Registrations change what the scenario metadata endpoint returns for the destination
      // app; drop the cached responses so the sidebar dropdowns pick the new ones up rather
      // than serving the stale list from sessionStorage for the rest of the session.
      if (registered > 0) clearMetadataCache();
      requestRefresh(refreshTables);
    } catch {
      setError("Failed to send scenarios.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <SectionTitle>{config.title ?? "Send Scenarios to App"}</SectionTitle>
      {noTargets && (
        <WarnMessage style={{ marginBottom: 8 }}>
          This app has no approved data pathways, so it cannot send scenarios to another app.
        </WarnMessage>
      )}
      {error && <ErrorMessage style={{ marginBottom: 8 }}>{error}</ErrorMessage>}
      {success && <SuccessMessage style={{ marginBottom: 8 }}>{success}</SuccessMessage>}
      {skippedNotice && <WarnMessage style={{ marginBottom: 8 }}>{skippedNotice}</WarnMessage>}
      <AddRow>
        <SelectWrap style={{ minWidth: 240 }}>
          <Select
            styles={selectStyles}
            options={scenarioOptions}
            value={selectedScenarios}
            onChange={(opts) => setSelectedScenarios(opts ?? [])}
            formatOptionLabel={formatOptionLabel}
            isMulti
            isDisabled={sending || noTargets}
            placeholder={scenarioSource.placeholder ?? "Select scenarios"}
            closeMenuOnSelect={false}
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
          />
        </SelectWrap>
        <LookupSelect
          options={appOptions}
          value={targetApp}
          onChange={setTargetApp}
          placeholder={appSource.placeholder ?? "Select destination app"}
          disabled={sending || noTargets}
        />
        <AppButton disabled={!canSend} onClick={handleSend}>
          {sending ? "Sending…" : "Send"}
        </AppButton>
      </AddRow>
    </div>
  );
}
