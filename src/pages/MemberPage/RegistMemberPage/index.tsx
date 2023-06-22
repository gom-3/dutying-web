import 'index.css';
import EditNurseTab from './components/EditNurseTab';
import NurseCard from './components/NurseCard';
import useRegistNurse from '@pages/MemberPage/RegistMemberPage/useRegistNurse';
import NurseTable from './components/NurseTable';

const RegistMemberPage = () => {
  const { editTabState, openEdit, openAdd, nurses, closeTab, updateNurse, addNurse } =
    useRegistNurse();

  return (
    <div className="w-full">
      {editTabState.isOpen && (
        <EditNurseTab
          isAdd={editTabState.isAdd}
          isEdit={editTabState.isEdit}
          nurse={editTabState.nurse}
          closeTab={closeTab}
          updateNurse={updateNurse}
          addNurse={addNurse}
        />
      )}
      {nurses.map((nurse) => (
        <NurseCard nurse={nurse} openTab={openEdit} />
      ))}
      <NurseTable />
      <button type="button" onClick={openAdd}>
        추가하기
      </button>
    </div>
  );
};

export default RegistMemberPage;
