import { useMemo } from 'react';

interface ChainProperties {
  chainId: string;
  chainName: string;
  endpoint: string;
  symbol: string;
  decimals: string;
}

interface GithubConfig {
  clientId?: string;
}

interface RecaptchaConfig {
  siteKey?: string;
}

interface ServiceConfig {
  endpoint?: string;
}

export interface ConfigHook {
  serviceConfig: ServiceConfig;
  githubConfig: GithubConfig;
  recaptchaConfig: RecaptchaConfig;
  chainProperties?: ChainProperties;
}

export function useConfig(): ConfigHook {
  // TODO: Log warnings about unavailable envs
  const chainProperties = useMemo(() => {
    const {
      CHAIN_ID,
      CHAIN_NAME,
      CHAIN_ENDPOINT,
      CHAIN_SYMBOL,
      CHAIN_DECIMALS,
    } = process.env;

    if (
      process.env.CHAIN_ID !== undefined &&
      process.env.CHAIN_NAME !== undefined &&
      process.env.CHAIN_ENDPOINT !== undefined &&
      process.env.CHAIN_SYMBOL !== undefined &&
      process.env.CHAIN_DECIMALS !== undefined
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
    const { GH_CLIENT_ID, RECAPTCHA_SITE_KEY, SERVICE_ENDPOINT } = process.env;

    const githubConfig = {
      clientId: GH_CLIENT_ID,
    };
    const recaptchaConfig = {
      siteKey: RECAPTCHA_SITE_KEY,
    };
    const serviceConfig = {
      endpoint: SERVICE_ENDPOINT,
    };

    return {
      serviceConfig,
      githubConfig,
      recaptchaConfig,
      chainProperties,
    };
  }, [chainProperties]);

  return memoizedHook;
}
