import { FaultDotIcon } from '@assets/svg';

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
        className={`group absolute left-[.0625rem] z-10 h-[2.125rem] rounded-[.5625rem] border-[.125rem] border-[#FF0000] bg-[#ff000033]`}
        // className={`group absolute left-[.0625rem] z-10 h-[2.125rem] rounded-[.5625rem] border-[.125rem]
        //   ${
        //     fault.type === 'wrong'
        //       ? 'border-[#FF0000] bg-[#ff000033]'
        //       : 'border-[#F88600] bg-[#f8860033]'
        //   }
        // `}
      >
        <FaultDotIcon className="absolute right-0 top-[-0.85rem] size-[.75rem]" />
        {children}
      </div>
      <div className="invisible absolute bottom-[-1.625rem] z-[31] whitespace-nowrap rounded-md bg-white px-2 py-1 font-apple text-sm text-sub-1 shadow-banner group-hover:visible">
        <div
          className="absolute -top-1.5 left-1/2 z-[31] size-0 -translate-x-1/2"
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
