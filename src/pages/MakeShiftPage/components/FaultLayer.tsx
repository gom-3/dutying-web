interface Props {
  fault: Fault;
}

function FaultLayer({ fault }: Props) {
  return (
    <div
      style={{
        width: `calc(2.125rem + 2.25rem * ${fault.length - 1})`,
      }}
      className={`absolute left-[.0938rem] z-10 h-[2.125rem] rounded-[.5625rem] border-[.125rem]
        ${
          fault.type === 'wrong'
            ? 'border-[#FF0000] bg-[#ff000033]'
            : 'border-[#F88600] bg-[#f8860033]'
        }
      `}
    >
      <div
        className={`absolute right-[-0.125rem] top-[-0.3rem] h-[.3125rem] w-[.3125rem] rounded-full
          ${fault.type === 'wrong' ? 'bg-[#FF0000]' : 'bg-[#F88600]'}
        `}
      />
    </div>
  );
}

export default FaultLayer;
