import React, { ReactNode, useMemo } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { ReactElement } from 'react';
import { config } from './config';
import { ThemeContainer } from './components/ThemeContainer';

function AuthContainer({ children }: { children: ReactElement }) {
  const { auth0Config } = config;

  const auth0ProviderProperties = useMemo(() => {
    if (!auth0Config.domain || !auth0Config.clientId) {
      console.warn(
        'Wrong auth0 configuration. Please check environment variables.',
      );
    }

    return {
      domain: auth0Config.domain ?? '',
      clientId: auth0Config.clientId ?? '',
      redirectUri: window.location.origin,
    };
  }, [auth0Config]);

  return <Auth0Provider {...auth0ProviderProperties}>{children}</Auth0Provider>;
}

export function AppContainer({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <AuthContainer>
      <ThemeContainer>{children}</ThemeContainer>
    </AuthContainer>
  );
}
