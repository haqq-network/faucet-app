import React from 'react';
import { getFormattedAddress } from '../utils/getFormattedAddress';
import { IdentIcon } from './IdentIcon';

export function AccountInfo({
  account,
}: {
  account: {
    address: string;
    balance?: string;
  };
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-4 items-center h-[40px]">
        <IdentIcon address={account.address} size={40} />
        <div className="text-md overflow-hidden text-ellipsis">
          {getFormattedAddress(account.address, 5)}
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
