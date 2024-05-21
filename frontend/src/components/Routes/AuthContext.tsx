import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as OrdersApi from '../../network/users_api';
import { User } from '../../models/user';

type AuthContextType = {
    isAuthenticated: boolean,
    user: User | null,
    login: () => void,
    logout: () => void,
    updateUser: (updatedUser: User | null) => void,
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: () => {},
    logout: () => {},
    updateUser: () => {},
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
    }, [isAuthenticated]);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        OrdersApi.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    const updateUser = (updatedUser: User | null) => {
        setUser(updatedUser)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;