import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { getAppName } from '../runtime';

/**
 * Higher-Order Component to check authentication and roles.
 *
 * @param {React.Component} WrappedComponent - The component to wrap.
 * @param {Object} [options]
 * @param {boolean} [options.adminOnly=false] - When true, only admin roles are accepted.
 * @returns {React.Component} - The wrapped component with role validation.
 */
export const withRoleValidation = (WrappedComponent, { adminOnly = false } = {}) => {
    return (props) => {
        const location = useLocation();
        const token = Cookies.get('token');
        const appName = getAppName();

        let userRoles = token ? jwtDecode(token)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [] : [];

        // Ensure userRoles is an array
        if (typeof userRoles === 'string') {
            userRoles = [userRoles];
        }

        const isAuthenticated = !!token;
        const lowerCaseUserRoles = userRoles.map(role => role.toLowerCase());

        // appName is lower-cased to match the (already lower-cased) user roles.
        const lowerAppName = (appName || '').toLowerCase();
        // Admins (full access) and superusers (view-only) of THIS app, plus their cross-app
        // equivalents. Another app's roles are NOT accepted.
        const adminRoles = [`${lowerAppName}_admin`, 'all_admin'];
        const superuserRoles = [`${lowerAppName}_superuser`, 'all_superuser'];
        // Admin-only pages admit admins and superusers of this app.
        const adminAccessRoles = [...adminRoles, ...superuserRoles];
        // General (non-admin) app access allows this app's user/admin/superuser plus the
        // cross-app `all_*` roles.
        const appRoles = [`${lowerAppName}_user`, 'all_user', ...adminAccessRoles];

        const hasRequiredRole = adminOnly
            ? lowerCaseUserRoles.some(role => adminAccessRoles.includes(role))
            : lowerCaseUserRoles.some(role => appRoles.includes(role));

        if (!isAuthenticated) {
            return <Navigate to="/login" state={{ from: location }} />;
        }

        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" state={{ from: location }} />;
        }

        return <WrappedComponent {...props} />;
    };
};