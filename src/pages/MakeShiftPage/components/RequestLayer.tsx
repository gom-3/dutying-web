import { ChatIcon } from '@assets/svg';

interface Props {
  request: ShiftType;
  isAccept: boolean;
}

function RequestLayer({ isAccept, request }: Props) {
  return (
    <div
      className={`absolute left-[.0625rem] z-10 flex h-[2.125rem] w-[2.125rem] justify-center rounded-[.5625rem] border-[.125rem]
        ${isAccept ? 'border-[#06E738] bg-[#06e73833]' : 'border-[#0027F4] bg-[#0027f433]'}
      `}
    >
      {!isAccept && (
        <div className="invisible relative top-[-1.3125rem] z-30 flex justify-center group-hover:visible">
          <ChatIcon className="absolute h-[1.25rem] w-[1.0625rem]" fill={request.color} />
          <p className="absolute top-[-0.24rem] font-poppins text-[.6rem] text-white">
            {request.shortName}
          </p>
        </div>
      )}
    </div>
  );
}

export default RequestLayer;
