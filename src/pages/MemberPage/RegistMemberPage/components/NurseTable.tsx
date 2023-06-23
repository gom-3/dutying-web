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
        <tbody className="block h-[737px] w-[1163px] overflow-y-auto overflow-x-hidden">
          <td
            rowSpan={3}
            className="h-[56px] w-[140px] border border-sub-4 text-[20px] font-normal"
          >
            4
          </td>
          <NurseCard
            nurse={nurses[0]}
            openTab={() => {
              console.log('1');
            }}
          />
          <NurseCard
            nurse={nurses[1]}
            openTab={() => {
              console.log('1');
            }}
          />
          <td
            rowSpan={3}
            className="h-[56px] w-[140px] border border-sub-4 text-[20px] font-normal"
          >
            3
          </td>
          <NurseCard
            nurse={nurses[2]}
            openTab={() => {
              console.log('1');
            }}
          />
          <NurseCard
            nurse={nurses[2]}
            openTab={() => {
              console.log('1');
            }}
          />
          <td
            rowSpan={5}
            className="h-[56px] w-[140px] border border-sub-4 text-[20px] font-normal"
          >
            2
          </td>
          <NurseCard
            nurse={nurses[3]}
            openTab={() => {
              console.log('1');
            }}
          />
          <NurseCard
            nurse={nurses[4]}
            openTab={() => {
              console.log('1');
            }}
          />
          <NurseCard
            nurse={nurses[4]}
            openTab={() => {
              console.log('1');
            }}
          />
          <NurseCard
            nurse={nurses[4]}
            openTab={() => {
              console.log('1');
            }}
          />
          <td
            rowSpan={5}
            className="h-[56px] w-[140px] border border-sub-4 text-[20px] font-normal"
          >
            2
          </td>
          <NurseCard
            nurse={nurses[3]}
            openTab={() => {
              console.log('1');
            }}
          />
          <NurseCard
            nurse={nurses[4]}
            openTab={() => {
              console.log('1');
            }}
          />
          <NurseCard
            nurse={nurses[4]}
            openTab={() => {
              console.log('1');
            }}
          />
          <NurseCard
            nurse={nurses[4]}
            openTab={() => {
              console.log('1');
            }}
          />
          <td
            rowSpan={5}
            className="h-[56px] w-[140px] border border-sub-4 text-[20px] font-normal"
          >
            2
          </td>
          <NurseCard
            nurse={nurses[3]}
            openTab={() => {
              console.log('1');
            }}
          />
          <NurseCard
            nurse={nurses[4]}
            openTab={() => {
              console.log('1');
            }}
          />
          <NurseCard
            nurse={nurses[4]}
            openTab={() => {
              console.log('1');
            }}
          />
          <NurseCard
            nurse={nurses[4]}
            openTab={() => {
              console.log('1');
            }}
          />
        </tbody>
      </table>
    </div>
  );
};

export default NurseTable;
