import React from 'react';
import { Route, redirect } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
    component: React.ComponentType<any>;
}

const ProtectedRoute = ({component: Component, ...rest }: ProtectedRouteProps) => {
    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            component={(props: any) => {
                currentUser ? <Component {...props} /> : redirect('/auth/signin')
            }}
         />
    )
}