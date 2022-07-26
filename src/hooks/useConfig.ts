import { useCallback, useMemo } from 'react';

interface ChainProperties {
  chainId: string;
  chainName: string;
  endpoint: string;
  symbol: string;
  decimals: number;
}

interface Auth0Config {
  domain?: string;
  clientId?: string;
}

interface RecaptchaConfig {
  siteKey?: string;
}

export interface ConfigHook {
  auth0Config: Auth0Config;
  recaptchaConfig: RecaptchaConfig;
  chainProperties?: ChainProperties;
}

export function useConfig(): ConfigHook {
  // TODO: Log warnings about unavailable envs
  const chainProperties = useMemo(() => {
    const {
      CHAIN_ID,
      CHAIN_NAME,
      CHAIN_DECIMALS,
      CHAIN_SYMBOL,
      CHAIN_ENDPOINT,
    } = process.env;

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
      console.warn(
        'useConfig(): Some or all chain properties is undefined. Check your env variables.',
      );
    }

    return undefined;
  }, []);

  const memoizedHook = useMemo(() => {
    const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, RECAPTCHA_SITE_KEY } = process.env;

    const auth0Config = {
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
    };
    const recaptchaConfig = {
      siteKey: RECAPTCHA_SITE_KEY,
    };

    return {
      auth0Config,
      recaptchaConfig,
      chainProperties,
    };
  }, [chainProperties]);

  return memoizedHook;
}
