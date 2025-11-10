import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

/**
 * Higher-Order Component to check authentication and roles.
 * 
 * @param {React.Component} WrappedComponent - The component to wrap.
 * @returns {React.Component} - The wrapped component with role validation.
 */
export const withRoleValidation = (WrappedComponent) => {
    return (props) => {
        const location = useLocation();
        const token = Cookies.get('token');
        const appName = import.meta.env.VITE_APP_NAME;

        let userRoles = token ? jwtDecode(token)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [] : [];

        // Ensure userRoles is an array
        if (typeof userRoles === 'string') {
            userRoles = [userRoles];
        }

        const isAuthenticated = !!token;
        const lowerCaseUserRoles = userRoles.map(role => role.toLowerCase());

        const requiredRoles = [
            `${appName}_user`,
            `${appName}_admin`,
            `all_user`,
            `all_admin`
        ];

        const hasRequiredRole = lowerCaseUserRoles.some(role => requiredRoles.includes(role));

        if (!isAuthenticated) {
            return <Navigate to="/login" state={{ from: location }} />;
        }

        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" state={{ from: location }} />;
        }

        return <WrappedComponent {...props} />;
    };
};