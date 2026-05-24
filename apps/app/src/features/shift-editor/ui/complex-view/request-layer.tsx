import {type TWardShiftType} from '@/entities';
import {RequestCheckIcon, RequestSlashIcon} from '@/shared/assets/svg';

interface IProps {
    request: TWardShiftType;
    isAccept: boolean;
    showCheck: boolean;
    showSlash: boolean;
}

function RequestLayer({isAccept, request, showCheck, showSlash}: IProps) {
    return isAccept
        ? showCheck && (
              <div className="absolute inset-y-0.5 left-[.0625rem] right-[.0625rem] z-10">
                  <div className="absolute inset-0 z-10 rounded-[.5625rem] border-[.125rem] border-[#06E738] bg-[#06e73833]" aria-hidden />
                  <RequestCheckIcon className="pointer-events-none absolute -top-0.5 right-0 z-20 h-3 w-3" />
              </div>
          )
        : showSlash && (
              <div className="group absolute inset-y-0.5 left-[.0625rem] right-[.0625rem] z-10">
                  <div className="absolute inset-0 z-10 rounded-[.5625rem] border-[.125rem] border-[#0027F4] bg-[#0027f433]" aria-hidden />
                  <RequestSlashIcon className="pointer-events-none absolute -top-0.5 right-0 z-20 h-3 w-3" />
                  <div className="pointer-events-none invisible absolute top-[calc(100%+0.25rem)] left-1/2 z-[100] w-max max-w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md bg-white px-2.5 py-1.5 text-left font-apple text-xs leading-snug whitespace-normal text-sub-1 shadow-lg ring-1 ring-black/10 group-hover:visible">
                      신청 근무 {request.name}가 반영되지 않았습니다.
                  </div>
              </div>
          );
}

export default RequestLayer;
