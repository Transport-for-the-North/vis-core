import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

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
            const validRoles = ['user', 'admin', 'NoHAM_user'];

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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
