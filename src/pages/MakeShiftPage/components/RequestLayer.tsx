import { ChatIcon, RequestCheckIcon, RequestSlashIcon } from '@/assets/svg';
import { type WardShiftType } from '@/types/ward';

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
          className={`bg-[#06e73833]'} absolute top-[50%] left-[.0625rem] z-10 flex h-8.5 w-8.5 translate-y-[-50%] justify-center rounded-[.5625rem] border-[.125rem] border-[#06E738]`}
        >
          <RequestCheckIcon className="absolute top-[-0.85rem] right-0 h-[.75rem] w-[.75rem]" />
        </div>
      )
    : showSlash && (
        <>
          <div
            className={`bg-[#0027f433]'} absolute top-[50%] left-[.0625rem] z-10 flex h-8.5 w-8.5 translate-y-[-50%] justify-center rounded-[.5625rem] border-[.125rem] border-[#0027F4]`}
          >
            <RequestSlashIcon className="absolute top-[-0.85rem] right-0 h-[.75rem] w-[.75rem]" />
            <div className="invisible relative -top-5.25 z-1 flex justify-center group-hover:visible">
              <ChatIcon className="absolute h-5 w-4.25" fill={request.color} />
              <p className="font-poppins absolute text-[.6rem] text-white">{request.shortName}</p>
            </div>
          </div>
          <div className="font-apple text-sub-2 shadow-banner invisible absolute -bottom-6.5 z-10 rounded-[.3125rem] bg-white px-2 py-1 text-[.875rem] whitespace-nowrap group-hover:visible">
            <div
              className="absolute -top-1.5 left-[50%] h-0 w-0 translate-x-[-50%]"
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
