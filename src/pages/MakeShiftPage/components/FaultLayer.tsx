import React from 'react';
import { FaultDotIcon } from '@/assets/svg';
import { type Fault } from '@/hooks/shift/useEditShift/types';

interface Props {
  fault: Fault;
  children?: React.ReactNode;
}

function FaultLayer({ fault, children }: Props) {
  return (
    <>
      <div
        style={{
          width: `calc(2.125rem + 2.25rem * ${fault.length - 1})`,
        }}
        className={`group absolute left-[.0625rem] z-10 h-8.5 rounded-[.5625rem] border-[.125rem] border-[#FF0000] bg-[#ff000033]`}
        // className={`group absolute left-[.0625rem] z-10 h-8.5 rounded-[.5625rem] border-[.125rem]
        //   ${
        //     fault.type === 'wrong'
        //       ? 'border-[#FF0000] bg-[#ff000033]'
        //       : 'border-[#F88600] bg-[#f8860033]'
        //   }
        // `}
      >
        <FaultDotIcon className="absolute top-[-0.85rem] right-0 h-[.75rem] w-[.75rem]" />
        {children}
      </div>
      <div className="font-apple text-sub-1 shadow-banner invisible absolute -bottom-6.5 z-31 rounded-md bg-white px-2 py-1 text-sm whitespace-nowrap group-hover:visible">
        <div
          className="absolute -top-1.5 left-[50%] z-31 h-0 w-0 translate-x-[-50%]"
          style={{
            borderTop: '.625rem solid none',
            borderLeft: '.4375rem solid transparent',
            borderRight: '.4375rem solid transparent',
            borderBottom: '.625rem solid white',
          }}
        />
        {fault.message}
      </div>
    </>
  );
}

export default FaultLayer;
