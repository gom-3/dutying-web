/* eslint-disable react-refresh/only-export-components */
interface ContentsProps {
  requestDutyType: DutyConstraint['requestDutyType'];
  setRequestDutyType: (requestDutyType: DutyConstraint['requestDutyType']) => void;
}

function Contents({ requestDutyType, setRequestDutyType }: ContentsProps) {
  return (
    <div className="mt-[3.125rem] h-[22rem] w-[76%] rounded-[1.25rem] bg-white shadow-[0rem_.25rem_2.125rem_#EDE9F5]">
      <div className="mx-auto h-full w-[80%] pt-[4.375rem]">
        <p className="font-apple text-[1.5rem] text-sub-2">
          근무 신청은{' '}
          <span className="text-[1.75rem] font-medium">
            {requestDutyType === 'off' ? 'OFF만 ' : '모두 '}
          </span>
          가능합니다.
        </p>
        <div className="mt-[1.875rem] flex gap-[10%]">
          <button
            className={`h-[6.25rem] flex-1 rounded-[.9375rem] font-apple text-[2.25rem] font-medium
              ${requestDutyType === 'off' ? 'bg-main-1 text-white' : 'bg-sub-4.5 text-sub-2.5'}`}
            onClick={() => setRequestDutyType('off')}
          >
            OFF만 신청
          </button>
          <button
            className={`h-[6.25rem] flex-1 rounded-[.9375rem] font-apple text-[2.25rem] font-medium
              ${requestDutyType === 'all' ? 'bg-main-1 text-white' : 'bg-sub-4.5 text-sub-2.5'}`}
            onClick={() => setRequestDutyType('all')}
          >
            모두 신청
          </button>
        </div>
      </div>{' '}
    </div>
  );
}

export default { Contents };
