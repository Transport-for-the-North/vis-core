import React from 'react';

/**
 * Unauthorized component displays an unauthorized access message.
 * 
 * @component
 * @returns {JSX.Element} The JSX element representing the Unauthorized page.
 */
export const Unauthorized = () => {
    return (
        <div>
            <h1>Unauthorized</h1>
            <p>You are not authorised to access this app.</p>
            <p>If you believe this is an error, please contact someone@transportforthenorth.com</p>
        </div>
    );
};

export default Unauthorized;