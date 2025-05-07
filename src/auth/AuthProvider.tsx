import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult, AccountInfo } from '@azure/msal-browser';
import { MsalProvider, useMsal, useAccount } from '@azure/msal-react';
import { msalConfig, loginRequest } from '../authConfig';
import { useNavigate } from 'react-router-dom';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Create a context for authentication
interface AuthContextType {
    isAuthenticated: boolean;
    user: AccountInfo | null;
    login: () => Promise<void>;
    logout: () => void;
    getAccessToken: () => Promise<string>;
    redirectTo: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<AccountInfo | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already signed in
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            setUser(accounts[0]);
            setIsAuthenticated(true);
        }

        // Add event callback for handling redirects
        const callbackId = msalInstance.addEventCallback((event: EventMessage) => {
            if (event.eventType === EventType.LOGIN_SUCCESS) {
                const account = event.payload?.account;
                if (account) {
                    setUser(account);
                    setIsAuthenticated(true);
                }
            }
        });

        return () => {
            if (callbackId) {
                msalInstance.removeEventCallback(callbackId);
            }
        };
    }, []);

    const login = async () => {
        try {
            const response = await msalInstance.loginRedirect(loginRequest);
            if (response) {
                setUser(response.account);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        msalInstance.logoutRedirect();
        setUser(null);
        setIsAuthenticated(false);
    };

    const getAccessToken = async (): Promise<string> => {
        try {
            const account = msalInstance.getAllAccounts()[0];
            if (!account) {
                throw new Error('No active account');
            }

            const response = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: account
            });

            return response.accessToken;
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    };

    const redirectTo = (path: string) => {
        navigate(path);
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        getAccessToken,
        redirectTo
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 