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
            <p>You do not have permission to view this page.</p>
        </div>
    );
};

export default Unauthorized;