import {useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import './App.css';
import { appConfig as appConfigStatic } from 'appConfig';
import { PageSwitch, HomePage, Navbar } from 'Components';
import { Dashboard } from 'layouts';
import { AppContext } from 'contexts';
import { api } from 'services';

function App() {
  const [appConfig, setAppConfig] = useState(appConfigStatic);

  useEffect(() => {
    const fetchSwaggerDefinition = async () => {
      try {
        const apiSchema = await api.metadataService.getSwaggerFile();
        const updatedAppConfig = {
          ...appConfig,
          apiSchema,
        };
        setAppConfig(updatedAppConfig);
      } catch (error) {
        console.error('Failed to fetch Swagger definition:', error);
      }
    };

    fetchSwaggerDefinition();
  }, []);

  if (!appConfig.apiSchema) {
    // Do nothing for now, but we should be loading.
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
