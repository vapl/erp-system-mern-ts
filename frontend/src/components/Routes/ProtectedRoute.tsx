import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

interface ProtectedRouteProps {
    element: React.ReactElement,
    accessRole?: string[],
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    element,
    accessRole,
}) => {    
    const { isAuthenticated, user } = useContext(AuthContext);

    if (!isAuthenticated) {
        <Navigate to='/auth/signin' />;
        return element;
    }

    if (!accessRole?.includes(user?.role || '')) {
        return <Navigate to='/' />;
    }

    return element;
};

export default ProtectedRoute;