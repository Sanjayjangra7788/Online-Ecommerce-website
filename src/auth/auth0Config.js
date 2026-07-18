// ============================================================
// AUTH0 CONFIGURATION
// Credentials are loaded from .env (never hardcode in source)
// .env variables must be prefixed with VITE_ to be exposed
// ============================================================

export const auth0Config = {
  domain:   import.meta.env.VITE_AUTH0_DOMAIN,
  // clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  clientId: 'GWkDcvlG6OKUYmi3H6TNdqM0vlV3OyL2',

  authorizationParams: {
    redirect_uri: window.location.origin,
  },
};
