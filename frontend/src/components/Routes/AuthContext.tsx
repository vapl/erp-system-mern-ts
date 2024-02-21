import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const AuthContext = createContext<string>('');


export const AuthProvider = ({ children }: { children: ReactNode}) => {
    const [currentUser, setCurrentUser] = useState<string>('');
    
    const fetchCurrentUser = async () => {
        console.log(currentUser);

        try {
            const response = await fetch('http://localhost:5000/api/users/currentUser', {
                method: 'GET',
                credentials: 'include',
                headers: {'ContentType': 'application/json'}                
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const user = await response.json();
            setCurrentUser(user.userId);
            
        } catch (error) {
            console.error('Error fetching authenticated user', error)
        }
    };    

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    return (
        <AuthContext.Provider value={ currentUser }>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);
