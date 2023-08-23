import NurseEditDrawer from './components/NurseEditDrawer';
import ShiftTeamList from './components/ShiftTeamList';
import WardInfo from './components/WardInfo';

function MemberPage() {
  return (
    <div className="flex h-screen w-full flex-col pl-[3.4375rem] pt-[4.375rem]">
      <WardInfo />
      <ShiftTeamList />
      <NurseEditDrawer />
    </div>
  );
}

export default MemberPage;
