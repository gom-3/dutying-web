import { LinkedIcon, UnlinkedIcon } from '@assets/svg';
import 'index.css';

interface Props {
  isConnected: boolean;
  textVisible?: boolean;
}

/** 간호사 연동 상태 
 * @param isConnected 간호사용 모바일 앱으로 병동과 연동된 간호사
 * @param textVisible 아이콘 옆에 연동됨, 연동안됨 텍스트 노출.
*/
const ConnectState = ({ isConnected, textVisible }: Props) => {
  return (
    <div className="item-center flex justify-center font-apple text-[1rem] font-normal text-sub-3">
      {isConnected ? (
        <LinkedIcon className="h-[1.5rem] w-[1.5rem]" />
      ) : (
        <UnlinkedIcon className="h-[1.5rem] w-[1.5rem]" />
      )}
      {textVisible && (
        <div className="ml-[.625rem] flex items-center">{isConnected ? '연동됨' : '연동 안됨'}</div>
      )}
    </div>
  );
};

export default ConnectState;
