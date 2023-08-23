import { ChatIcon, RequestCheckIcon, RequestSlashIcon } from '@assets/svg';

interface Props {
  request: WardShiftType;
  isAccept: boolean;
  showCheck: boolean;
  showSlash: boolean;
}

function RequestLayer({ isAccept, request, showCheck, showSlash }: Props) {
  return isAccept
    ? showCheck && (
        <div
          className={`bg-[#06e73833]'} absolute left-[.0625rem] top-[50%] z-10 flex h-[2.125rem] w-[2.125rem] translate-y-[-50%] justify-center rounded-[.5625rem] border-[.125rem] border-[#06E738]
`}
        >
          <RequestCheckIcon className="absolute right-0 top-[-0.85rem] h-[.75rem] w-[.75rem]" />
        </div>
      )
    : showSlash && (
        <>
          <div
            className={`bg-[#0027f433]'} absolute left-[.0625rem] top-[50%] z-10 flex h-[2.125rem] w-[2.125rem] translate-y-[-50%] justify-center rounded-[.5625rem] border-[.125rem] border-[#0027F4]`}
          >
            <RequestSlashIcon className="absolute right-0 top-[-0.85rem] h-[.75rem] w-[.75rem]" />
            <div className="invisible relative top-[-1.3125rem] z-[1] flex justify-center group-hover:visible">
              <ChatIcon className="absolute h-[1.25rem] w-[1.0625rem]" fill={request.color} />
              <p className="absolute font-poppins text-[.6rem] text-white">{request.shortName}</p>
            </div>
          </div>
          <div className="invisible absolute bottom-[-1.625rem] z-10 whitespace-nowrap rounded-[.3125rem] bg-white px-2 py-1 font-apple text-[.875rem] text-sub-2 shadow-shadow-1 group-hover:visible">
            <div
              className="absolute left-[50%] top-[-0.375rem] h-0 w-0 translate-x-[-50%]"
              style={{
                borderTop: '.625rem solid none',
                borderLeft: '.4375rem solid transparent',
                borderRight: '.4375rem solid transparent',
                borderBottom: '.625rem solid white',
              }}
            />
            신청 근무 {request.name}가 반영되지 않았습니다.
          </div>
        </>
      );
}

export default RequestLayer;
