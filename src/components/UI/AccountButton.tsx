import clsx from 'clsx';
import React, { ReactElement } from 'react';
// import rectangle from '../../assets/rectangle.svg';
import { MetamaskAccountIcon } from './MetamaskAccountIcon';

interface WalletButtonProps {
  account: {
    account: string;
    balance: string;
  };
  onAddressClick?: () => void;
  onBalanceClick?: () => void;
}

export function AccountButton({
  account,
  onAddressClick,
  onBalanceClick,
}: WalletButtonProps): ReactElement {
  const balance =
    Number(account.balance) > 0 ? parseFloat(account.balance).toFixed(2) : '0';
  const hiddenBalance = `${account.account.slice(
    0,
    2,
  )}...${account.account.slice(40, 42)}`;

  const balanceClassNames = clsx(
    'flex items-center justify-between bg-[#04D484] text-white text-base font-semibold not-italic gap-2.5 rounded-md leading-6 py-[2px] max-w-[212px] min-h-[40px] ',
  );

  const addressClassNames = clsx(
    'flex bg-white text-black text-base leading-6 text-[14px] max-w-[83px] min-h-[36px] font-normal not-italic rounded-md justify-between items-center px-1 relative gap-[8px] right-[2px]',
  );

  const connectClassNames = clsx(
    'bg-[#04D484] text-white text-base font-semibold not-italic gap-2.5 rounded-lg leading-6 py-2 px-4 w-40 h-10',
  );

  return (
    <div>
      {account.account ? (
        <div className={balanceClassNames}>
          <span
            className="ml-[10px]"
            onClick={onBalanceClick}
            style={
              balance.length > 10
                ? { fontSize: '11.7px' }
                : { fontSize: '14px' }
            }
          >
            {balance} ISLM
          </span>
          <div className={addressClassNames}>
            <span onClick={onAddressClick}>{hiddenBalance}</span>
            {/* static logo for layout test */}
            {/* <img
              src={rectangle}
              alt="tokenLogo"
              className="w-[16px] h-[16px]"
            /> */}
            <MetamaskAccountIcon address={account.account} size={16} />
          </div>
        </div>
      ) : (
        <button className={connectClassNames}>Connect Wallet</button>
      )}
    </div>
  );
}
