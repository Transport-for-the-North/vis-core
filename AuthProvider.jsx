import React, { useContext, createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Correct the import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(Cookies.get('token') || '');
    const navigate = useNavigate();

    const loginAction = async (username, password) => {
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

            // Decode the JWT token to get the roles
            const decodedToken = jwtDecode(jwtToken);
            const userRoles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];

            setUser({ username, roles: userRoles });
            setToken(jwtToken);
            Cookies.set('token', jwtToken, { expires: 1 / 24, secure: true, sameSite: 'Lax' });
            navigate('/');
        } catch (err) {
            console.error('Login failed:', err);
            throw err;
        }
    };

    const logOut = () => {
        setUser(null);
        setToken('');
        Cookies.remove('token');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};