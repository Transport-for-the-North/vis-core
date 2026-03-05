import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import {
  PageSwitch,
  HomePage,
  Navbar,
  Login,
  Unauthorized,
  TermsOfUse,
  NotFound
} from "../index";
import { Dashboard } from "../../layouts";
import { AppContext, AuthProvider } from "../../contexts";
import { api } from "../../services";
import {
  withWarning,
  withRoleValidation,
  composeHOCs,
  withTermsOfUse
} from "../../hocs";

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

        // Load bands with fallback logic
        let bands = null;
        try {
          if (bandModules[bandsPath]) {
            const defaultBands = await bandModules[bandsPath]();
            bands = defaultBands.bands;
          } else {
            throw new Error("Bands module not found");
          }
        } catch (bandError) {
          console.warn(`Warning: ${appName} bands module not found. Attempting to load from appConfig...`);
          // If the bands file is missing, use loadBands from appConfig
          if (initialAppConfig.loadBands) {
            try {
              bands = await initialAppConfig.loadBands();
            } catch (loadBandsError) {
              console.warn(`Failed to load bands from appConfig.loadBands:`, loadBandsError);
              bands = [];
            }
          } else {
            console.warn("Bands module is missing, and appConfig.loadBands is not defined.");
            bands = [];
          }
        }

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
        <ThemeProvider theme={theme}>
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
      </AuthProvider>
    </div>
  );

  if (customProviders) {
    return customProviders(appContent);
  }

  return appContent;
}
