import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

type InputValue = string | number | undefined;
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
interface InputProps {
  label?: string;
  id?: string;
  placeholder?: string;
  value?: InputValue;
  onChange: (value: InputValue, event?: ChangeEvent) => void;
  state: 'normal' | 'success' | 'error';
  hint?: string;
  type: 'text' | 'number';
  required?: boolean;
}

export const Input: FC<InputProps> = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  state,
  hint,
  type,
  required,
}) => {
  const inputId = useMemo<string | undefined>(() => {
    if (id) return id;
    if (label) return `input-${Math.random()}`;
    return undefined;
  }, [id, label]);

  const classNames = clsx(
    {
      'border-[#f50000] outline-none': state === 'error',
      'border-[#04D484] outline-none': state === 'success',
      'border-gray-400 focus:border-black': state === 'normal',
      'border-black': value && state === 'normal',
    },
    'block w-full p-2.5 rounded-md text-black text-sm bg-gray-50 border border-solid ',
  );

  const [input, setInput] = useState<string | number | undefined>('');

  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleInputChange = useCallback(
    (event: ChangeEvent) => {
      onChange(event.target.value, event);
      setInput(event.target.value);
    },
    [onChange],
  );

  return (
    <div className="mb-6">
      <label
        id={inputId}
        htmlFor="walletInput"
        className="block mb-1 text-sm font-normal text-gray-900 dark:text-gray-300 w-full"
      >
        <span>{label}</span>
        {required && <span className="text-[#04D484]">{' *'}</span>}
      </label>
      <input
        type={type}
        id={inputId}
        className={classNames}
        placeholder={placeholder}
        required={required}
        onChange={handleInputChange}
        value={input}
      />
      {state === 'error' && (
        <label className="block text-sm font-normal text-[#f50000]">
          {hint}
        </label>
      )}
    </div>
  );
};
