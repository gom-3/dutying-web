import AvailCheckBox from '@components/AvailCheckBox';
import LinkState from '@components/LinkState';
import 'index.css';

type Props = {
  nurse: Nurse;
  openTab: (nurse: Nurse) => void;
};

const NurseCard = ({ nurse, openTab }: Props) => {
  const handleEditNurseClick = () => {
    openTab(nurse);
  };

  return (
    <tr className="border">
      {/* <td className="h-[56px] w-[163px] border border-sub-4 text-[20px] font-normal">1</td> */}
      <td className="h-[56px] w-[186px] border border-sub-4 font-apple text-[20px] font-normal text-sub-1">
        {nurse.name}
      </td>
      <td className="h-[56px] w-[163px] border border-sub-4 text-[20px] font-normal">
        <AvailCheckBox
          isChecked
          onClick={() => {
            console.log('1');
          }}
        />
      </td>
      <td className="h-[56px] w-[163px] border border-sub-4 text-[20px] font-normal">
        <AvailCheckBox
          isChecked
          onClick={() => {
            console.log('1');
          }}
        />
      </td>
      <td className="h-[56px] w-[163px] border border-sub-4 text-[20px] font-normal">
        <AvailCheckBox
          isChecked
          onClick={() => {
            console.log('1');
          }}
        />
      </td>
      <td className="h-[56px] w-[163px] border border-sub-4 text-[20px] font-normal">
        <AvailCheckBox
          isChecked
          onClick={() => {
            console.log('1');
          }}
        />
      </td>
      <td className="h-[56px] w-[163px] border border-sub-4 text-[20px] font-normal">
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
