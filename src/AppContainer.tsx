import React, { ReactElement, ReactNode, useMemo } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import {
  Chain,
  configureChains,
  Connector,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { config, getChain } from './config';
import { ThemeContainer } from './components/ThemeContainer';

const { auth0Config } = config;
const chain = getChain();

function AuthContainer({ children }: { children: ReactElement }) {
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
  }, []);

  return <Auth0Provider {...auth0ProviderProperties}>{children}</Auth0Provider>;
}

function WagmiContainer({ children }: { children: ReactElement }) {
  const { provider, webSocketProvider, chains } = useMemo(() => {
    return configureChains(
      [chain as Chain],
      [
        jsonRpcProvider({
          rpc: (chain: Chain) => {
            return {
              http: chain.rpcUrls.default,
            };
          },
        }),
      ],
    );
  }, []);

  const connectors = useMemo(() => {
    return [
      new WalletConnectConnector({
        chains,
        options: {},
      }),
      new InjectedConnector({
        chains,
      }),
    ];
  }, [chains]);

  const client = useMemo(() => {
    return createClient({
      provider,
      webSocketProvider,
      connectors,
      autoConnect: true,
    });
  }, [connectors, provider, webSocketProvider]);

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
}

export function AppContainer({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <AuthContainer>
      <WagmiContainer>
        <ThemeContainer>{children}</ThemeContainer>
      </WagmiContainer>
    </AuthContainer>
  );
}
