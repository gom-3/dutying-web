import { ChatIcon } from '@assets/svg';

interface Props {
  request: ShiftType;
  isAccept: boolean;
}

function RequestLayer({ isAccept, request }: Props) {
  return (
    <>
      <div
        className={`absolute left-[.0938rem] top-[50%] z-10  flex h-[2.125rem] w-[2.125rem] translate-y-[-50%] justify-center rounded-[.5625rem] border-[.125rem]
        ${isAccept ? 'border-[#06E738] bg-[#06e73833]' : 'border-[#0027F4] bg-[#0027f433]'}
      `}
      >
        {!isAccept && (
          <div className="relative top-[-1.3125rem] z-[1] flex justify-center group-hover:visible">
            <ChatIcon className="absolute h-[1.25rem] w-[1.0625rem]" fill={request.color} />
            <p className="absolute font-poppins text-[.6rem] text-white">{request.shortName}</p>
          </div>
        )}
      </div>
      {!isAccept && (
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
          신청 근무 {request.name}가 반영되지 않았습니다.
        </div>
      )}
    </>
  );
}

export default RequestLayer;
