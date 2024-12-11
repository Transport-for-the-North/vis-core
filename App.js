import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { PageSwitch, HomePage, Navbar, Login, Unauthorized, TermsOfUse } from "Components";
import { Dashboard } from "layouts";
import { AppContext, AuthProvider } from "contexts";
import { api } from "services";
import { withWarning, withRoleValidation, composeHOCs, withTermsOfUse } from "hocs";

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
        const defaultBands = await import(`configs/${appName}/bands`);
        const bands = defaultBands.bands;
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

  return (
    <div className="App">
      <AuthProvider>
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
      </AuthProvider>
    </div>
  );
}

export default App;
