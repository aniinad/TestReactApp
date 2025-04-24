import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from '@azure/msal-browser';
import { MsalProvider, useMsal, useAccount } from '@azure/msal-react';
import { msalConfig, loginRequest } from '../authConfig';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Create a context for authentication
interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getAccessToken: () => Promise<string>;
    isInitialized: boolean;
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
    return (
        <MsalProvider instance={msalInstance}>
            <AuthContextProvider>{children}</AuthContextProvider>
        </MsalProvider>
    );
};

// Inner component that provides the auth context
const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [isInitialized, setIsInitialized] = useState(false);
    const [isAutoLoginAttempted, setIsAutoLoginAttempted] = useState(false);

    // Define isAuthenticated before it's used in the useEffect
    const isAuthenticated = !!account;

    // Initialize MSAL
    useEffect(() => {
        const initializeMsal = async () => {
            try {
                // Initialize MSAL
                await instance.initialize();

                // Default to using the first account if no active account is set on the MSAL instance
                if (!instance.getActiveAccount() && instance.getAllAccounts().length > 0) {
                    // Account selection logic is app dependent. Adjust as needed for your use case.
                    instance.setActiveAccount(instance.getAllAccounts()[0]);
                }

                // Optional - This will update account state if a user signs in from another tab or window
                instance.addEventCallback((event: EventMessage) => {
                    if (event.eventType === EventType.LOGIN_SUCCESS) {
                        const result = event.payload as AuthenticationResult;
                        instance.setActiveAccount(result.account);
                    }
                });

                setIsInitialized(true);
            } catch (error) {
                console.error('MSAL initialization failed:', error);
            }
        };

        initializeMsal();
    }, [instance]);

    // Auto-login effect
    useEffect(() => {
        const autoLogin = async () => {
            // Only attempt auto-login once and when MSAL is initialized
            if (isInitialized && !isAuthenticated && !isAutoLoginAttempted) {
                try {
                    setIsAutoLoginAttempted(true);
                    console.log('Attempting automatic login...');
                    await login();
                } catch (error) {
                    console.error('Automatic login failed:', error);
                }
            }
        };

        autoLogin();
    }, [isInitialized, isAuthenticated, isAutoLoginAttempted]);

    const login = async () => {
        try {
            await instance.loginPopup(loginRequest);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await instance.logoutPopup();
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    const getAccessToken = async (): Promise<string> => {
        try {
            if (!account) {
                throw new Error('No active account! Verify a user has been signed in and setActiveAccount has been called.');
            }

            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: account
            });

            return response.accessToken;
        } catch (error) {
            console.error('Error acquiring token:', error);
            // If silent token acquisition fails, try interactive method
            const response = await instance.acquireTokenPopup(loginRequest);
            return response.accessToken;
        }
    };

    const value = {
        isAuthenticated,
        user: account,
        login,
        logout,
        getAccessToken,
        isInitialized
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 