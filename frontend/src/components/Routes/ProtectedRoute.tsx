import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { getLoggedInUser } from '../../network/orders_api';

interface ProtectedRouteProps {
    path: string;
    element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({path, element, ...rest }) => {
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getLoggedInUser();                
                setLoggedIn(!!user);
            } catch (error) {
                console.error(error);                
            } finally {
                setLoggedIn(false);
            }
        };
        checkAuth();
    }, []);

    if (loggedIn === null) {
        console.log("loading...");
        return <div>Loading...</div>;
    };
    
    if (!loggedIn) {
        return <Navigate to='/auth/signin' />
    };

    return <Route {...rest} path={path} element={element} />
};

export default ProtectedRoute;