import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult, AccountInfo } from '@azure/msal-browser';
import { MsalProvider, useMsal, useAccount } from '@azure/msal-react';
import { msalConfig, loginRequest } from '../authConfig';
import { useNavigate } from 'react-router-dom';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Extend AccountInfo with additional properties
interface ExtendedAccountInfo extends AccountInfo {
    userPrincipalName?: string;
    authenticationMethods?: string[];
}

// Create a context for authentication
interface AuthContextType {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: ExtendedAccountInfo | null;
    login: () => Promise<void>;
    logout: () => void;
    getAccessToken: () => Promise<string>;
    redirectTo: (path: string) => void;
    role: string;
    setRole: (role: string) => void;
    originalRole: string;
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
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [user, setUser] = useState<ExtendedAccountInfo | null>(null);
    const [cachedToken, setCachedToken] = useState<string | null>(null);
    const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);
    const [role, setRole] = useState<string>('User');
    const [originalRole, setOriginalRole] = useState<string>('User');
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                console.log('Starting auth initialization...');

                // Initialize MSAL
                await msalInstance.initialize();
                console.log('MSAL initialized successfully');

                // Handle redirect promise
                const response = await msalInstance.handleRedirectPromise();
                console.log('Redirect response:', response);

                // Check if user is already signed in
                const accounts = msalInstance.getAllAccounts();
                console.log('Available accounts:', accounts);

                if (accounts.length > 0) {
                    const account = accounts[0] as ExtendedAccountInfo;
                    console.log('Setting user account:', account);
                    setUser(account);
                    setIsAuthenticated(true);
                    // Get initial token
                    const token = await getAccessToken();
                    setCachedToken(token);
                    // Set token expiration (typically 1 hour from now)
                    setTokenExpiration(Date.now() + 3600000);
                } else {
                    console.log('No accounts found, triggering login...');
                    // If no accounts found, trigger login
                    await login();
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // If there's an error, try to login
                try {
                    await login();
                } catch (loginError) {
                    console.error('Error during login:', loginError);
                }
            } finally {
                setIsInitialized(true);
            }
        };

        initializeAuth();

        // Add event callback for handling redirects
        const callbackId = msalInstance.addEventCallback((event: EventMessage) => {
            console.log('MSAL Event:', event.eventType);
            if (event.eventType === EventType.LOGIN_SUCCESS) {
                const result = event.payload as AuthenticationResult;
                console.log('Login success result:', result);
                if (result.account) {
                    const account = result.account as ExtendedAccountInfo;
                    setUser(account);
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
            // Check if we're already logged in
            const accounts = msalInstance.getAllAccounts();
            console.log('Login check - Available accounts:', accounts);

            if (accounts.length > 0) {
                const account = accounts[0] as ExtendedAccountInfo;
                setUser(account);
                setIsAuthenticated(true);
                return;
            }

            // If not logged in, redirect to Microsoft login
            console.log('Redirecting to login...');
            try {
                await msalInstance.loginRedirect(loginRequest);
            } catch (error: unknown) {
                // If it's a BrowserAuthError, it's likely because we're already in a redirect flow
                if (error instanceof Error && error.name === 'BrowserAuthError') {
                    console.log('BrowserAuthError caught - likely already in redirect flow');
                    return;
                }
                throw error;
            }
        } catch (error: unknown) {
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
                console.log('Using cached token');
                return cachedToken;
            }

            console.log('Getting new token...');
            const account = msalInstance.getAllAccounts()[0];
            if (!account) {
                console.error('No active account found');
                throw new Error('No active account');
            }

            try {
                const response = await msalInstance.acquireTokenSilent({
                    ...loginRequest,
                    account: account
                });

                console.log('Token acquired successfully');
                // Cache the new token
                setCachedToken(response.accessToken);
                setTokenExpiration(Date.now() + 3600000); // 1 hour from now

                return response.accessToken;
            } catch (silentError) {
                console.log('Silent token acquisition failed, trying popup...');
                // If silent token acquisition fails, try popup
                const response = await msalInstance.acquireTokenPopup({
                    ...loginRequest,
                    account: account
                });

                console.log('Token acquired via popup');
                // Cache the new token
                setCachedToken(response.accessToken);
                setTokenExpiration(Date.now() + 3600000); // 1 hour from now

                return response.accessToken;
            }
        } catch (error) {
            console.error('Error getting access token:', error);
            // If all token acquisition methods fail, trigger a new login
            await login();
            throw error;
        }
    };

    const redirectTo = (path: string) => {
        navigate(path);
    };

    const value = {
        isAuthenticated,
        isInitialized,
        user,
        login,
        logout,
        getAccessToken,
        redirectTo,
        role,
        setRole,
        originalRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 