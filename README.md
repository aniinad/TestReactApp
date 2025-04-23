# React App with MSAL Authentication

This React application demonstrates how to implement Microsoft Authentication Library (MSAL) for Azure AD authentication and make authenticated API calls.

## Features

- Azure AD authentication using MSAL
- Protected routes that require authentication
- API calls with automatic token handling
- User profile information display
- Login/logout functionality

## Prerequisites

- Node.js and npm
- Azure AD tenant
- Registered application in Azure AD

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_AZURE_AD_CLIENT_ID=YOUR_CLIENT_ID
   REACT_APP_AZURE_AD_TENANT_ID=YOUR_TENANT_ID
   REACT_APP_AZURE_AD_AUTHORITY=https://login.microsoftonline.com/YOUR_TENANT_ID
   REACT_APP_API_BASE_URL=https://your-api-url.com
   REACT_APP_API_SCOPE=api://YOUR_API_ID/access_as_user
   ```
4. Replace the placeholder values with your actual Azure AD configuration

## Azure AD Configuration

1. Register a new application in Azure AD:
   - Go to Azure Portal > Azure Active Directory > App registrations > New registration
   - Enter a name for your application
   - Select "Single tenant" for Supported account types
   - Click "Register"

2. Configure authentication:
   - Go to Authentication > Add a platform > Single-page application
   - Add your redirect URI (e.g., http://localhost:3000)
   - Enable "Access tokens" and "ID tokens" under "Implicit grant and hybrid flows"
   - Click "Save"

3. Configure API permissions:
   - Go to API permissions
   - Add Microsoft Graph permissions (e.g., User.Read)
   - Add your custom API permissions if needed
   - Click "Grant admin consent"

4. Create a client secret:
   - Go to Certificates & secrets > New client secret
   - Enter a description and select an expiration
   - Copy the generated secret value (you won't be able to see it again)

## Running the Application

1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and navigate to http://localhost:3000
3. Click "Login" to authenticate with Azure AD
4. After successful authentication, you'll be redirected to the home page

## Making Authenticated API Calls

The application includes a custom hook `useApiService` that automatically handles authentication for API calls. Here's how to use it:

```tsx
import { useApiService } from '../services/apiService';

const MyComponent = () => {
  const apiService = useApiService();
  
  const fetchData = async () => {
    try {
      const data = await apiService.get('https://api.example.com/data');
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return (
    <button onClick={fetchData}>Fetch Data</button>
  );
};
```

## Project Structure

- `src/authConfig.ts`: MSAL configuration
- `src/auth/AuthProvider.tsx`: Authentication context provider
- `src/components/Login.tsx`: Login component
- `src/components/ProtectedRoute.tsx`: Protected route component
- `src/services/apiService.ts`: API service with authentication
- `src/components/ApiExample.tsx`: Example component demonstrating API calls

## Troubleshooting

- **Authentication Issues**: Check your Azure AD configuration and make sure the redirect URI is correct
- **Token Issues**: Verify that the required permissions are granted and admin consent is provided
- **API Call Issues**: Check the network tab in your browser's developer tools for detailed error messages

## Additional Resources

- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [React Documentation](https://reactjs.org/docs/getting-started.html) 