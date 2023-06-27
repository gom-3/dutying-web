import AvailCheckBox from '@components/AvailCheckBox';
import LinkState from '@components/LinkState';
import 'index.css';

type Props = {
  nurse: Nurse;
  openTab: (nurse: Nurse) => void;
  isFirst: boolean;
  rowspan?: number;
};

const NurseCard = ({ nurse, openTab, isFirst, rowspan }: Props) => {
  const handleEditNurseClick = () => {
    openTab(nurse);
  };

  return (
    <tr>
      {isFirst && (
        <td
          rowSpan={rowspan}
          className="h-[3.5rem] w-[8.75rem] border border-b-0 border-l-0 border-sub-4 text-[1.25rem] font-normal"
        >
          3
        </td>
      )}
      {/* <td className="h-[56px] w-[163px] border border-sub-4 text-[20px] font-normal">1</td> */}
      <td className="h-14 w-[11.625rem] border border-b-0 border-sub-4 font-apple text-[1.25rem] font-normal text-sub-1">
        {nurse.name}
      </td>
      <td className="h-14 w-[10.1875rem] border border-b-0 border-sub-4 text-[1.25rem] font-normal">
        <AvailCheckBox
          isChecked
          onClick={() => {
            console.log('1');
          }}
        />
      </td>
      <td className="h-14 w-[10.1875rem] border border-b-0 border-sub-4 text-[1.25rem] font-normal">
        <AvailCheckBox
          isChecked
          onClick={() => {
            console.log('1');
          }}
        />
      </td>
      <td className="h-14 w-[10.1875rem] border border-b-0 border-sub-4 text-[1.25rem] font-normal">
        <AvailCheckBox
          isChecked
          onClick={() => {
            console.log('1');
          }}
        />
      </td>
      <td className="h-14 w-[10.1875rem] border border-b-0 border-sub-4 text-[1.25rem] font-normal">
        <AvailCheckBox
          isChecked
          onClick={() => {
            console.log('1');
          }}
        />
      </td>
      <td className="h-14 w-[10.8rem] border border-b-0 border-r-0 border-sub-4 text-[1.25rem] font-normal">
        <LinkState isLinked={false} />
      </td>
    </tr>
  );

  // return (
  //   <div className="flex h-16 w-3/4 items-center justify-evenly border border-gray-100 bg-slate-50">
  //     <div>{nurse.proficiency}</div>
  //     <div>{nurse.name}</div>
  //     <div className="flex">
  //       {nurse.workAvailable.map((shift) => (
  //         <div>{shift.name}</div>
  //       ))}
  //     </div>
  //     <AvailCheckBox isChecked={true} onClick={() => {}} />
  //     <div>
  //       {nurse.workPrefer.map((shift) => (
  //         <div>{shift.name}</div>
  //       ))}
  //     </div>
  //     <div>
  //       {nurse.trait.map((str) => (
  //         <div>{str}</div>
  //       ))}
  //     </div>
  //     <div className="cursor-pointer" aria-hidden onClick={handleEditNurseClick}>
  //       수정
  //     </div>
  //   </div>
  // );
};

export default NurseCard;
