// Small helpers for reading the current user's roles from the JWT cookie. The user object
// in AuthContext is only populated at login (not rehydrated on refresh), so role checks
// that must survive a reload read the token directly, as the route guard and navbar do.

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

/**
 * Returns the current user's roles (lower-cased) from the JWT cookie, or an empty array
 * when there is no valid token.
 *
 * @returns {Array<string>} The lower-cased role names.
 */
export function getUserRoles() {
  const token = Cookies.get("token");
  if (!token) return [];
  let roles;
  try {
    roles = jwtDecode(token)[ROLE_CLAIM] || [];
  } catch {
    return [];
  }
  if (typeof roles === "string") roles = [roles];
  return roles.map((r) => String(r).toLowerCase());
}

/**
 * Whether the current user holds the given role (case-insensitive).
 *
 * @param {string} role - The role name to check.
 * @returns {boolean} True if the user has the role.
 */
export function hasRole(role) {
  if (!role) return false;
  return getUserRoles().includes(String(role).toLowerCase());
}

/**
 * Whether the current user is an admin of the given app — holds `<app>_admin` or the
 * cross-app `all_admin`. Admins have full (view + edit) access.
 *
 * @param {string} app - The app name (e.g. "rmap").
 * @returns {boolean} True if the user is an admin of the app.
 */
export function isAppAdmin(app) {
  return hasRole(`${app}_admin`) || hasRole("all_admin");
}

/**
 * Whether the current user is a superuser of the given app — holds `<app>_superuser` or
 * the cross-app `all_superuser`. Superusers have view-only access.
 *
 * @param {string} app - The app name (e.g. "rmap").
 * @returns {boolean} True if the user is a superuser of the app.
 */
export function isAppSuperuser(app) {
  return hasRole(`${app}_superuser`) || hasRole("all_superuser");
}
