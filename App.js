import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import './App.css';
import { appConfig as initialAppConfig } from 'configs/norms/appConfig';
import { PageSwitch, HomePage, Navbar } from 'Components';
import { Dashboard } from 'layouts';
import { AppContext } from 'contexts';
import { api } from 'services';

/**
 * Main application component.
 * @function App
 * @returns {JSX.Element} The rendered application component.
 */
function App() {
  const [appConfig, setAppConfig] = useState({
    ...initialAppConfig,
    apiSchema: null
  });

  useEffect(() => {
    /**
     * Fetches the Swagger definition from the API.
     * @function fetchSwaggerDefinition
     * @async
     */
    const fetchSwaggerDefinition = async () => {
      try {
        const apiSchema = await api.metadataService.getSwaggerFile();
        // TODO add timeout
        setAppConfig((prevConfig) => ({
          ...prevConfig,
          apiSchema: apiSchema,
        }));
      } catch (error) {
        console.error('Failed to fetch Swagger definition:', error);
      }
    };

    fetchSwaggerDefinition();
  }, []);

  // TODO add loading overlay
  if (!appConfig.apiSchema) {
    return <div>Loading...</div>;
  }


  return (
    <div className="App">
      <AppContext.Provider value={appConfig}>
        <Navbar />
        <Dashboard >
          <Routes>
            <Route key={'home'} path={'/'} element={<HomePage />} />
            {appConfig.appPages.map((page) => (
              <Route key={page.pageName} exact path={page.url} element={<PageSwitch pageConfig={page} />} />
            ))}
          </Routes>
        </Dashboard>
      </AppContext.Provider>
    </div>
  );
}

export default App;
