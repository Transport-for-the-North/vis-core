import React, { useContext, useMemo } from "react";
import { AppContext } from "contexts";
import { WarningBox } from "Components";
import { api, createAdminApi } from "services";
import { getAppName } from "../../runtime";
import { resolveAdminEndpoints, defaultLayout, normaliseColumn, isAppAdmin } from "utils";
import { AdminApiContext, AdminCanEditContext } from "hooks";
import { LayoutCell } from "./LayoutCell";
import { Page, LayoutContainer, Column, CellStack } from "./styles";

/**
 * The admin page. Reads its configuration from the app context's `adminPage` and renders
 * a fully config-driven grid of audit, edit and view sections. It resolves the
 * (overridable) API endpoints, builds the app-scoped admin API service, and provides it
 * to the section components via context — those components never talk to the backend
 * directly.
 *
 * @returns {JSX.Element} The admin page.
 */
export const AdminPage = () => {
  const appContext = useContext(AppContext);
  const adminPage = appContext?.adminPage ?? {};

  const auditTables = adminPage.auditTables ?? [];
  const editTables = adminPage.editTables ?? [];
  const viewTables = adminPage.viewTables ?? [];
  const layout = adminPage.layout ?? defaultLayout();
  const app = appContext?.appName ?? getAppName();

  // Admins of this app (`<app>_admin`/`all_admin`) can edit; superusers
  // (`<app>_superuser`/`all_superuser`) reach the page but are view-only. Enforced
  // server-side too.
  const canEdit = isAppAdmin(app);

  // The admin API is bound to the resolved endpoints and the current app, so every
  // request is scoped to (and authorised against) this app on the server.
  const adminApi = useMemo(
    () =>
      createAdminApi({
        baseService: api.baseService,
        endpoints: resolveAdminEndpoints(adminPage.endpoints),
        app,
      }),
    [adminPage.endpoints, app]
  );

  // Optional warning banner pinned to the top of the page. The config string may reference
  // `{app}`, which is substituted with the current app name.
  const warningMessage = adminPage.warning
    ? adminPage.warning.replace(/\{app\}/g, app)
    : null;

  return (
    <AdminApiContext.Provider value={adminApi}>
      <AdminCanEditContext.Provider value={canEdit}>
        <Page>
          {warningMessage && <WarningBox text={warningMessage} isSticky />}
          <LayoutContainer>
            {layout.map(normaliseColumn).map((column, colIdx) => (
              <Column key={colIdx} $flex={column.width}>
                {column.cells.map((cell, cellIdx) => (
                  <CellStack key={cellIdx}>
                    <LayoutCell
                      cell={cell}
                      auditTables={auditTables}
                      editTables={editTables}
                      viewTables={viewTables}
                    />
                  </CellStack>
                ))}
              </Column>
            ))}
          </LayoutContainer>
        </Page>
      </AdminCanEditContext.Provider>
    </AdminApiContext.Provider>
  );
};
