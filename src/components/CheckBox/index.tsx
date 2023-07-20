import { CheckedIcon, NotCheckedIcon } from '@assets/svg';
import 'index.css';

interface Props {
  isChecked: boolean;
  checkedText: string;
  uncheckedText: string;
}

/**
 * 체크박스 + 텍스트 컴포넌트
 * @param isChecked 체크 여부
 * @param checkedText 체크 상태일 때 텍스트
 * @param uncheckedText 체크 안되있는 상태일 때 텍스트
 */
const CheckBox = ({ isChecked, checkedText, uncheckedText }: Props) => {
  return (
    <div className="flex items-center justify-center">
      {isChecked ? (
        <CheckedIcon className="h-[1.5rem] w-[1.5rem] cursor-pointer" />
      ) : (
        <NotCheckedIcon className="h-[1.5rem] w-[1.5rem] cursor-pointer" />
      )}
      <div className="ml-[10px] flex translate-y-[2px] items-center font-apple text-base font-normal text-sub-3">
        {isChecked ? checkedText : uncheckedText}
      </div>
    </div>
  );
};

export default CheckBox;
