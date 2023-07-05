import TextField from '@components/TextField';

/* eslint-disable react-refresh/only-export-components */
interface ContentsProps {
  ward: Ward;
  setWard: (ward: Ward) => void;
}

function Contents({ ward, setWard }: ContentsProps) {
  return (
    <div className="flex h-full w-full justify-evenly">
      <div className="relative flex flex-[7] items-center border-r-[.0625rem] border-sub-4 px-[4.6875rem]">
        <p className="fo nt-apple absolute top-[2.375rem] text-[1.5rem] text-sub-3">병원 • 병동</p>
        <div className="flex w-full justify-center gap-[4.0625rem]">
          <div className="flex items-center gap-[1.25rem]">
            <TextField
              className="h-[3.375rem] w-[9.375rem] text-right text-[2.125rem] text-sub-2.5"
              value={ward.hospital.name}
              onChange={(e) =>
                setWard({ ...ward, hospital: { ...ward.hospital, name: e.target.value } })
              }
            />
            <p className="font-apple text-[2.25rem] font-semibold text-sub-2.5">병원</p>
          </div>
          <div className="flex items-center gap-[1.25rem]">
            <TextField
              className="h-[3.375rem] w-[9.375rem] text-right text-[2.125rem] text-sub-2.5"
              value={ward.name}
              onChange={(e) => setWard({ ...ward, name: e.target.value })}
            />
            <p className="font-apple text-[2.25rem] font-semibold text-sub-2.5">병동</p>
          </div>
        </div>
      </div>
      <div className="relative flex flex-[3] flex-col justify-center px-[4.6875rem]">
        <p className="absolute top-[2.375rem] font-apple text-[1.5rem] text-sub-3">총 간호사 수</p>
        <div className="flex items-center gap-[1.25rem]">
          <TextField
            className="h-[3.375rem] w-[6.25rem] text-right text-[2.125rem] text-sub-2.5"
            value={ward.nurseCnt}
            onChange={(e) => setWard({ ...ward, nurseCnt: parseInt(e.target.value) })}
          />
          <p className="font-apple text-[2.25rem] font-semibold text-sub-2.5">명</p>
        </div>
      </div>
    </div>
  );
}

function Description() {
  return (
    <div className="mx-auto flex h-full w-[80%] flex-col justify-center gap-3">
      <p className="font-apple text-[1.5rem] text-sub-2">
        나이트는 최소 2일 이상 연속 배정이 가능합니다.
      </p>
    </div>
  );
}

export default { Contents, Description };
