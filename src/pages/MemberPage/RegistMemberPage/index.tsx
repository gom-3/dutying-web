import { useState } from 'react';
import 'index.css';
import EditNurseTab from './components/EditNurseTab';
import { nurses } from '@mocks/members/data';
import NurseCard from './components/NurseCard';

export type EditTabState = {
  isOpen: boolean;
  isEdit: boolean;
  isAdd: boolean;
  nurse: Nurse | undefined;
};

const editTabDefaultState = {
  isOpen: false,
  isEdit: false,
  isAdd: false,
  nurse: undefined,
};

const RegistMemberPage = () => {
  const [editTabState, setEditTabState] = useState<EditTabState>(editTabDefaultState);

  const closeTab = () => {
    setEditTabState(editTabDefaultState);
  };

  return (
    <div>
      {editTabState.isOpen && (
        <EditNurseTab
          isAdd={editTabState.isAdd}
          isEdit={editTabState.isEdit}
          nurse={editTabState.nurse}
          closeTab={closeTab}
        />
      )}
      {nurses.map((nurse) => (
        <NurseCard nurse={nurse} openTab={setEditTabState} />
      ))}
    </div>
  );
};

export default RegistMemberPage;
