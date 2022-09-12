import { version } from '../package.json';

const buildHash = process.env.BUILD_HASH ?? 'dev';

interface RecaptchaConfig {
  siteKey?: string;
}

interface ServiceConfig {
  endpoint?: string;
}

interface Auth0Config {
  domain?: string;
  clientId?: string;
}

type Network = 'local' | 'dev' | 'test' | 'main';

export interface AppConfig {
  sentryDsn: string | undefined;
  version: string;
  recaptchaConfig: RecaptchaConfig;
  network: Network;
  auth0Config: Auth0Config;
  serviceConfig: ServiceConfig;
}

const {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  RECAPTCHA_SITE_KEY,
  SERVICE_ENDPOINT,
  SENTRY_DSN,
  NETWORK,
} = process.env;

export const config: AppConfig = {
  sentryDsn: SENTRY_DSN,
  version: `${version}-${buildHash}`,
  network: (NETWORK ?? 'dev') as Network,
  auth0Config: {
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
  },
  recaptchaConfig: {
    siteKey: RECAPTCHA_SITE_KEY,
  },
  serviceConfig: {
    endpoint: SERVICE_ENDPOINT,
  },
};

interface Chain {
  id: number;
  name: string;
  network: string;
  rpcUrls: Record<string, string>;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  testnet: boolean;
}

const currency: Chain['nativeCurrency'] = {
  name: 'Islamic Coin',
  symbol: 'ISLM',
  decimals: 18,
};

export const chains: Record<string, Chain> = {
  local: {
    id: 5777,
    name: 'Haqq Localnet',
    network: 'haqq-localnet',
    rpcUrls: {
      default: 'http://127.0.0.1:7545',
      ws: 'ws://127.0.0.1:7545',
    },
    nativeCurrency: currency,
    testnet: true,
  },
  testedge: {
    id: 53211,
    name: 'Haqq Testedge',
    network: 'haqq-testedge',
    rpcUrls: {
      default: 'https://rpc.eth.testedge.haqq.network',
    },
    testnet: true,
    nativeCurrency: currency,
  },
  testedge2: {
    id: 54211,
    name: 'Haqq TestEdge2',
    network: 'haqq-testedge2',
    rpcUrls: {
      default: 'https://rpc.eth.testedge2.haqq.network',
    },
    testnet: true,
    nativeCurrency: currency,
  },
  main: {
    id: 11235,
    name: 'Haqq Mainnet',
    network: 'haqq-mainnet',
    rpcUrls: {
      default: 'https://rpc.eth.haqq.network',
    },
    testnet: false,
    nativeCurrency: currency,
  },
};

export function getChain() {
  const currentChain = chains[config.network];

  if (!currentChain) {
    throw new Error(`No configuration for ${config.network}`);
  }

  return currentChain;
}
