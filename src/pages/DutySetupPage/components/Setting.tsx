import { PenIcon, SixDotsIcon } from '@assets/svg';
import 'index.css';

interface Props {
  name: string;
  value: string;
  onEdit: () => void;
  isFolded: boolean;
  foldedContext?: JSX.Element;
}

const Setting = ({ name, value, onEdit, isFolded, foldedContext }: Props) => {
  return (
    <div className="mb-[1.5625rem] flex justify-between items-center rounded-[1.25rem] bg-white px-[1.25rem] py-[1.875rem] shadow-shadow-1">
      <div className="flex">
        <SixDotsIcon className="w-[2.375rem]"/>
        <div className="ml-[1.875rem] font-apple text-[2rem] text-sub-2">{name}</div>
      </div>
      <div className="flex items-center">
        <div className="mr-[1.875rem] font-poppins text-[2rem] text-main-1">{value}</div>
        <PenIcon className="w-[2.45rem] cursor-pointer"/>
      </div>
    </div>
  );
};

export default Setting;
