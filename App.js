import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import './App.css';
import { PageSwitch, HomePage, Navbar, Login, Unauthorized, RoleValidation } from 'Components';
import { Dashboard } from 'layouts';
import { AppContext, AuthProvider} from 'contexts';
import { api } from 'services';


/**
 * Main application component.
 * @function App
 * @returns {JSX.Element} The rendered application component.
 */
function App() {
    const [appConfig, setAppConfig] = useState(null);
    //const { logOut } = useAuth();

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
                    throw new Error('REACT_APP_NAME environment variable is not set');
                }

                const configModule = await import(`configs/${appName}/appConfig`);
                const initialAppConfig = configModule.appConfig;

                const apiSchema = await api.metadataService.getSwaggerFile();

        setAppConfig({
          ...initialAppConfig,
          apiSchema: apiSchema,
        });

      } catch (error) {
        console.error('Failed to load app configuration:', error);
      }
    };

        loadAppConfig();
    }, []);

    // TODO add loading overlay
    if (!appConfig) {
        return <div>Loading...</div>;
    }

    
   
    return (
        <div className="App">
            <AuthProvider>
                <AppContext.Provider value={appConfig}>
                    <Navbar />
                    <Dashboard>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/unauthorized" element={<Unauthorized />} />
                            <Route path="/" element={<RoleValidation component={HomePage} />} />
                            {appConfig.appPages.map((page) => (
                                <Route
                                    key={page.pageName}
                                    path={page.url}
                                    element={<RoleValidation component={() => <PageSwitch pageConfig={page} />} />}
                                />
                            ))}
                            
                        </Routes>
                    </Dashboard>
                </AppContext.Provider>
            </AuthProvider>
        </div>
    );
}

export default App;

