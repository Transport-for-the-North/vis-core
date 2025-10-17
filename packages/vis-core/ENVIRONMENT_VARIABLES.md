# Environment Variables for vis-core

This package is designed to work with Vite's environment variable system using the standard `import.meta.env` API.

## Vite Environment Variables

Vite uses the `VITE_` prefix for environment variables that should be exposed to the client-side code. The following environment variables are supported:

### Required Variables

- `VITE_MAP_API_TOKEN` - API token for map services (Geoapify, OS Maps, etc.)
- `VITE_APP_NAME` - Name of the application

### Optional Variables

- `VITE_PROD_OR_DEV` - Environment mode (default: "development")
- `VITE_API_BASE_DOMAIN` - Production API base URL
- `VITE_API_BASE_DOMAIN_DEV` - Development API base URL
- `VITE_PUBLIC_URL` - Public URL for assets (usually empty for Vite apps)

### Deprecated Variables (Not Used)

- `VITE_AUTH0_DOMAIN` - Auth0 domain (deprecated, not used)
- `VITE_AUTH0_CLIENT_ID` - Auth0 client ID (deprecated, not used)

## Usage in Your Vite App

1. Create a `.env.local` file in your Vite app root
2. Add your environment variables with the `VITE_` prefix:

```bash
VITE_MAP_API_TOKEN=your_map_api_token_here
VITE_APP_NAME=your_app_name_here
VITE_PROD_OR_DEV=development
VITE_API_BASE_DOMAIN=https://your-production-api.com
VITE_API_BASE_DOMAIN_DEV=https://your-dev-api.com
```

## How It Works

The package uses Vite's standard `import.meta.env` API directly:

```javascript
// Map API token
const apiToken = import.meta.env.VITE_MAP_API_TOKEN;

// App name
const appName = import.meta.env.VITE_APP_NAME;

// Environment mode
const isDev = import.meta.env.VITE_PROD_OR_DEV === 'development';
```

## Authentication

**Note:** This package uses a custom JWT-based authentication system, not Auth0. The authentication is handled through the `AuthProvider` component which communicates with your API's `/api/webusers/login` endpoint. 

The Auth0 provider code is preserved in `src/contexts/auth0-provider-with-history.jsx` for reference but is deprecated and not used. If you need Auth0 authentication, you would need to implement it separately.