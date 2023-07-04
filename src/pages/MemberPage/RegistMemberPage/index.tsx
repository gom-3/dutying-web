import 'index.css';
import Editor from './components/Editor';
import useRegistNurse from './useRegistNurse';
import Table from './components/Table';
import Count from './components/Count';

const RegistMemberPage = () => {
  const { nurse, selectNurse, addNurse, deleteNurse, nurses, updateNurse } = useRegistNurse();

  return (
    <div className="p-[3.125rem] pt-[2rem]">
      <Count nurses={nurses} proficiency={3} />
      <div className="flex items-start">
        <Table
          nurse={nurse}
          nurses={nurses}
          deleteNurse={deleteNurse}
          edit={selectNurse}
          addNurse={addNurse}
          updateNurse={updateNurse}
        />
        <Editor nurse={nurse} updateNurse={updateNurse} />
      </div>
    </div>
  );
};

export default RegistMemberPage;
