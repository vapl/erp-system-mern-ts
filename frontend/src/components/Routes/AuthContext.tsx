import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const AuthContext = createContext<string>('');

export const AuthProvider = ({ children }: { children: ReactNode}) => {
    const [currentUser, setCurrentUser] = useState<string>('');

   // šeit varētu būt kodu, kas iegūst pašreizējo lietotāju no back-end vai localStorage utt.
    useEffect(() => {
        
        // šeit varētu būt kodu, kas pārbauda vai lietotājs ir pieslēdzies, ja jūsu back-end to atbalsta
        // un iestata atbilstoši setCurrentUser vērtību
    }, []);

    return (
        <AuthContext.Provider value={ currentUser }>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);