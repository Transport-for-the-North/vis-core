import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

/**
 * Higher-Order Component to check authentication and roles.
 * 
 * @param {React.Component} WrappedComponent - The component to wrap.
 * @param {Array<string>} requiredRoles - The roles required to access the component.
 * @returns {React.Component} - The wrapped component with role validation.
 */
export const RoleValidation = ({ component: WrappedComponent, requiredRoles = [] }) => {
    const location = useLocation();
    console.log("location", location)
    const token = Cookies.get('token');
    console.log("token in role validation", token)
    const userRoles = token ? jwtDecode(token)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [] : [];
    console.log("token in userRoles", userRoles)
    const isAuthenticated = !!token;
    const hasRequiredRole = requiredRoles.length === 0 || userRoles.some(role => requiredRoles.includes(role));

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" state={{ from: location }} />;
    }

    return <WrappedComponent />;
};

export default RoleValidation;
