import { CheckedIcon, NotCheckedIcon } from '@assets/svg';
import 'index.css';

interface Props {
  isChecked: boolean;
  onClick: () => void;
}

const AvailCheckBox = ({ isChecked, onClick }: Props) => {
  return (
    <div className="flex items-center justify-center">
      {isChecked ? (
        <CheckedIcon className="cursor-pointer" onClick={onClick} />
      ) : (
        <NotCheckedIcon className="cursor-pointer" onClick={onClick} />
      )}
      <div className="ml-[10px] flex translate-y-[2px] items-center font-apple text-base font-normal text-sub-3">
        {isChecked ? '가능' : '불가능'}
      </div>
    </div>
  );
};

export default AvailCheckBox;
