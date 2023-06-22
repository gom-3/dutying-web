import Select from '@components/Select';

/* eslint-disable react-refresh/only-export-components */
interface ContentsProps {
  shiftList: Shift[];
  straight: DutyConstraint['straight'];
  setStraight: (straight: DutyConstraint['straight']) => void;
}

function Contents({ shiftList, straight, setStraight }: ContentsProps) {
  return (
    <div className="flex h-full w-full justify-evenly">
      <div className="relative flex flex-col justify-center ">
        <p className="absolute top-[38px]">연속 일반 근무</p>
        <div className="flex">
          <div className="flex items-center">
            {shiftList.slice(1).map((shift, index) => {
              return (
                <div>
                  <p>{shift.fullname}</p>
                  <Select
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
      </div>
      <div className="h-full w-[1px] bg-sub-4" />
      <div className="relative flex flex-col justify-center">
        <p className="absolute top-[38px]">연속 오프</p>
        <div className="flex">
          <div className="flex items-center">
            오프
            <Select
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
      </div>
    </div>
  );
}

function Description() {
  return (
    <div className="mx-auto flex h-full w-[80%] flex-col justify-center gap-3">
      <p className="font-apple text-[24px] text-sub-2">
        나이트는 최소 2일 이상 연속 배정이 가능합니다.
      </p>
    </div>
  );
}

export default { Contents, Description };
