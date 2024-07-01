import Cookies from 'js-cookie';

export const getRolesFromToken = () => {
    const token = Cookies.get('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.roles || [];  // Assuming roles are stored in an array in the token
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};