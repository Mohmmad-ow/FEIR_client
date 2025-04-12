import { is } from "@electron-toolkit/utils";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface UserData {
    username: string;
    access_token: string;
    isAdmin?: boolean;
    fullname?: string;
}

interface AuthContextType {
    user: UserData | null;
    login: (token: string, username: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    addMissingUserData: (username: string, fullname: string, isAdmin: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);

    // Check for stored user data on mount
    useEffect(() => {
        const storedData = localStorage.getItem("userData");
        if (storedData) {
            setUser(JSON.parse(storedData));
        }
    }, []);

    // Login function
    const login = (token: string, username: string) => {
        const userData = { access_token: token, username };
        setUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        window.location.href = "/";
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem("userData");
        window.location.href = "/login";
    };

    const addMissingUserData = async (username: string, fullname: string, isAdmin: boolean) => {
        setUser((prevUser) => {
            if (prevUser) {
                const updatedUser = { ...prevUser, username, fullname, isAdmin };
                localStorage.setItem("userData", JSON.stringify(updatedUser));
                return updatedUser;
            }
            return prevUser;
        });
    }

    return (
        <AuthContext.Provider
            value={{ user, login, logout, isAuthenticated: !!user, addMissingUserData }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
}