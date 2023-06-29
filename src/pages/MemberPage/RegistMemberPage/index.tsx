import 'index.css';
import EditNurseTab from './components/EditNurseTab';
import useRegistNurse from '@pages/MemberPage/RegistMemberPage/useRegistNurse';

import NurseTable from './components/NurseTable';
import NurseCount from './components/NurseCount';

const RegistMemberPage = () => {
  const { nurse, selectNurse, addNurse, deleteNurse, nurses, updateNurse } = useRegistNurse();

  return (
    <div className="p-[3.125rem] pt-[2rem]">
      <NurseCount nurses={nurses} proficiency={3} />
      <div className="flex items-start">
        <NurseTable
          nurse={nurse}
          nurses={nurses}
          deleteNurse={deleteNurse}
          edit={selectNurse}
          addNurse={addNurse}
          updateNurse={updateNurse}
        />
        <EditNurseTab nurse={nurse} updateNurse={updateNurse} />
      </div>
    </div>
  );
};

export default RegistMemberPage;
