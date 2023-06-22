import Select from '@components/Select';

/* eslint-disable react-refresh/only-export-components */
interface ContentsProps {
  shiftList: Shift[];
  straight: DutyConstraint['straight'];
  setStraight: (straight: DutyConstraint['straight']) => void;
}

function Contents({ shiftList, straight, setStraight }: ContentsProps) {
  return (
    <div className="mt-[3.125rem] h-[22rem] w-[76%] rounded-[1.25rem] bg-white shadow-[0rem_.25rem_2.125rem_#EDE9F5]">
      <div className="flex h-full w-full justify-evenly">
        <div className="relative flex flex-[7] items-center border-r-[.0625rem] border-sub-4 px-10">
          <p
            className="fo nt-apple absolute
        top-[2.375rem] text-[1.5rem] text-sub-3"
          >
            연속 일반 근무
          </p>
          <div className="flex flex-1 gap-[4.375rem]">
            {shiftList.slice(1).map((shift, index) => {
              return (
                <div key={index} className="flex items-center gap-[1.25rem]">
                  <p className="font-apple text-[2.25rem] font-semibold text-sub-2.5">
                    {shift.fullname}
                  </p>
                  <Select
                    className="h-[3.375rem] w-[6.25rem] text-[2.125rem] text-sub-2.5"
                    value={straight[index + 1]}
                    onChange={(e) =>
                      setStraight(
                        straight.map((_, i) => (i === index + 1 ? parseInt(e.target.value) : _))
                      )
                    }
                    options={[
                      { value: 2, label: '2일' },
                      { value: 3, label: '3일' },
                      { value: 4, label: '4일' },
                      { value: 5, label: '5일' },
                    ]}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative flex flex-[3] flex-col justify-center px-10">
          <p className="absolute top-[2.375rem] font-apple text-[1.5rem] text-sub-3">연속 오프</p>
          <div className="flex items-center gap-[1.25rem]">
            <p className="font-apple text-[2.25rem] font-semibold text-sub-2.5">
              {shiftList[0].fullname}
            </p>
            <Select
              className="h-[3.375rem] w-[6.25rem] text-[2.125rem] text-sub-2.5"
              value={straight[0]}
              onChange={(e) =>
                setStraight(straight.map((_, i) => (i === 0 ? parseInt(e.target.value) : _)))
              }
              options={[
                { value: 2, label: '2일' },
                { value: 3, label: '3일' },
                { value: 4, label: '4일' },
                { value: 5, label: '5일' },
              ]}
            />
          </div>
        </div>
      </div>{' '}
    </div>
  );
}

function Description() {
  return (
    <div className="mt-[1.875rem] h-[12.125rem] w-[76%] rounded-[1.25rem] bg-[#EDE4FF] shadow-[0rem_.25rem_2.125rem_#EDE9F5]">
      <div className="mx-auto flex h-full w-[80%] flex-col justify-center gap-3">
        <p className="font-apple text-[1.5rem] text-sub-2">
          나이트는 최소 2일 이상 연속 배정이 가능합니다.
        </p>
      </div>
    </div>
  );
}

export default { Contents, Description };
