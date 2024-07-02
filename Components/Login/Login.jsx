import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import './Login.css'; // Import the CSS file

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const appContext = useAppContext();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await fetch(`https://localhost:7127/api/webusers/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const jwtToken = data.token;
            console.log(jwtToken,"jwtToken")
            // Decode the JWT token to get the roles
            const decodedToken = jwtDecode(jwtToken);
            const userRoles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];

            console.log('Decoded Token:', decodedToken);
            console.log('User Roles:', userRoles);

            //const userRoles = decodedToken.role || [];
            //console.log(userRoles)
            // Define the valid roles
            const validRoles = ["All_Admin", "All_superuser_role", "All_User", "SecurityAdmin_Admin"];

            // Check if the user has at least one valid role
            const hasValidRole = userRoles.some(role => validRoles.includes(role));

            if (!hasValidRole) {
                navigate('/unauthorized');
                return;
            }

            // Store the JWT token in a cookie with 1 hour expiration time
            Cookies.set('token', jwtToken, { expires: 1 / 24, secure: true });

            // Redirect to the home page
            navigate('/home');

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
            </div>
        </div>
    );
};

export default Login;
