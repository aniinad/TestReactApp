import React, { createContext, useContext, ReactNode } from 'react';
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from '@azure/msal-browser';
import { MsalProvider, useMsal, useAccount } from '@azure/msal-react';
import { msalConfig, loginRequest } from '../authConfig';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no active account is set on the MSAL instance
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for your use case.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Optional - This will update account state if a user signs in from another tab or window
msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS) {
        const result = event.payload as AuthenticationResult;
        msalInstance.setActiveAccount(result.account);
    }
});

// Create a context for authentication
interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getAccessToken: () => Promise<string>;
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

    const isAuthenticated = !!account;

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
        getAccessToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 