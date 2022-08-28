import React, {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { loginWithGithub } from 'github-oauth-popup';
import { Button } from './Components';
import { useConfig } from '../hooks/useConfig';
import { IdentIcon } from './IdentIcon';
import { useMetamask } from '../hooks/useMetamask';
import store from 'store2';
import { ThreeDots } from 'react-loader-spinner';
import Reaptcha from 'reaptcha';
import Countdown from 'react-countdown';
import SuccessIndicator from 'react-success-indicator';
import BeatLoader from 'react-spinners/BeatLoader';
import { NavLink } from 'react-router-dom';

// import GithubIcon from 'mdi-react/GithubIcon';
// import { useRecaptcha } from '../hooks/useRecaptcha';

// available: true, next_claim_sec: 0
interface ClaimInfo {
  available: boolean;
  next_claim_sec: number;
}

export function Faucet(): ReactElement {
  const { connect, account, selectNetwork, networkNeedsChange } = useMetamask();
  const { serviceConfig, githubConfig, recaptchaConfig } = useConfig();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isGHKeyChecked, setIsGHKeyChecked] = useState<boolean>(false);
  const [needsSelectNetwork, setNeedsSelectNetwork] = useState<boolean>(false);
  const [ghKey, setGhKey] = useState<string>();
  const [ghUser, setGhUser] = useState<any>();
  const [recaptchaToken, setRecaptchaToken] = useState<string>();
  const [isRecaptchaVerifyed, setIsRecaptchaVerifyed] =
    useState<boolean>(false);
  const [isTokensClaimed, setisTokensClaimed] = useState<boolean>(false);
  const [claimInfo, setClaimInfo] = useState<ClaimInfo>();
  const [claimIsLoading, setClaimIsLoading] = useState<boolean>(false);
  const checkGHKey = useCallback(
    async (gh_key: any) => {
      console.log(`checkGHKey call`);

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gh_key }),
      };

      const requestUrl = `${serviceConfig.endpoint}/github/check_key`;

      const response = await fetch(requestUrl, requestOptions);
      const userData = await response.json();
      return userData;
    },
    [serviceConfig],
  );

  useEffect(() => {
    console.log(`useEffect`);

    networkNeedsChange().then((needsChange: boolean) => {
      setNeedsSelectNetwork(needsChange);
      console.log(`res_needs_change: ${needsChange}`);
    });

    const GHKey = store.get('haqq_gh_key');
    setGhKey(GHKey);

    if (GHKey != null && !isAuthenticated) {
      checkGHKey(GHKey)
        .then((userData) => {
          console.log(userData);

          setGhUser(userData);
          setIsAuthenticated(true);
          setIsGHKeyChecked(true);
        })
        .catch(() => {
          setIsGHKeyChecked(true);
          setIsAuthenticated(false);
        });
    } else if (GHKey == null) {
      setIsGHKeyChecked(true);
      setIsAuthenticated(false);
    }
  }, [checkGHKey, isAuthenticated, networkNeedsChange]);

  const handleGithubLogin = useCallback(async () => {
    console.log(`test`);

    const res = store.get('haqq_github_token');
    console.log(`store res: ${res}`);

    const params = {
      client_id: githubConfig.clientId,
      scope: 'read:user',
    };

    loginWithGithub(params).then((res: any) => {
      console.log(`loginWithGithub res: ${res}`);

      async function fetchGithubAuth(code: string) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code }),
        };

        const requestUrl = `${serviceConfig.endpoint}/github/oauth`;

        try {
          const response = await fetch(requestUrl, requestOptions);
          const ghData = await response.json();
          return ghData;
        } catch (e) {
          return null;
        }
      }

      async function checkGHKey(gh_key: any) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gh_key }),
        };

        const requestUrl = `${serviceConfig.endpoint}/github/check_key`;

        try {
          const response = await fetch(requestUrl, requestOptions);
          const ghData = await response.json();
          return ghData;
        } catch (e) {
          return null;
        }
      }

      fetchGithubAuth(res.code)
        .then((ghData) => {
          console.log(`ghData->user: ${JSON.stringify(ghData.user)}`);
          console.log(
            `ghData->user: ${JSON.stringify(ghData.user?.avatar_url)}`,
          );
          console.log(`ghData->gh_key: ${JSON.stringify(ghData.gh_key)}`);

          if (ghData.gh_key !== null && ghData.user !== null) {
            setGhUser(ghData.user);
            setGhKey(ghData.gh_key);

            store.set('haqq_gh_key', ghData.gh_key);

            checkGHKey(ghData.gh_key).then((res) => {
              console.log(res);
              setIsGHKeyChecked(true);
            });

            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          setIsGHKeyChecked(true);
          setIsAuthenticated(false);
        });
    });
  }, [githubConfig, serviceConfig]);

  async function onVerify(value: string) {
    console.log('Captcha value:', value);
    setRecaptchaToken(value);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recaptcha_key: value }),
    };

    const requestUrl = `${serviceConfig.endpoint}/recaptcha/verify`;

    try {
      const response = await fetch(requestUrl, requestOptions);

      if (response.ok) {
        setIsRecaptchaVerifyed(true);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  }

  async function handleRequestTokens() {
    setClaimIsLoading(true);

    console.log('Request coins');

    console.log('Request ghKey: ', ghKey);
    console.log('Request recaptcha: ', recaptchaToken);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet: account.address,
        gh_key: ghKey,
        recaptcha_token: recaptchaToken,
      }),
    };

    const requestUrl = `${serviceConfig.endpoint}/chain/claim`;
    try {
      const response = await fetch(requestUrl, requestOptions);

      if (response.ok) {
        setClaimIsLoading(false);
        setisTokensClaimed(true);
      }

      console.log(`handleRequestTokens -> response: ${response}`);
    } catch (e) {
      console.log((e as Error).message);
    }
  }

  const getClaimInfo = useCallback(async () => {
    console.log('Request claim info');

    console.log('Request ghKey: ', ghKey);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gh_key: ghKey,
      }),
    };

    const requestUrl = `${serviceConfig.endpoint}/chain/claim_info`;

    try {
      const response = await fetch(requestUrl, requestOptions);
      const responseJson = await response.json();

      console.log(`getClaimInfo -> response:`, responseJson);

      if (response.ok) {
        setClaimInfo(responseJson);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  }, [serviceConfig, ghKey]);

  useEffect(() => {
    if (ghKey) {
      getClaimInfo();
    }
  }, [account.address, ghKey, getClaimInfo]);

  // async function getClaimInfo() {
  //   console.log('Request claim info');

  //   console.log('Request ghKey: ', ghKey);

  //   const requestOptions = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       gh_key: ghKey,
  //     }),
  //   };

  //   const requestUrl = `${serviceConfig.endpoint}/chain/claim_info`;
  //   const response = await fetch(requestUrl, requestOptions);
  //   const responseJson = await response.json();

  //   if (response.ok) {
  //     setClaimInfo(responseJson);
  //   }

  //   console.log(`getClaimInfo -> response:`, responseJson);
  // }

  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      getClaimInfo();

      return <div />;
    } else {
      // Render a countdown
      return (
        <div>
          {hours < 10 ? '0' + hours : hours}:
          {minutes < 10 ? '0' + minutes : minutes}:
          {seconds < 10 ? '0' + seconds : seconds}
        </div>
      );
    }
  };

  return (
    <div className="container px-2 sm:px-6 lg:px-8 mx-auto">
      <div className="mx-auto max-w-md rounded-xl shadow-lg my-20 backdrop-filter backdrop-blur transform-gpu bg-white/50 dark:bg-slate-700/40">
        <div className="flex flex-col space-y-5 py-6">
          <div className="px-5">
            <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 inline-flex mb-4">
              Connect wallet
            </h2>

            {/* <div className="p-4 border dark:border-slate-600/40 border-slate-400/30 rounded-md mb-5"> */}
            {account.address && (
              <div className="mb-0">
                <AccountInfo account={account} />
              </div>
            )}

            <div className="flex flex-row space-x-4">
              {!account.address && !needsSelectNetwork && (
                <Button block onClick={connect}>
                  Connect wallet
                </Button>
              )}
              {needsSelectNetwork && (
                <Button block onClick={selectNetwork}>
                  Switch network
                </Button>
              )}
            </div>
          </div>
          <div className="px-5">
            <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 mb-4">
              Github Auth
            </h2>

            <ThreeDots
              height="50"
              width="50"
              radius="9"
              color="#5BABCD"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              visible={!isGHKeyChecked}
            />

            {isGHKeyChecked && (
              <div className="flex flex-row space-x-4 items-center align-center justify-between">
                {isAuthenticated && ghUser.login ? (
                  <Fragment>
                    <div className="flex flex-row space-x-4 items-center">
                      {ghUser.avatar_url && (
                        <img
                          src={ghUser.avatar_url}
                          alt=""
                          className="rounded-full h-10 w-10"
                        />
                      )}
                      <p>{ghUser.login}</p>
                    </div>
                  </Fragment>
                ) : (
                  <Button block onClick={handleGithubLogin}>
                    Login
                  </Button>
                )}
              </div>
            )}
          </div>

          {isAuthenticated &&
            account.address &&
            claimInfo?.available &&
            isTokensClaimed == false &&
            claimIsLoading == false && (
              <div className="px-5">
                <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 mb-5">
                  Request tokens
                </h2>

                <div>
                  {isRecaptchaVerifyed ? (
                    <div>
                      <Button block onClick={handleRequestTokens}>
                        Request tokens
                      </Button>
                    </div>
                  ) : (
                    <Reaptcha
                      sitekey={recaptchaConfig.siteKey}
                      onVerify={onVerify}
                      theme="dark"
                    />
                  )}
                </div>
              </div>
            )}

          {isAuthenticated &&
            !claimInfo?.available &&
            claimInfo?.next_claim_sec && (
              <div className="px-5">
                <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 mb-5">
                  Next request tokens available after
                </h2>

                <div>
                  <Countdown
                    date={Date.now() + claimInfo.next_claim_sec * 1000}
                    renderer={countdownRenderer}
                  />
                </div>
              </div>
            )}

          {claimIsLoading == true && (
            <div>
              <div className="px-5">
                <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 mb-5">
                  Request tokens
                </h2>
                <div>
                  <BeatLoader color="#5BABCD" speedMultiplier={0.7} />
                </div>
              </div>
            </div>
          )}

          {isTokensClaimed == true && (
            <div>
              <div className="px-5">
                <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 mb-5">
                  Request tokens
                </h2>

                <div className="flex flex-row space-x-4 items-center">
                  <SuccessIndicator size="36px" color="green" />
                  <p>Tokens claimed!</p>
                </div>
              </div>
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
  const accountLen = account.address.length;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-4 items-center h-[35px]">
        <IdentIcon address={account.address} size={32} />
        <div className="text-md overflow-hidden text-ellipsis">
          {account.address.slice(0, 5) +
            '****' +
            account.address.slice(accountLen - 5, accountLen)}
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
