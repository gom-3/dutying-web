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
        className={`group absolute left-[.0625rem] z-10 h-[2.125rem] rounded-[.5625rem] border-[.125rem]
        ${
          fault.type === 'wrong'
            ? 'border-[#FF0000] bg-[#ff000033]'
            : 'border-[#F88600] bg-[#f8860033]'
        }
      `}
      >
        <div
          className={`absolute right-[-0.0625rem] top-[-0.5rem] z-[1] h-[.3125rem] w-[.3125rem] rounded-full
      ${fault.type === 'wrong' ? 'bg-[#FF0000]' : 'bg-[#F88600]'}
    `}
        />
        {children}
      </div>
      <div className="invisible absolute bottom-[-1.625rem] z-30 whitespace-nowrap rounded-md bg-white px-2 py-1 font-apple text-sm text-sub-1 shadow-shadow-1 group-hover:visible">
        <div
          className="absolute left-[50%] top-[-0.375rem] h-0 w-0 translate-x-[-50%]"
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
