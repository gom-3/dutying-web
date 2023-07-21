import { PenIcon } from '@assets/svg';
import 'index.css';

interface Props {
  name: string;
  value: string;
  step: '숙련도' | '연속근무';
  edit: (step: '숙련도' | '연속근무') => void;
}

const Setting = ({ name, value, step, edit }: Props) => {
  const handleClickPenIcon = () => {
    edit(step);
  };

  return (
    <div className="mb-[1.5625rem] flex items-center justify-between rounded-[1.25rem] bg-white px-[1.25rem] py-[1.875rem] shadow-shadow-1">
      <div className="flex items-center">
        <div className="ml-[1rem] h-[.625rem] w-[.625rem] rounded-full bg-sub-3" />
        <div className="ml-[1.875rem] font-apple text-[1.875rem] text-sub-2">{name}</div>
      </div>
      <div className="flex items-center">
        <div className="mr-[1.875rem] font-poppins text-[2rem] text-main-1">{value}</div>
        <PenIcon className="w-[2.45rem] cursor-pointer" onClick={handleClickPenIcon} />
      </div>
    </div>
  );
};

export default Setting;
