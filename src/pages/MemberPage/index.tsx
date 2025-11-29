import NurseEditDrawer from './components/NurseEditDrawer';
import ShiftTeamList from './components/ShiftTeamList';
import WardInfo from './components/WardInfo';

function MemberPage() {
    return (
        <div className="flex h-screen w-full flex-col pt-17.5 pl-13.75">
            <WardInfo />
            <ShiftTeamList />
            <NurseEditDrawer />
        </div>
    );
}

export default MemberPage;
