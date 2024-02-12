import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
    component: React.ComponentType<any>;
}

const ProtectedRoute = ({component: Component, ...rest }: ProtectedRouteProps) => {
    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            render={(props: RouteProps<any>) => {
                return currentUser ? <Component {...props} /> : <Redirect to='/auth/signin'
            }}
         />
    )
}