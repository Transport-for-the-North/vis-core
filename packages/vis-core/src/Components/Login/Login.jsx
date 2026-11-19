import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "contexts/AuthProvider";
import { AppContext } from "contexts/AppContext";
import './Login.css';

// Fallbacks used when the app config does not set its own login branding.
const DEFAULT_LOGIN_LOGO_IMAGE = '/img/tfn-logo-fullsize.png';
const DEFAULT_LOGIN_LOGO_ALT = 'Transport for the North';
const DEFAULT_LOGIN_TEXT = 'Log in to Transport for the North to continue to the Appraisal Platform.';

/**
 * Login page.
 * The logo, its alt text and the intro text can be set in the app config with
 * `loginLogoImage`, `loginLogoAlt` and `loginText`; each falls back to the TfN default.
 */
export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { loginAction } = useAuth();
    const appContext = useContext(AppContext);
    const logoImage = appContext?.loginLogoImage || DEFAULT_LOGIN_LOGO_IMAGE;
    const logoAlt = appContext?.loginLogoAlt || DEFAULT_LOGIN_LOGO_ALT;
    const loginText = appContext?.loginText || DEFAULT_LOGIN_TEXT;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            await loginAction(username, password);
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={logoImage} alt={logoAlt} className="login-logo" />
                <h2>Welcome</h2>
                <p>{loginText}</p>
                <form onSubmit={handleLogin}>
                    <label htmlFor="username">User Name*</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        aria-describedby={error ? "login-error" : undefined}
                        required
                    />
                    <label htmlFor="password">Password*</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        aria-describedby={error ? "login-error" : undefined}
                        required
                    />

                    {error && (
                        <p id="login-error" className="error-message" role="alert" aria-live="assertive">
                            {error}
                        </p>
                    )}
                    <button type="submit">Continue</button>
                </form>
                <p className="RequestLogin">
                    <button
                        type="button"
                        onClick={() => {
                            window.open(
                                'https://forms.office.com/Pages/ResponsePage.aspx?id=HZ6K1cpNlUWp6Hk0oV80GRcTERVASNVEmqyTtKGGoIpUMFBLTVpIMlFTQjBORExHM1Q4MElMREVYRy4u',
                                '_blank',
                                'noopener,noreferrer'
                            );
                        }}
                    >
                        Request Access to this App
                    </button>
                </p>

            </div>
        </div>
    );
};

export default Login;
