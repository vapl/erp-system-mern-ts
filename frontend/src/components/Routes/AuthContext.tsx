import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as OrdersApi from '../../network/orders_api';
import { User } from '../../models/user';

type AuthContextType = {
    isAuthenticated: boolean,
    user: User | null,
    login: () => void,
    logout: () => void,
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: () => {},
    logout: () => {},
})

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);    

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const loggedInUser = await OrdersApi.getLoggedInUser();
                setUser(loggedInUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error(error);
            }
        };
        checkAuth();
    }, []);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        OrdersApi.logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;