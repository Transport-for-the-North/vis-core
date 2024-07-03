import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement

/**
 * Higher-Order Component to check authentication and roles.
 * 
 * @param {React.Component} WrappedComponent - The component to wrap.
 * @returns {React.Component} - The wrapped component with role validation.
 */
export const RoleValidation = ({ component: WrappedComponent }) => {
    const location = useLocation();
    const token = Cookies.get('token');
    const appName = process.env.REACT_APP_NAME;
    console.log("AppName in RoleValidation", appName);

    const userRoles = token ? jwtDecode(token)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [] : [];
    const isAuthenticated = !!token;

    // Define dynamic required roles based on the app name
    const requiredRoles = [
        `${appName}_User`,
        `${appName}_Admin`,
        `All_User`,
        `All_Admin`
    ];

    const hasRequiredRole = userRoles.some(role => requiredRoles.includes(role));

    console.log("isAuthenticated", isAuthenticated);
    console.log("userRoles", userRoles);
    console.log("requiredRoles", requiredRoles);
    console.log("hasRequiredRole", hasRequiredRole);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" state={{ from: location }} />;
    }

    return <WrappedComponent />;
};

export default RoleValidation;
