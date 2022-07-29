import React, { ReactElement } from 'react';
import clsx from 'clsx';

type InputValue = string | number | undefined;

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: InputValue;
  onChange: (value: InputValue) => void;
  state: 'normal' | 'success' | 'error';
  hint?: string;
  type: 'text' | 'number';
  required?: boolean;
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  state,
  hint,
  type,
  required,
}: InputProps): ReactElement {
  let stateClass: string;
  switch (state) {
    case 'error':
      stateClass = 'border-[#f50000] outline-none';
      break;
    case 'success':
      stateClass = 'border-[#04D484] outline-none';
      break;
    default:
      stateClass = 'border-gray-400 focus:border-black';
      break;
  }
  const classNames = clsx(
    'block w-full p-2.5 rounded-md text-black text-sm bg-gray-50 border border-solid ',
    stateClass,
  );

  return (
    <div className="mb-6">
      <label
        htmlFor="walletInput"
        className="block mb-1 text-sm font-normal text-gray-900 dark:text-gray-300 w-full"
      >
        <span>{label}</span>
        {required && <span className="text-[#04D484]">{' *'}</span>}
      </label>

      <input
        type={type}
        id="walletInput"
        className={classNames}
        placeholder={placeholder}
        required={required}
        onChange={() => onChange(value)}
        value={value ?? ''}
      />
      {state === 'error' && (
        <label className="block text-sm font-normal text-[#f50000]">
          {hint}
        </label>
      )}
    </div>
  );
}
