import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [user_id, setUser_id] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    console.log("Token expired, logging out.");
                    logout();
                } else {
                    setUser_id(decoded.user_id);
                    setUser(decoded);
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
    }, [setUser, setUser_id, setIsLoggedIn, user_id]);

    const login = (userData, token) => {
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                throw new Error("Expired token received.");
            }
            console.log("Token is valid, storing...");

            localStorage.setItem("authToken", token);
            localStorage.setItem("user_id", userData.id);

            setIsLoggedIn(true);
            setUser(decoded);
            setUser_id(userData.id);
            console.log('User ID after login:', userData.id);
        } catch (error) {
            console.error("Invalid token:", error);
            alert("Login failed: Invalid session token.");
            logout();
        }
    };

    const logout = () => {
        console.log("Logging out...");
        setIsLoggedIn(false);
        setUser(null);
        setUser_id(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user_id");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, user_id, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
