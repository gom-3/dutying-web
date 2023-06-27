import Select from '@components/Select';

/* eslint-disable react-refresh/only-export-components */
interface ContentsProps {
  nightInterval: number;
  setNightInterval: (nightInterval: number) => void;
}

function Contents({ nightInterval, setNightInterval }: ContentsProps) {
  return (
    <div className="mt-[3.125rem] h-[22rem] w-[76%] rounded-[1.25rem] bg-white shadow-[0rem_.25rem_2.125rem_#EDE9F5]">
      <div className="mx-auto h-full w-[80%] pt-[4.375rem]">
        <p className="font-apple text-[1.5rem] text-sub-2">
          마지막 나이트부터 다음 나이트까지
          <span className="text-[1.75rem] font-semibold"> {nightInterval}일</span> 간격으로
          설정합니다.
        </p>
        <div className="mt-[1.875rem] flex gap-[1.875rem]">
          <p className="font-apple text-[2.25rem] font-semibold text-sub-2.5">나이트 간격</p>
          <Select
            value={nightInterval}
            className="h-[3.375rem] w-[6.25rem] text-[2.125rem] text-sub-2.5"
            onChange={(e) => {
              setNightInterval(parseInt(e.target.value));
            }}
            options={[...Array.from({ length: 7 })].map((_, x) => ({
              value: x + 2,
              label: x + 2 + '일',
            }))}
          />
        </div>
      </div>{' '}
    </div>
  );
}

export default { Contents };
