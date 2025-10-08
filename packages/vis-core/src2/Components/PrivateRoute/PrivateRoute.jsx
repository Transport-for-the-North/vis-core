import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

export const getRoleFromToken = (token) => {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
};

export const PrivateRoute = ({ element: Component, requiredRole, ...rest }) => {
    const token = Cookies.get('token');
    const userRole = getRoleFromToken(token);
    const isAuthenticated = !!token;
    const hasRequiredRole = requiredRole ? userRole === requiredRole : true;
    const location = useLocation();

    return isAuthenticated && hasRequiredRole ? (
        Component
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    );
};

export default PrivateRoute;
