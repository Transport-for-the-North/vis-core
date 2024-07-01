import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getRolesFromToken } from '../../utils/auth';

/**
 * Higher-Order Component to check authentication and roles.
 * 
 * @param {React.Component} WrappedComponent - The component to wrap.
 * @param {Array<string>} requiredRoles - The roles required to access the component.
 * @returns {React.Component} - The wrapped component with role validation.
 */
export const RoleValidation = (WrappedComponent, requiredRoles = []) => {
    return (props) => {
        const token = Cookies.get('token');
        const userRoles = getRolesFromToken(token) || [];
        const isAuthenticated = !!token;
        const hasRequiredRole = requiredRoles.length === 0 || userRoles.some(role => requiredRoles.includes(role));

        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }

        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" />;
        }

        return <WrappedComponent {...props} />;
    };
};

export default RoleValidation;