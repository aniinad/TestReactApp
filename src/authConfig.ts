import { Configuration, PopupRequest } from "@azure/msal-browser";

// Azure AD app registration configuration
export const msalConfig: Configuration = {
    auth: {
        clientId: process.env.REACT_APP_AZURE_AD_CLIENT_ID || "YOUR_CLIENT_ID",
        authority: process.env.REACT_APP_AZURE_AD_AUTHORITY || "https://login.microsoftonline.com/YOUR_TENANT_ID",
        redirectUri: window.location.origin, // Default redirect URI is the current page
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
    scopes: ["User.Read", process.env.REACT_APP_API_SCOPE || "api://YOUR_API_ID/access_as_user"]
};

// Add here the endpoints for MS Graph API services you'd like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};

// Add here scopes for access token to be used at MS Graph API endpoints.
export const graphRequest = {
    scopes: ["User.Read", "Mail.Read"]
}; 