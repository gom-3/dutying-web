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
    <div className="border-gray-150 flex h-16 w-3/4 items-center justify-evenly border bg-slate-50">
      <div>{nurse.proficiency}</div>
      <div>{nurse.name}</div>
      <div className='flex'>
        {nurse.workAvailable.map((shift) => (
          <div>{shift.name}</div>
        ))}
      </div>
      <div>
        {nurse.workPrefer.map((shift) => (
          <div>{shift.name}</div>
        ))}
      </div>
      <div>
        {nurse.trait.map((str) => (
          <div>{str}</div>
        ))}
      </div>
      <div className="cursor-pointer" aria-hidden onClick={handleEditNurseClick}>
        수정
      </div>
    </div>
  );
};

export default NurseCard;
