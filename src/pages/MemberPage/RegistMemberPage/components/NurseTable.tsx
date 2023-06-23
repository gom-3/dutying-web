import AvailCheckBox from '@components/AvailCheckBox';
import 'index.css';
import NurseCard from './NurseCard';
import { nurses } from '@mocks/members/data';

const NurseTable = () => {
  return (
    <div className="h-[400px] w-[1163px]">
      <table className="text-center">
        <div className="w-[1163px]">
          <div className="flex bg-sub-5 font-apple font-normal text-sub-2.5">
            <div className="flex h-[56px] w-[140px] items-center justify-center text-[20px] font-normal">
              숙련도
            </div>
            <div className="flex h-[56px] w-[186px] items-center justify-center text-[20px] font-normal">
              이름
            </div>
            <div className="flex h-[56px] w-[163px] items-center justify-center text-[20px] font-normal">
              데이
            </div>
            <div className="flex h-[56px] w-[163px] items-center justify-center text-[20px] font-normal">
              이브닝
            </div>
            <div className="flex h-[56px] w-[163px] items-center justify-center text-[20px] font-normal">
              나이트
            </div>
            <div className="flex h-[56px] w-[163px] items-center justify-center text-[20px] font-normal">
              평일만 근무
            </div>
            <div className="flex h-[56px] w-[163px] items-center justify-center text-[20px] font-normal">
              근무자 연동
            </div>
          </div>
        </div>
        <tbody className="block h-[200px] w-[1163px] overflow-y-auto overflow-x-hidden">
          <td
            rowSpan={2}
            className="h-[56px] w-[163px] border border-sub-4 text-[20px] font-normal"
          >
            1
          </td>
          <NurseCard nurse={nurses[0]} openTab={() => {}} />
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NurseTable;
