import 'index.css';
import Editor from './components/Editor';
import useRegistNurse from './useRegistNurse';
import Table from './components/Table';
import Count from './components/Count';

const RegistMemberPage = () => {
  const { nurse, selectNurse, addNurse, deleteNurse, nurses, updateNurse, updateNurseShift } =
    useRegistNurse();

  return (
    <div className="p-[3.125rem] pt-[2rem]">
      <Count nurses={nurses} level={3} />
      <div className="flex items-start">
        <Table
          nurse={nurse}
          nurses={nurses}
          deleteNurse={deleteNurse}
          edit={selectNurse}
          addNurse={addNurse}
          updateNurseShift={updateNurseShift}
        />
        <Editor nurse={nurse} updateNurse={updateNurse} updateNurseShift={updateNurseShift} />
      </div>
    </div>
  );
};

export default RegistMemberPage;
