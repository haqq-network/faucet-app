import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface HeaderLinkProps {
  to: string;
  children: ReactNode;
}

export function HeaderLink({ children, to }: HeaderLinkProps) {
  return (
    <NavLink
      to={to}
      className={() => {
        return clsx(
          'text-black text-base text-center font-normal hover:text-[#04d484] underline-offset-0 hover:underline active:text-[#04d484]',
        );
      }}
    >
      {children}
    </NavLink>
  );
}
