import { useContext, useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";

import { AdminPage } from "Components/AdminPage";
import { CookieBanner } from "Components/CookieBanner";
import { HomePage } from "Components/HomePage";
import { Login } from "Components/Login";
import { Unauthorized } from "Components/Login/Unauthorised";
import { Navbar } from "Components/Navbar";
import { NotFound } from "Components/NotFoundPage/NotFoundPage";
import { PageSwitch } from "Components/PageSwitch";
import { AppContext, AuthProvider, ErrorContext, ErrorProvider, useAuth } from "contexts";
import { Dashboard } from "layouts";
import { api } from "services";
import { loadBands, normaliseStartupError } from "utils";
import { isAppAdmin, isAppSuperuser } from "utils/auth";
import { buildNavbarLinks } from "utils/nav";
import { brandTokens, mergeThemeWithBrandDefaults } from "../../defaults";
import { errorActionTypes } from "../../reducers";
import { composeHOCs, withRoleValidation, withTermsOfUse, withWarning } from "hocs";

const BrandGlobalStyles = createGlobalStyle`
  @font-face {
    font-family: "Korto";
    src: url("/fonts/Korto-Medium.otf") format("opentype");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Korto";
    src: url("/fonts/Korto-Bold.otf") format("opentype");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --app-navbar-height: 75px;
    --app-overlay-top-offset: 85px;

    --palette-navy: ${brandTokens.palette.navy};
    --palette-teal: ${brandTokens.palette.teal};
    --palette-pale-teal: ${brandTokens.palette.paleTeal};
    --palette-white: ${brandTokens.palette.white};
    --palette-grey: ${brandTokens.palette.grey};
    --palette-mid-grey: ${brandTokens.palette.midGrey};
    --palette-pale-grey: ${brandTokens.palette.paleGrey};
    --palette-bottom-grey: ${brandTokens.palette.bottomGrey};
    --text-icon: ${brandTokens.palette.textIcon};

    --radius-xxs: ${brandTokens.radii.xxs};
    --radius-xs: ${brandTokens.radii.xs};
    --radius-sm: ${brandTokens.radii.sm};
    --radius-lg: ${brandTokens.radii.lg};
    --radius-pill-lg: ${brandTokens.radii.pillLg};
    --radius-pill-sm: ${brandTokens.radii.pillSm};

    --font-family-base: ${brandTokens.fonts.base};
    --font-sans: "Open Sans", "Segoe UI", Arial, sans-serif;
  }

  html,
  body {
    max-width: 100%;
    overflow-x: hidden;
  }

  body {
    margin: 0;
    font-family: var(--font-family-base);
    color: var(--text-icon);
    background: var(--palette-white);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Korto", "Open Sans", "Segoe UI", Arial, sans-serif;
    color: var(--text-icon);
  }

  p,
  a,
  ul > li,
  ol > li,
  li,
  .copy {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-icon);
  }

  a:hover {
    color: var(--palette-teal);
  }

  .copy-sm {
    font-size: 16px;
    line-height: 24px;
  }

  .copy-semibold {
    font-weight: 600;
  }

  .skip-link {
    position: absolute;
    left: -999px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
    z-index: 1000;
    background: var(--palette-teal);
    color: var(--palette-navy);
    padding: 8px 16px;
    border-radius: var(--radius-pill-lg);
  }

  .skip-link:focus {
    left: 16px;
    top: 16px;
    width: auto;
    height: auto;
    outline: 2px solid var(--palette-navy);
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
`;

function RoleAwareAppContextProvider({
  appConfig,
  appName,
  isAuthRequired,
  children,
}) {
  const { token } = useAuth();

  const contextValue = useMemo(() => {
    const normalisedAppName = (appName || "").toLowerCase();
    const isAdmin =
      !isAuthRequired ||
      isAppAdmin(normalisedAppName) ||
      isAppSuperuser(normalisedAppName);

    const visibleAppPages = (appConfig.appPages ?? []).filter(
      (page) => !page.adminOnly || isAdmin,
    );

    const navbarLinks = buildNavbarLinks({
      ...appConfig,
      appPages: visibleAppPages,
    });

    if (appConfig.adminPage && isAdmin) {
      navbarLinks.splice(1, 0, {
        label: "Admin",
        url: "/admin",
      });
    }

    return {
      ...appConfig,
      appPages: visibleAppPages,
      navbarLinks,
    };
  }, [appConfig, appName, isAuthRequired, token]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

function BaseAppContent({
  theme,
  configLoader,
  bandsLoader,
  appName,
  appCssClass = "App",
  customRoutes = null,
  customProviders = null,
  beforeDashboard = null,
  afterDashboard = null,
}) {
  const [appConfig, setAppConfig] = useState(null);
  const effectiveTheme = useMemo(
    () => mergeThemeWithBrandDefaults(theme),
    [theme],
  );
  const { dispatch } = useContext(ErrorContext);
  const location = useLocation();

  const isPublicRoute =
    location.pathname === "/login" ||
    location.pathname === "/unauthorized";

  const isAuthRequired =
    appConfig?.authenticationRequired ?? true;

  // Keep hooks above the conditional returns below.
  const HomePageWithRoleValidation = useMemo(
    () =>
      isAuthRequired
        ? withRoleValidation(HomePage)
        : HomePage,
    [isAuthRequired],
  );

  const NotFoundWithRoleValidation = useMemo(
    () =>
      isAuthRequired
        ? withRoleValidation(NotFound)
        : NotFound,
    [isAuthRequired],
  );

  const AdminPageWithAuth = useMemo(
    () =>
      isAuthRequired
        ? withRoleValidation(AdminPage, { adminOnly: true })
        : AdminPage,
    [isAuthRequired],
  );

  const pageRoutes = useMemo(() => {
    if (!appConfig) {
      return null;
    }

    return (appConfig.appPages ?? []).map((page) => {
      const PageComponent = isAuthRequired
        ? withRoleValidation(PageSwitch, {
            adminOnly: page.adminOnly ?? false,
          })
        : PageSwitch;

      const WrappedPageComponent = composeHOCs(
        withWarning,
        withTermsOfUse,
      )(PageComponent);

      return (
        <Route
          key={page.pageName}
          path={page.url}
          element={<WrappedPageComponent pageConfig={page} />}
        />
      );
    });
  }, [appConfig, isAuthRequired]);

  useEffect(() => {
    if (isPublicRoute) {
      return;
    }

    const loadAppConfig = async () => {
      try {
        if (!appName) {
          throw new Error("appName prop is required");
        }

        const configModules = configLoader();
        const bandModules = bandsLoader();

        const configPath = `./configs/${appName}/appConfig.js`;
        const bandsPath = `./configs/${appName}/bands.js`;

        if (!configModules[configPath]) {
          throw new Error(`Config not found for app: ${appName}`);
        }

        const configModule = await configModules[configPath]();
        const initialAppConfig = configModule.appConfig;

        const bands = await loadBands({
          bandModules,
          bandsPath,
          appName,
        });

        const apiSchema = await api.metadataService.getSwaggerFile();
        const authenticationRequired =
          initialAppConfig.authenticationRequired ?? true;

        const adminPageEntry =
          initialAppConfig.appPages?.find(
            (page) => page.type === "AdminPage",
          );

        const filteredAppPages =
          initialAppConfig.appPages?.filter(
            (page) => page.type !== "AdminPage",
          ) ?? [];

        setAppConfig({
          ...initialAppConfig,
          appPages: filteredAppPages,
          adminPage:
            adminPageEntry?.config ??
            initialAppConfig.adminPage ??
            null,
          apiSchema,
          defaultBands: bands,
          authenticationRequired,
        });
      } catch (error) {
        console.error(
          "Failed to load app configuration:",
          error,
        );

        if (error?.status === 401) {
          window.location.assign("/login");
          return;
        }

        dispatch({
          type: errorActionTypes.SET_ERROR,
          payload: normaliseStartupError(error),
        });
      }
    };

    loadAppConfig();
  }, [appName, bandsLoader, configLoader, dispatch, isPublicRoute]);

  if (isPublicRoute) {
    return (
      <div className={appCssClass}>
        <AuthProvider>
          <ThemeProvider theme={effectiveTheme}>
            <BrandGlobalStyles />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/unauthorized"
                element={<Unauthorized />}
              />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </div>
    );
  }

  if (!appConfig) {
    return <div>Loading...</div>;
  }

  const standardRoutes = (
    <>
      <Route path="/login" element={<Login />} />
      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />
      <Route
        path="/"
        element={<HomePageWithRoleValidation />}
      />

      {appConfig.adminPage && (
        <Route
          path="/admin"
          element={<AdminPageWithAuth />}
        />
      )}

      {pageRoutes}
      {customRoutes}

      <Route
        path="*"
        element={<NotFoundWithRoleValidation />}
      />
    </>
  );

  const appContent = (
    <div className={appCssClass}>
      <AuthProvider>
        <ThemeProvider theme={effectiveTheme}>
          <BrandGlobalStyles />
          <RoleAwareAppContextProvider
            appConfig={appConfig}
            appName={appName}
            isAuthRequired={isAuthRequired}
          >
            {beforeDashboard}
            <Navbar />
            <CookieBanner />
            <Dashboard>
              <Routes>{standardRoutes}</Routes>
            </Dashboard>
            {afterDashboard}
          </RoleAwareAppContextProvider>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );

  if (customProviders) {
    return customProviders(appContent);
  }

  return appContent;
}

export function BaseApp(props) {
  return (
    <ErrorProvider>
      <BaseAppContent {...props} />
    </ErrorProvider>
  );
}