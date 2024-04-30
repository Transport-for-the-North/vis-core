import { Routes, Route } from 'react-router-dom';

import './App.css';
import { appConfig } from 'appConfig';
import { PageSwitch, HomePage, Navbar } from 'Components';
import { Dashboard } from 'layouts';
import { AppContext } from 'contexts';

function App() {
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
