import React, { Fragment, ReactElement, useCallback, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from './Components';
// import { useConfig } from '../hooks/useConfig';
import { IdentIcon } from './IdentIcon';
import { useMetamask } from '../hooks/useMetamask';
// import { useRecaptcha } from '../hooks/useRecaptcha';

// const ONBOARD_TEXT = 'Click here to install MetaMask!';
// const CONNECT_TEXT = 'Connect';

// export function OnboardingButton() {
//   const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
//   const [isDisabled, setDisabled] = useState(false);
//   const [accounts, setAccounts] = useState<string>();
//   const onboarding = useRef<MetaMaskOnboarding>();
//   const [balance, setBalance] = useState<string>();
//   // const web3 = useRef<Web3>();
//   // const mma = useMetamask();

//   // useEffect(() => {
//   //   console.log({ mma });
//   // }, [mma]);

//   useEffect(() => {
//     if (!onboarding.current) {
//       onboarding.current = new MetaMaskOnboarding();
//     }
//   }, []);

//   // useEffect(() => {
//   //   if (!web3.current) {
//   //     web3.current = new Web3(window.ethereum as AbstractProvider);
//   //     console.log({ web3: web3.current });
//   //   }
//   // }, []);

//   const handleGetBalance = useCallback(async (account: string) => {
//     const balance = await window.ethereum.request({
//       method: 'eth_getBalance',
//       params: [account, 'latest'],
//     });
//     // console.log('getBalance', { balance });
//     setBalance(balance);
//   }, []);

//   useEffect(() => {
//     if (MetaMaskOnboarding.isMetaMaskInstalled() && accounts !== undefined) {
//       handleGetBalance(accounts);
//     }
//   }, [accounts, handleGetBalance]);

//   useEffect(() => {
//     if (MetaMaskOnboarding.isMetaMaskInstalled() && onboarding.current) {
//       if (accounts !== undefined) {
//         setButtonText(`Connected account: ${accounts}`);
//         setDisabled(true);
//         onboarding.current.stopOnboarding();
//       } else {
//         setButtonText(CONNECT_TEXT);
//         setDisabled(false);
//       }
//     }
//   }, [accounts]);

//   const handleAccountsChange = useCallback(
//     (newAccounts: Array<string>) => {
//       if (accounts !== newAccounts[0]) {
//         // console.log({ accounts });
//         setAccounts(newAccounts[0]);
//       }
//     },
//     [accounts],
//   );

//   useEffect(() => {
//     if (MetaMaskOnboarding.isMetaMaskInstalled()) {
//       window.ethereum
//         .request({ method: 'eth_requestAccounts' })
//         .then(handleAccountsChange);
//       window.ethereum.on('accountsChanged', handleAccountsChange);
//       return () => {
//         window.ethereum.removeListener('accountsChanged', handleAccountsChange);
//       };
//     }
//   }, [handleAccountsChange]);

//   const onClick = () => {
//     if (onboarding.current) {
//       if (MetaMaskOnboarding.isMetaMaskInstalled()) {
//         window.ethereum
//           .request({ method: 'eth_requestAccounts' })
//           .then(handleAccountsChange);
//       } else {
//         onboarding.current.startOnboarding();
//       }
//     }
//   };

//   // useEffect(() => {
//   //   console.log("useEffect", { accounts });
//   // }, [accounts]);

//   const { chainProperties } = useConfig();

//   const humanizedBalance = useMemo(() => {
//     if (web3.current !== undefined && balance !== undefined) {
//       const formattedBalance = web3.current.utils.fromWei(balance, 'ether');
//       return `${formattedBalance} ${chainProperties.symbol}`;
//     }

//     return undefined;
//   }, [balance, chainProperties.symbol]);

//   return (
//     <Fragment>
//       <Button disabled={isDisabled} onClick={onClick} block>
//         {buttonText}
//       </Button>

//       {balance !== undefined && <div>Balance: {humanizedBalance}</div>}
//     </Fragment>
//   );
// }

export function Faucet(): ReactElement {
  const {
    user,
    isAuthenticated,
    // isLoading,
    // error,
    loginWithPopup,
    logout: auth0Logout,
  } = useAuth0();
  const { connect, account, selectNetwork } = useMetamask();

  const handleAuth0Login = useCallback(async () => {
    try {
      await loginWithPopup();
    } catch (error) {
      console.error(error);
    }
  }, [loginWithPopup]);

  const handleAuth0Logout = useCallback(() => {
    try {
      auth0Logout({ returnTo: window.location.origin });
    } catch (error) {
      console.error(error);
    }
  }, [auth0Logout]);

  useEffect(() => {
    console.log('account', { account });
  }, [account]);

  return (
    <div className="container px-2 sm:px-6 lg:px-8 mx-auto">
      <div className="mx-auto max-w-md rounded-xl shadow-lg my-20 backdrop-filter backdrop-blur transform-gpu bg-white/50 dark:bg-slate-700/40">
        <div className="flex flex-col space-y-5 py-5">
          <div className="px-5">
            <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 inline-flex mb-4">
              Connect wallet
            </h2>

            {/* <div className="p-4 border dark:border-slate-600/40 border-slate-400/30 rounded-md mb-5"> */}
            {account.address && (
              <div className="mb-5">
                <AccountInfo account={account} />
              </div>
            )}

            <div className="flex flex-row space-x-4">
              <Button block onClick={connect}>
                Connect wallet
              </Button>
              <Button block onClick={selectNetwork}>
                Select Testnet
              </Button>
            </div>
          </div>
          <div className="px-5">
            <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 mb-3">
              Github Auth
            </h2>

            <div className="flex flex-row space-x-4 items-center align-center justify-between">
              {isAuthenticated && user ? (
                <Fragment>
                  <div className="flex flex-row space-x-4 items-center">
                    {user.picture && (
                      <img
                        src={user.picture}
                        alt=""
                        className="rounded-full h-10 w-10"
                      />
                    )}
                    <p>{user.email}</p>
                  </div>
                  <Button onClick={handleAuth0Logout}>Logout</Button>
                </Fragment>
              ) : (
                <Button block onClick={handleAuth0Login}>
                  Login
                </Button>
              )}
            </div>
          </div>

          {isAuthenticated && (
            <div className="px-5">
              <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 mb-3">
                Request tokens
              </h2>

              <RequestForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountInfo({
  account,
}: {
  account: {
    address: string;
    balance?: string;
  };
}) {
  // const countdown = useCountdown(3 * 60 * TIME_SEC_IN_MIN);
  // useEffect(() => {
  //   console.log({ countdown });
  // }, [countdown]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-4 items-center h-[32px]">
        <IdentIcon address={account.address} size={32} />
        <div className="text-md overflow-hidden text-ellipsis">
          {account.address}
        </div>
      </div>

      {account.balance && (
        <div>
          <div>Balance</div>
          <div>{account.balance}</div>
        </div>
      )}
    </div>
  );
}

export { Faucet as default };

function RequestForm() {
  // const { recaptchaConfig } = useConfig();
  // const { initRecaptcha, isReady } = useRecaptcha();

  // useLayoutEffect(() => {
  //   if (recaptchaConfig.siteKey) {
  //     initRecaptcha(recaptchaConfig.siteKey);
  //   } else {
  //     console.warn(
  //       'reCaptcha site key is missing. Please check your environments',
  //     );
  //   }
  // }, [initRecaptcha, recaptchaConfig.siteKey]);

  const handleSubmit = useCallback(() => {
    console.log('Request captchax');
    // if (typeof grecapcha !== undefined) {
    //   event.preventDefault();
    //   await grecaptcha.ready();
    //   grecaptcha
    //     .execute(recaptchaConfig.siteKey, { action: 'submit' })
    //     .then((token: string) => {
    //       console.log({ token });
    //       // Add your logic to submit to your backend server here.
    //     });
    // }
  }, []);

  return (
    <div>
      <Button block onClick={handleSubmit}>
        Request tokens
      </Button>
    </div>
  );
}
