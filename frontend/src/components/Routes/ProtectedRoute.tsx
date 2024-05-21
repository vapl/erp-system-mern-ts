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
        return <Navigate to='/auth/signin' replace/>;
    };

    if (accessRole?.includes(user?.role || '')) {
        return element;
    };
};

export default ProtectedRoute;