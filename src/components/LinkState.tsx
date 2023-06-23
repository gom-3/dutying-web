import { LinkedIcon, UnlinkedIcon } from '@assets/svg';
import 'index.css';

interface Props {
  isLinked: boolean;
}

const LinkState = ({ isLinked }: Props) => {
  return (
    <div className="item-center flex justify-center font-apple text-[16px] font-normal text-sub-3">
      {isLinked ? <LinkedIcon className="mr-[10px]" /> : <UnlinkedIcon className="mr-[10px]" />}
      {isLinked ? '연동됨' : '연동 안됨'}
    </div>
  );
};

export default LinkState;
