import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import "./App.css";
import { PageSwitch, HomePage, Navbar, Login, Unauthorized, TermsOfUse } from "Components";
import { Dashboard } from "layouts";
import { AppContext, AuthProvider } from "contexts";
import { api } from "services";
import { withWarning, withRoleValidation, composeHOCs, withTermsOfUse } from "hocs";
import { theme } from "theme";
import { NotFound } from "Components/NotFoundPage";
import { NotFound } from "Components/NotFoundPage";

/**
 * Main application component.
 * @function App
 * @returns {JSX.Element} The rendered application component.
 */
function App() {
  const [appConfig, setAppConfig] = useState(null);

  useEffect(() => {
    /**
     * Dynamically imports the appConfig based on the REACT_APP_NAME environment variable.
     * @function loadAppConfig
     * @async
     */
    const loadAppConfig = async () => {
      try {
        const appName = process.env.REACT_APP_NAME;
        if (!appName) {
          throw new Error("REACT_APP_NAME environment variable is not set");
        }

        const configModule = await import(`configs/${appName}/appConfig`);
        const initialAppConfig = configModule.appConfig;

        let bands = null; // Ensure bands is properly initialized
        try{
          const defaultBands = await import(`configs/${appName}/bands`);
          bands = defaultBands.bands;
        } catch (bandError) {
          console.warn(`Warning: ${appName} bands module not found. Attempting to load from appConfig...`);
          // If the bands file is missing, use loadBands from appConfig
          if (initialAppConfig.loadBands) {
            bands = await initialAppConfig.loadBands();
          } else {
            throw new Error("Bands module is missing, and appConfig.loadBands is not defined.");
          }
        }

        const apiSchema = await api.metadataService.getSwaggerFile();
        const authenticationRequired = initialAppConfig.authenticationRequired ?? true

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
  }, []);

  if (!appConfig) {
    return <div>Loading...</div>;
  }

  const isAuthRequired = appConfig.authenticationRequired ?? true;
  const HomePageWithRoleValidation = isAuthRequired ? withRoleValidation(HomePage) : HomePage;
  const NotFoundWithRoleValidation = isAuthRequired ? withRoleValidation(NotFound) : NotFound;

  return (
    <div className="App">
      <AuthProvider>
        <ThemeProvider theme={theme}>
        <AppContext.Provider value={appConfig}>
          <Navbar />
          <Dashboard>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={<HomePageWithRoleValidation />} />
              {appConfig.appPages.map((page) => {
                const PageComponent = isAuthRequired
                  ? withRoleValidation(PageSwitch)
                  : PageSwitch;
                const WrappedPageComponent =
                  composeHOCs(withWarning, withTermsOfUse)(PageComponent);
                return (
                  <Route
                    key={page.pageName}
                    path={page.url}
                    element={<WrappedPageComponent pageConfig={page} />}
                  />
                );
              })}
            </Routes>
          </Dashboard>
        </AppContext.Provider>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
