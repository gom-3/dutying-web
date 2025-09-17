import useEditShiftTeam from '@/hooks/ward/useEditShiftTeam';

interface Props {
  mode: 'isPreferred' | 'isPossible';
}

const ShiftSelect = ({ mode }: Props) => {
  const {
    state: { selectedNurse },
    actions: { updateNurseShift },
  } = useEditShiftTeam();
  const nurseShiftTypes = selectedNurse?.nurseShiftTypes;
  const handleOnClick = (i: number) => {
    if (!selectedNurse) return;

    updateNurseShift(selectedNurse.nurseId, selectedNurse.nurseShiftTypes[i].nurseShiftTypeId, {
      [mode]: !selectedNurse.nurseShiftTypes[i][mode],
    });
  };

  return (
    nurseShiftTypes && (
      <div className="mt-4 flex">
        <div
          onClick={() => handleOnClick(0)}
          className={`mr-5 flex h-11.25 w-23.5 cursor-pointer items-center justify-center rounded-[.3125rem] ${
            nurseShiftTypes[0][mode] ? 'bg-main-2 text-white' : 'border-sub-3 text-sub-3 border'
          } `}
        >
          데이
        </div>
        <div
          onClick={() => handleOnClick(1)}
          className={`mr-5 flex h-11.25 w-23.5 cursor-pointer items-center justify-center rounded-[.3125rem] ${
            nurseShiftTypes[1][mode] ? 'bg-main-2 text-white' : 'border-sub-3 text-sub-3 border'
          } `}
        >
          이브닝
        </div>
        <div
          onClick={() => handleOnClick(2)}
          className={`flex h-11.25 w-23.5 cursor-pointer items-center justify-center rounded-[.3125rem] ${
            nurseShiftTypes[2][mode] ? 'bg-main-2 text-white' : 'border-sub-3 text-sub-3 border'
          } `}
        >
          나이트
        </div>
      </div>
    )
  );
};

export default ShiftSelect;
