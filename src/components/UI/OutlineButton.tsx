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

export function OutlineButton({
  children,
  className,
  disabled = false,
  block = false,
  fill = false,
  type,
  onClick,
}: ButtonProps): ReactElement {
  const classNames = clsx(
    'bg-transparent text-[#04D484] border-2 border-[#04D484] border-solid text-base font-semibold not-italic rounded-md leading-6 w-[160px] h-[40px]',
    fill ? 'w-full' : 'inline-block',
    { 'opacity-75 cursor-not-allowed': disabled },
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
