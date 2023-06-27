import 'index.css';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import NurseCard from './NurseCard';
import { nurses } from '@mocks/members/data';

const NurseTable = () => {
  return (
    <div className="mt-[3.875rem]">
      <table className="border-collapse rounded-[1.25rem] border-hidden text-center shadow-shadow-1">
        <thead className="block h-[3.5rem] w-[72.6875rem] rounded-[20px]">
          <tr className="rounded-[20px] bg-sub-5 font-apple font-normal text-sub-2.5">
            <th className="h-[3.5rem] w-[8.75rem] items-center justify-center rounded-tl-[1.25rem] text-[1.25rem] font-normal">
              숙련도
            </th>
            <th className="h-[3.5rem] w-[11.625rem] items-center justify-center text-[1.25rem] font-normal">
              이름
            </th>
            <th className="h-[3.5rem] w-[10.1875rem] items-center justify-center text-[1.25rem] font-normal">
              데이
            </th>
            <th className="h-[3.5rem] w-[10.1875rem] items-center justify-center text-[1.25rem] font-normal">
              이브닝
            </th>
            <th className="h-[3.5rem] w-[10.1875rem] items-center justify-center text-[1.25rem] font-normal">
              나이트
            </th>
            <th className="h-[3.5rem] w-[10.1875rem] items-center justify-center text-[1.25rem] font-normal">
              평일만 근무
            </th>
            <th className="h-[3.5rem] w-[12.1875rem] items-center justify-center rounded-tr-[1.25rem] text-[1.25rem] font-normal">
              근무자 연동
            </th>
          </tr>
        </thead>
        {/* <SimpleBar autoHide={false} style={{ maxHeight: 540 }}> */}
        <tbody className="scroll block max-h-[34.0625rem] w-[72.6875rem] border-collapse overflow-x-hidden overflow-y-scroll rounded-b-[20px]">
          {nurses[0].map((nurse, i) => (
            <NurseCard
              isFirst={i === 0}
              rowspan={nurses[0].length}
              nurse={nurse}
              openTab={() => {
                console.log('1');
              }}
            />
          ))}
          {nurses[1].map((nurse, i) => (
            <NurseCard
              isFirst={i === 0}
              rowspan={nurses[1].length}
              nurse={nurse}
              openTab={() => {
                console.log('1');
              }}
            />
          ))}
          {nurses[2].map((nurse, i) => (
            <NurseCard
              isFirst={i === 0}
              rowspan={nurses[2].length}
              nurse={nurse}
              openTab={() => {
                console.log('1');
              }}
            />
          ))}
        </tbody>
        {/* </SimpleBar> */}
      </table>
    </div>
  );
};

export default NurseTable;
