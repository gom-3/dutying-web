import { CheckedIcon, NotCheckedIcon } from '@assets/svg';
import 'index.css';

interface Props {
  isChecked: boolean;
}

const AvailCheckBox = ({ isChecked }: Props) => {
  return (
    <div className="flex items-center justify-center">
      {isChecked ? (
        <CheckedIcon className="cursor-pointer" />
      ) : (
        <NotCheckedIcon className="cursor-pointer" />
      )}
      <div className="ml-[10px] flex translate-y-[2px] items-center font-apple text-base font-normal text-sub-3">
        {isChecked ? '가능' : '불가능'}
      </div>
    </div>
  );
};

export default AvailCheckBox;
