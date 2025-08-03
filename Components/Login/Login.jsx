import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "contexts/AuthProvider";
import './Login.css';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { loginAction } = useAuth();

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
                <img src='/img/tfn-logo-fullsize.png' alt="Transport for the North" className="login-logo" />
                <h2>Welcome</h2>
                <p>Log in to Transport for the North to continue to the Appraisal Platform.</p>
                <form onSubmit={handleLogin}>
                    <label htmlFor="username">User Name*</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password*</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Continue</button>
                </form>
                <p className="Request Login">
                    <a 
                        href='https://forms.office.com/Pages/ResponsePage.aspx?id=HZ6K1cpNlUWp6Hk0oV80GRcTERVASNVEmqyTtKGGoIpUMFBLTVpIMlFTQjBORExHM1Q4MElMREVYRy4u'
                        target='_blank'
                        rel='noopener noref'
                    > 
                        Request a login 
                        
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
