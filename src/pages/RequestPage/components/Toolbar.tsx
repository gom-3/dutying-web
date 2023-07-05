import { NextIcon, PrevIcon } from '@assets/svg';
import Button from '@components/Button';
import Select from '@components/Select';

interface Props {
  requestDuty: RequestDuty;
  selectedNurse: Nurse | null;
  setSelectedNurse: (nurse: Nurse | null) => void;
}

function Toolbar({ requestDuty, selectedNurse, setSelectedNurse }: Props) {
  const spreadDuty = requestDuty.requestRowsByLevel.flatMap((row) => row.dutyRows);
  return (
    <div className="sticky top-0 flex h-[6.125rem] w-full items-center gap-[1.25rem] bg-[#FDFCFE] pt-[1.875rem]">
      <Select
        value={selectedNurse?.id || ''}
        options={spreadDuty.map((rows) => ({ label: rows.user.name, value: rows.user.id }))}
        onChange={(e) =>
          setSelectedNurse(
            spreadDuty.find((rows) => rows.user.id === parseInt(e.target.value))?.user || null
          )
        }
        className="absolute left-[.125rem] h-[2.1875rem] w-[10.1875rem]"
      ></Select>
      <div className="w-[3.375rem]"></div>
      <div className="w-[3.375rem]"></div>
      <div className="w-[1.875rem]"></div>
      <div className="w-[5.625rem]"></div>
      <div className="flex flex-1 items-center gap-[1.25rem]">
        <PrevIcon className="h-[1.875rem] w-[1.875rem] cursor-pointer" />
        <p className="font-poppins text-2xl text-main-1">{requestDuty.month}월</p>
        <NextIcon className="h-[1.875rem] w-[1.875rem] cursor-pointer" />
      </div>

      <Button
        type="outline"
        className="h-[2.5rem] w-[4.6875rem] border-[.0938rem] text-[1.25rem] font-normal"
      >
        저장
      </Button>
    </div>
  );
}

export default Toolbar;
