import { useEffect, useState, useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import { AppContext, AuthProvider, ErrorProvider, ErrorContext } from "../../contexts";
import { api } from "../../services";
import { loadBands } from "../../utils";
import {
  withWarning,
  withRoleValidation,
  composeHOCs,
  withTermsOfUse
} from "../../hocs";
import { errorActionTypes } from "../../reducers";

/**
 * Maps runtime/bootstrap errors into the structure expected by ErrorOverlay.
 *
 * @param {Error} error - The thrown error
 * @returns {Object} A normalised error payload for ErrorContext
 */
function normaliseStartupError(error) {
  const status = error?.status;

  if (status === 403) {
    return {
      title: "Access Denied",
      subtitle: "You do not have permission to access this resource",
      message: "The application could not load because access to a required resource was denied.",
      supportMessage: "Please contact support if you believe you should have access.",
      supportDetails: "Include the page URL and the time of the error when reporting this issue.",
      technicalDetails: `${error.message}${error.url ? `\nURL: ${error.url}` : ""}`,
      headerColor: "#c62828",
      showTechnicalDetails: true,
    };
  }

  if (status >= 500) {
    return {
      title: "Server Error",
      subtitle: "A server error occurred while loading the application",
      message: "The application could not load required configuration from the server.",
      supportMessage: "Please try again later or contact support if the issue persists.",
      supportDetails: "If reporting this issue, include the time and any relevant request details.",
      technicalDetails: `${error.message}${error.url ? `\nURL: ${error.url}` : ""}`,
      headerColor: "#c62828",
      showTechnicalDetails: true,
    };
  }

  return {
    title: "Application Error",
    subtitle: "Failed to load application configuration",
    message: "The application could not start because a required configuration request failed.",
    supportMessage: "Please refresh the page or contact support if the issue persists.",
    supportDetails: "Include the page URL and any visible error details when reporting this issue.",
    technicalDetails: error?.stack || error?.message || String(error),
    headerColor: "#d32f2f",
    showTechnicalDetails: true,
  };
}

/**
 * Internal application component used inside ErrorProvider so startup errors
 * can dispatch into ErrorContext.
 */
function BaseAppContent({
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
  const { dispatch } = useContext(ErrorContext);
  const location = useLocation();

  const isPublicRoute =
    location.pathname === "/login" || location.pathname === "/unauthorized";

  useEffect(() => {
    if (isPublicRoute) {
      return;
    }

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

        // Handle 401 Unauthorized by redirecting to login page
        if (error?.status === 401) {
          window.location.assign("/login");
          return;
        }

        dispatch({
          type: errorActionTypes.SET_ERROR,
          payload: normaliseStartupError(error)
        });
      }
    };

    loadAppConfig();
  }, [appName, configLoader, bandsLoader, dispatch, isPublicRoute]);

  // Render public routes (login, unauthorized) without loading appConfig
  if (isPublicRoute) {
    return (
      <div className={appCssClass}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </div>
    );
  }

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
export function BaseApp(props) {
  return (
    <ErrorProvider>
      <BaseAppContent {...props} />
    </ErrorProvider>
  );
}