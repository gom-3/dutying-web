import 'index.css';
import EditNurseTab from './components/EditNurseTab';
import useRegistNurse from '@pages/MemberPage/RegistMemberPage/useRegistNurse';

import NurseTable from './components/NurseTable';
import NurseCount from './components/NurseCount';

const RegistMemberPage = () => {
  const { editTabState, openEdit, openAdd, nurses, closeTab, updateNurse } =
    useRegistNurse();

  return (
    <div className="p-[3.125rem]">
      <NurseCount nurses={nurses} proficiency={3} />
      <div className="flex">
        <NurseTable nurses={nurses} edit={openEdit} add={openAdd} />
        <EditNurseTab
          nurse={editTabState.nurse}
          updateNurse={updateNurse}
        />
      </div>
    </div>
  );
};

export default RegistMemberPage;
