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
    const [cachedToken, setCachedToken] = useState<string | null>(null);
    const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already signed in
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            setUser(accounts[0]);
            setIsAuthenticated(true);
            // Get initial token
            getAccessToken().then(token => {
                setCachedToken(token);
                // Set token expiration (typically 1 hour from now)
                setTokenExpiration(Date.now() + 3600000);
            });
        }

        // Add event callback for handling redirects
        const callbackId = msalInstance.addEventCallback((event: EventMessage) => {
            if (event.eventType === EventType.LOGIN_SUCCESS) {
                const result = event.payload as AuthenticationResult;
                if (result.account) {
                    setUser(result.account);
                    setIsAuthenticated(true);
                    // Get token after successful login
                    getAccessToken().then(token => {
                        setCachedToken(token);
                        setTokenExpiration(Date.now() + 3600000);
                    });
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
            // loginRedirect doesn't return a response because it redirects the page
            await msalInstance.loginRedirect(loginRequest);
            // The response will be handled in the event callback
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        msalInstance.logoutRedirect();
        setUser(null);
        setIsAuthenticated(false);
        setCachedToken(null);
        setTokenExpiration(null);
    };

    const getAccessToken = async (): Promise<string> => {
        try {
            // Check if we have a valid cached token
            if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
                return cachedToken;
            }

            const account = msalInstance.getAllAccounts()[0];
            if (!account) {
                throw new Error('No active account');
            }

            const response = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: account
            });

            // Cache the new token
            setCachedToken(response.accessToken);
            setTokenExpiration(Date.now() + 3600000); // 1 hour from now

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