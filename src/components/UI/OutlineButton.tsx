import React, { ReactElement } from 'react';

export function OutlineButton(): ReactElement {
  return (
    <button className="bg-transparent text-[#04D484] border-2 border-emerald-400 border-solid text-base font-semibold not-italic rounded-md leading-6  w-[160px] h-[40px]">
      Send
    </button>
  );
}
