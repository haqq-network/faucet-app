import { version } from '../package.json';

const buildHash = process.env.BUILD_HASH ?? 'dev';

interface ChainProperties {
  chainId: string;
  chainName: string;
  endpoint: string;
  symbol: string;
  decimals: string;
}

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

export interface AppConfig {
  sentryDsn: string | undefined;
  version: string;
  publicUrl: string;
  recaptchaConfig: RecaptchaConfig;
  chainProperties?: ChainProperties;
  auth0Config: Auth0Config;
  serviceConfig: ServiceConfig;
}

const {
  CHAIN_ID,
  CHAIN_NAME,
  CHAIN_ENDPOINT,
  CHAIN_SYMBOL,
  CHAIN_DECIMALS,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  RECAPTCHA_SITE_KEY,
  SERVICE_ENDPOINT,
} = process.env;

function getChainProperties() {
  if (
    CHAIN_ID !== undefined &&
    CHAIN_NAME !== undefined &&
    CHAIN_ENDPOINT !== undefined &&
    CHAIN_SYMBOL !== undefined &&
    CHAIN_DECIMALS !== undefined
  ) {
    return {
      chainId: CHAIN_ID,
      chainName: CHAIN_NAME,
      endpoint: CHAIN_ENDPOINT,
      symbol: CHAIN_SYMBOL,
      decimals: CHAIN_DECIMALS,
    };
  } else {
    throw new Error(
      'Some or all chain properties is undefined. Check your env variables.',
    );
  }
}

export const config: AppConfig = {
  sentryDsn: process.env.SENTRY_DSN,
  version: `${version}-${buildHash}`,
  publicUrl: process.env.PUBLIC_URL ?? '/',
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
  chainProperties: getChainProperties(),
};
