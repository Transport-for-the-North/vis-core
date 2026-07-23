import { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { PageSwitch } from "Components/PageSwitch";
import { HomePage } from "Components/HomePage";
import { Navbar } from "Components/Navbar";
import { Login } from "Components/Login";
import { Unauthorized } from "Components/Login/Unauthorised";
import { TermsOfUse } from "Components/TermsOfUse";
import { NotFound } from "Components/NotFoundPage/NotFoundPage";
import { Dashboard } from "layouts";
import { AppContext, AuthProvider, ErrorProvider } from "contexts";
import { api } from "services";
import { loadBands } from "utils";
import { brandTokens, mergeThemeWithBrandDefaults } from "../../defaults";
import {
  withWarning,
  withRoleValidation,
  composeHOCs,
  withTermsOfUse
} from "hocs";

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

/**
 * Base application component that can be used across all TfN apps.
 * Handles dynamic config loading, routing, and authentication.
 * 
 * @param {Object} props
 * @param {Object} props.theme - Styled-components theme object
 * @param {Function} props.configLoader - Function that returns config modules
 * @param {Function} props.bandsLoader - Function that returns bands modules
 * @param {string} props.appName - The application name (from VITE_APP_NAME env variable)
 * @param {string} [props.appCssClass="App"] - Optional CSS class for the app wrapper
 * @param {JSX.Element} [props.customRoutes=null] - Optional additional Route components to inject into the router
 * @param {Function} [props.customProviders=null] - Optional function that wraps the app content with custom context providers
 * @param {JSX.Element} [props.beforeDashboard=null] - Optional content to render before the Dashboard component
 * @param {JSX.Element} [props.afterDashboard=null] - Optional content to render after the Dashboard component
 * @returns {JSX.Element} The rendered application component
 */
export function BaseApp({
  theme,
  configLoader,
  bandsLoader,
  appName,
  appCssClass = "App",
  customRoutes = null,
  customProviders = null,
  beforeDashboard = null,
  afterDashboard = null
}) {
  const [appConfig, setAppConfig] = useState(null);
  const effectiveTheme = useMemo(() => mergeThemeWithBrandDefaults(theme), [theme]);

  useEffect(() => {
    /**
     * Dynamically imports the appConfig based on the provided appName.
     * Uses import.meta.glob to ensure Vite bundles all possible configs in production.
     * @function loadAppConfig
     * @async
     */
    const loadAppConfig = async () => {
      try {
        if (!appName) {
          throw new Error("appName prop is required");
        }

        // Get config modules from the app-specific loader
        const configModules = configLoader();
        const bandModules = bandsLoader();

        const configPath = `./configs/${appName}/appConfig.js`;
        const bandsPath = `./configs/${appName}/bands.js`;

        if (!configModules[configPath]) {
          throw new Error(`Config not found for app: ${appName}`);
        }

        const configModule = await configModules[configPath]();
        const initialAppConfig = configModule.appConfig;

        // Load bands with fallback logic.
        // Uses the shared loader, which is tolerant and returns [] if the module
        // is missing/invalid/throws.
        const bands = await loadBands({ bandModules, bandsPath, appName });

        const apiSchema = await api.metadataService.getSwaggerFile();
        const authenticationRequired = initialAppConfig.authenticationRequired ?? true;

        setAppConfig({
          ...initialAppConfig,
          apiSchema: apiSchema,
          defaultBands: bands,
          authenticationRequired: authenticationRequired
        });
      } catch (error) {
        console.error("Failed to load app configuration:", error);
      }
    };

    loadAppConfig();
  }, [appName, configLoader, bandsLoader]);

  if (!appConfig) {
    return <div>Loading...</div>;
  }

  const isAuthRequired = appConfig.authenticationRequired ?? true;
  const HomePageWithRoleValidation = isAuthRequired
    ? withRoleValidation(HomePage)
    : HomePage;
  const NotFoundWithRoleValidation = isAuthRequired
    ? withRoleValidation(NotFound)
    : NotFound;

  // Standard routes
  const standardRoutes = (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<HomePageWithRoleValidation />} />
      {appConfig.appPages.map((page) => {
        const PageComponent = isAuthRequired
          ? withRoleValidation(PageSwitch)
          : PageSwitch;
        const WrappedPageComponent = composeHOCs(
          withWarning,
          withTermsOfUse
        )(PageComponent);
        return (
          <Route
            key={page.pageName}
            path={page.url}
            element={<WrappedPageComponent pageConfig={page} />}
          />
        );
      })}
      {customRoutes}
      <Route path="*" element={<NotFoundWithRoleValidation />} />
    </>
  );

  const appContent = (
    <div className={appCssClass}>
      <AuthProvider>
        <ErrorProvider>
          <ThemeProvider theme={effectiveTheme}>
            <BrandGlobalStyles />
            <AppContext.Provider value={appConfig}>
              {beforeDashboard}
              <Navbar />
              <Dashboard>
                <Routes>
                  {standardRoutes}
                </Routes>
              </Dashboard>
              {afterDashboard}
            </AppContext.Provider>
          </ThemeProvider>
        </ErrorProvider>
      </AuthProvider>
    </div>
  );

  if (customProviders) {
    return customProviders(appContent);
  }

  return appContent;
}
