import React, { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  block?: boolean;
  fill?: boolean;
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
}

export function Button({
  children,
  className,
  disabled,
  block,
  fill,
  type,
  onClick,
}: ButtonProps): ReactElement {
  const classNames = clsx(
    'bg-[#04D484] text-white text-base font-semibold not-italic gap-2.5 rounded-lg leading-6 py-2 px-4 w-40 h-10',
    fill ? 'w-full' : 'inline-block',
    { 'opacity-75 not-allowed': disabled },
    className,
  );
  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
