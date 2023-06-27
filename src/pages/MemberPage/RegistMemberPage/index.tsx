import 'index.css';
import EditNurseTab from './components/EditNurseTab';
import NurseCard from './components/NurseCard';
import useRegistNurse from '@pages/MemberPage/RegistMemberPage/useRegistNurse';

import NurseTable from './components/NurseTable';
import NurseCount from './components/NurseCount';

const RegistMemberPage = () => {
  const { editTabState, openEdit, openAdd, nurses, closeTab, updateNurse, addNurse } =
    useRegistNurse();

  return (
    <div className="w-full p-[3.125rem]">
      {/* {nurses.map((nurse) => (
        <NurseCard nurse={nurse} openTab={openEdit} />
      ))} */}
      <NurseCount nurses={nurses} />
      <div className="flex">
        <NurseTable />
        <EditNurseTab
          isAdd={editTabState.isAdd}
          isEdit={editTabState.isEdit}
          nurse={editTabState.nurse}
          closeTab={closeTab}
          updateNurse={updateNurse}
          addNurse={addNurse}
        />
      </div>
      {/* <button type="button" onClick={openAdd}>
        추가하기
      </button> */}
    </div>
  );
};

export default RegistMemberPage;
