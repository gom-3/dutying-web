import 'index.css';
import { EditTabState } from '..';

type Props = {
  nurse: Nurse;
  openTab: (state: EditTabState) => void;
};

const NurseCard = ({ nurse, openTab }: Props) => {
  const handleEditNurseClick = () => {
    openTab({
      isOpen: true,
      isAdd: false,
      isEdit: true,
      nurse: nurse,
    });
  };

  return (
    <div className="flex items-center border border-gray-150 justify-evenly w-3/4 h-16 bg-slate-50">
      <div>{nurse.proficiency}</div>
      <div>{nurse.name}</div>
      <div>
        {nurse.workAvailable.map((shift) => (
          <div>{shift.fullname}</div>
        ))}
      </div>
      <div>
        {nurse.workPrefer.map((shift) => (
          <div>{shift.fullname}</div>
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
