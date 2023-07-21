interface Props {
  fault: Fault;
}

function FaultLayer({ fault }: Props) {
  return (
    <>
      <div
        style={{
          width: `calc(2.125rem + 2.25rem * ${fault.length - 1})`,
        }}
        className={`group absolute left-[.0938rem] top-[50%] z-10 h-[2.125rem] translate-y-[-50%] rounded-[.5625rem] border-[.125rem]
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
      </div>
      <div className="invisible absolute bottom-[-26px] z-30 whitespace-nowrap rounded-md bg-white px-2 py-1 font-apple text-sm text-sub-1 shadow-shadow-1 group-hover:visible">
        <div
          className="absolute top-[-6px] h-0 w-0"
          style={{
            borderTop: '10px solid none',
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderBottom: '10px solid white',
          }}
        />
        {fault.message}
      </div>
    </>
  );
}

export default FaultLayer;
