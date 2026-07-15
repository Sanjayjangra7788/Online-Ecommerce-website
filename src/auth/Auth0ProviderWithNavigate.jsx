// src/auth/Auth0ProviderWithNavigate.jsx

import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { auth0Config } from "./auth0Config";

function Auth0ProviderWithNavigate({ children }) {
  const navigate = useNavigate();

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || "/");
  };

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={auth0Config.authorizationParams}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}

export default Auth0ProviderWithNavigate;
