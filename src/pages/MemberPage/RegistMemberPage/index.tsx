import Editor from './components/Editor';
import Count from './components/Count';
import NurseTable from './components/NurseTable';

const RegistMemberPage = () => {
  return (
    <div className="p-[3.125rem] pt-[2rem]">
      <Count level={3} />
      <div className="flex items-start">
        <NurseTable />
        <Editor />
      </div>
    </div>
  );
};

export default RegistMemberPage;
