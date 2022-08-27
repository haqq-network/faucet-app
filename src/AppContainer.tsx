import React, { ReactNode } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { ReactElement, useMemo } from 'react';
import { useConfig } from './hooks/useConfig';
import { ThemeContainer } from './components/ThemeContainer';

// function AuthContainer({ children }: { children: ReactElement }) {
//   // const { auth0Config } = useConfig();

//   const auth0ProviderProperties = useMemo(() => {
//     if (!auth0Config.domain || !auth0Config.clientId) {
//       console.warn(
//         'Wrong auth0 configuration. Please check environment variables.',
//       );
//     }

//     return {
//       domain: auth0Config.domain ?? '',
//       clientId: auth0Config.clientId ?? '',
//       redirectUri: window.location.origin,
//     };
//   }, [auth0Config]);

//   return <Auth0Provider {...auth0ProviderProperties}>{children}</Auth0Provider>;
// }

export function AppContainer({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <div>
      <ThemeContainer>{children}</ThemeContainer>
    </div>
  );
}
