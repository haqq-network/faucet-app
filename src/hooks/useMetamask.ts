import {
  useCallback,
  useEffect,
  // useLayoutEffect,
  // useMemo,
  useRef,
  useState,
} from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';
import { useConfig } from './useConfig';

type ProviderListener = (args: any) => void;
interface ExternalProvider {
  isMetaMask?: boolean;
  isStatus?: boolean;
  host?: string;
  path?: string;
  networkVersion?: string;
  sendAsync?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void,
  ) => void;
  send?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void,
  ) => void;
  request: (request: { method: string; params?: Array<any> }) => Promise<any>;
  on: (event: string, handler: ProviderListener) => void;
  addEventListener: (event: string, handler: ProviderListener) => void;
  removeListener: (event: string, handler: ProviderListener) => void;
}

interface MetamaskHook {
  account: {
    address: string;
    balance: string;
  };
  connect: () => Promise<void>;
  selectNetwork: any;
  networkNeedsChange: any;
}

declare global {
  interface Window {
    ethereum: ExternalProvider | undefined;
  }
}

export function useMetamask(): MetamaskHook {
  const [address, setAddress] = useState<string>();
  // const [balance, setBalance] = useState<string>();
  const onboardingRef = useRef<MetaMaskOnboarding>();
  const { chainProperties } = useConfig();

  useEffect(() => {
    if (onboardingRef.current !== undefined) {
      onboardingRef.current = new MetaMaskOnboarding();
    }
  }, []);

  const handleAccountsChange = useCallback(
    (accounts: Array<string>) => {
      console.log('useMetamask(): handleAccountsChange');
      if (address !== accounts[0]) {
        setAddress(accounts[0]);
      }
    },
    [address],
  );

  const handleWalletConnect = useCallback(() => {
    console.log('useMetamask(): handleWalletConnect');
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      onboardingRef.current?.startOnboarding();
    } else {
      const { ethereum } = window;

      if (ethereum) {
        ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(handleAccountsChange);
      }
    }
  }, [handleAccountsChange]);

  // const handleGetBalance = useCallback(async (address: string) => {
  //   const { ethereum } = window;

  //   if (ethereum) {
  //     const balance = await ethereum.request({
  //       method: 'eth_getBalance',
  //       params: [address, 'latest'],
  //     });

  //     setBalance(balance);
  //   }
  // }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const { ethereum } = window;

      if (ethereum) {
        ethereum.on('accountsChanged', handleAccountsChange);

        return () => {
          ethereum.removeListener('accountsChanged', handleAccountsChange);
        };
      }
    }
  }, [handleAccountsChange]);

  const handleChainChange = useCallback((chain: any) => {
    console.log('handleChainChange', { chain });
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const { ethereum } = window;

      if (ethereum) {
        ethereum.on('accountsChanged', handleAccountsChange);
        ethereum.on('chainChanged', handleChainChange);

        return () => {
          ethereum.removeListener('accountsChanged', handleAccountsChange);
          ethereum.removeListener('chainChanged', handleChainChange);
        };
      }
    }
  }, [handleAccountsChange, handleChainChange]);

  const handleNetworkChange = useCallback(async () => {
    const { ethereum } = window;

    if (ethereum && chainProperties) {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainProperties.chainId }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: chainProperties.chainId,
                  chainName: chainProperties.chainName,
                  nativeCurrency: {
                    name: 'IslamicCoin',
                    symbol: chainProperties.symbol,
                    decimals: chainProperties.decimals,
                  },
                  rpcUrls: [chainProperties.endpoint],
                },
              ],
            });
          } catch (addError) {
            console.error(error);
          }
        }
        console.error(error);
      }
    } else {
      console.warn(
        'useMetamask(): handleNetworkChange window.ethereum is undefined',
      );
    }
  }, [chainProperties]);

  const handleNetworkNeedsChange = useCallback(async () => {
    const { ethereum } = window;
    // const networkVersion = ethereum?.networkVersion;

    // ethereum.request({ method: 'eth_chainId' }).

    const chainId = await ethereum?.request({
      method: 'eth_chainId',
      params: [],
    });

    console.log(
      `networkNeedsChange(): ${chainId}, ${chainProperties?.chainId} ${
        chainId != chainProperties?.chainId
      }`,
    );

    return chainId != chainProperties?.chainId;
  }, [chainProperties]);

  return {
    account: {
      address,
    },
    connect: handleWalletConnect,
    selectNetwork: handleNetworkChange,
    networkNeedsChange: handleNetworkNeedsChange,
  };
}
