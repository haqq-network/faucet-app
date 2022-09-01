import React, {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Button } from './Components';
import { config } from '../config';
import { useMetamask } from '../hooks/useMetamask';
// import store from 'store2';
// import { ThreeDots } from 'react-loader-spinner';
import Reaptcha from 'reaptcha';
import Countdown from 'react-countdown';
import SuccessIndicator from 'react-success-indicator';
import BeatLoader from 'react-spinners/BeatLoader';
import { useAuth0 } from '@auth0/auth0-react';
import { AccountInfo } from './AccountInfo';
import { useTheme } from './ThemeContainer';

interface ClaimInfo {
  available: boolean;
  next_claim_sec: number;
}

const { serviceConfig, recaptchaConfig } = config;

export function Faucet(): ReactElement {
  const { connect, account, selectNetwork, networkNeedsChange } = useMetamask();
  const {
    user,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithPopup,
    logout,
  } = useAuth0();
  const [needsSelectNetwork, setNeedsSelectNetwork] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string>();
  const [isRecaptchaVerified, setIsRecaptchaVerified] =
    useState<boolean>(false);
  const [isTokensClaimed, setTokensClaimed] = useState<boolean>(false);
  const [claimInfo, setClaimInfo] = useState<ClaimInfo>();
  const [claimIsLoading, setClaimIsLoading] = useState<boolean>(false);
  const { isDark } = useTheme();

  const handleServiceRequest = useCallback(
    async (
      path: string,
      body: Record<string, unknown>,
      method: 'POST' | 'GET' = 'POST',
    ) => {
      const requestUrl = `${serviceConfig.endpoint}/${path}`;
      const requestOptions = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body }),
      };

      return await fetch(requestUrl, requestOptions);
    },
    [],
  );

  const handleLogin = useCallback(async () => {
    await loginWithPopup();
  }, [loginWithPopup]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const requestClaimInfo = useCallback(async () => {
    const token = await getAccessTokenSilently();
    setClaimIsLoading(true);

    try {
      const response = await handleServiceRequest(`chain/claim_info`, {
        token,
      });

      const responseData = await response.json();
      setClaimInfo(responseData as ClaimInfo);
      setClaimIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [getAccessTokenSilently, handleServiceRequest]);

  const handleRecapthcaVerify = useCallback(
    async (value: string) => {
      setRecaptchaToken(value);

      try {
        const response = await handleServiceRequest('recaptcha/verify', {
          recaptcha_key: value,
        });

        if (response.ok) {
          setIsRecaptchaVerified(true);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [handleServiceRequest],
  );

  const handleRequestTokens = useCallback(async () => {
    const token = await getAccessTokenSilently();
    setClaimIsLoading(true);

    try {
      const response = await handleServiceRequest('chain/claim', {
        wallet: account.address,
        recaptcha_token: recaptchaToken,
        token,
      });

      if (response.ok) {
        setClaimIsLoading(false);
        setTokensClaimed(true);
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    account.address,
    getAccessTokenSilently,
    handleServiceRequest,
    recaptchaToken,
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      requestClaimInfo();
    }
  }, [requestClaimInfo, isAuthenticated]);

  useEffect(() => {
    networkNeedsChange().then((needsChange: boolean) => {
      setNeedsSelectNetwork(needsChange);
    });
  }, [account, networkNeedsChange]);

  const isRequestTokensAvailable = useMemo(() => {
    return Boolean(
      isAuthenticated &&
        account.address &&
        claimInfo?.available &&
        isTokensClaimed === false &&
        claimIsLoading === false,
    );
  }, [account, claimInfo, claimIsLoading, isAuthenticated, isTokensClaimed]);

  const isCountDownVisible = useMemo(() => {
    return Boolean(
      isAuthenticated && !claimInfo?.available && claimInfo?.next_claim_sec,
    );
  }, [claimInfo, isAuthenticated]);

  return (
    <div className="container px-2 sm:px-6 lg:px-8 mx-auto">
      <div className="mx-auto max-w-md rounded-xl shadow-lg my-20 backdrop-filter backdrop-blur transform-gpu bg-white/50 dark:bg-slate-700/40">
        <div className="flex flex-col space-y-5 py-6">
          <div className="px-5">
            <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 inline-flex mb-4">
              Connect wallet
            </h2>

            {account.address && (
              <div className="mb-0">
                <AccountInfo account={account} />
              </div>
            )}

            <div className="flex flex-row space-x-4">
              {!account.address && (
                <div>
                  <Button block onClick={connect}>
                    Connect wallet
                  </Button>
                </div>
              )}

              {needsSelectNetwork && (
                <div>
                  <Button block onClick={selectNetwork}>
                    Switch network
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="px-5">
            <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 mb-4">
              Github Auth
            </h2>

            {isAuthenticated ? (
              <div className="flex flex-row space-x-4">
                {user && (
                  <div className="flex flex-row space-x-4 items-center flex-1">
                    {user.picture && (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="rounded-full h-10 w-10"
                      />
                    )}
                    <p>{user.name}</p>
                  </div>
                )}
                <Button onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
          </div>
          {isAuthenticated && account.address && (
            <div className="px-5 min-h-[40px]">
              <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 mb-5">
                Request tokens
              </h2>

              {claimIsLoading ? (
                <div className="flex flex-row space-x-4 items-center justify-center">
                  <BeatLoader color="#5BABCD" speedMultiplier={0.7} />
                </div>
              ) : (
                <Fragment>
                  {isRequestTokensAvailable && (
                    <div>
                      {isRecaptchaVerified ? (
                        <div>
                          <Button block onClick={handleRequestTokens}>
                            Request tokens
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-row space-x-4 items-center justify-center">
                          <Reaptcha
                            sitekey={recaptchaConfig.siteKey}
                            onVerify={handleRecapthcaVerify}
                            theme={isDark ? 'dark' : 'light'}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {isTokensClaimed && (
                    <div className="flex flex-row space-x-4 items-center justify-center">
                      <SuccessIndicator size="36px" color="green" />
                      <p>Tokens claimed!</p>
                    </div>
                  )}

                  {isCountDownVisible && (
                    <div>
                      <h3 className="text-base font-semibold text-[#0c0c0c] dark:text-gray-100 mb-2">
                        Next request tokens available after
                      </h3>
                      <Countdown
                        date={Date.now() + claimInfo.next_claim_sec * 1000}
                        onComplete={requestClaimInfo}
                        renderer={({ hours, minutes, seconds }) => {
                          // Render a countdown
                          return (
                            <div className="text-xl">
                              {hours < 10 ? '0' + hours : hours}:
                              {minutes < 10 ? '0' + minutes : minutes}:
                              {seconds < 10 ? '0' + seconds : seconds}
                            </div>
                          );
                        }}
                      />
                    </div>
                  )}
                </Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Faucet as default };
