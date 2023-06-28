import { useState } from 'react';
import { nurses as tempNurse } from '@mocks/members/data';
import { shiftList } from '@mocks/duty/data';

export type EditTabState = {
  isOpen: boolean;
  isEdit: boolean;
  isAdd: boolean;
  nurse: Nurse;
};

// const defaultNurse: Nurse = {
//   id:
// };

const editTabDefaultState = {
  isOpen: false,
  isEdit: false,
  isAdd: false,
  nurse: tempNurse[0],
};

const useRegistNurse = () => {
  const [editTabState, setEditTabState] = useState<EditTabState>(editTabDefaultState);
  const [nurses, setNurses] = useState<Nurse[]>(tempNurse);

  const closeTab = () => {
    setEditTabState(editTabDefaultState);
  };

  const updateNurse = (id: number, updatedNurse: Nurse) => {
    setNurses((prevNurses) => {
      const nurseArray = prevNurses.map((nurse) => (nurse.id === id ? updatedNurse : nurse));
      nurseArray.sort((a, b) => a.proficiency - b.proficiency);
      return nurseArray;
    });
  };

  const openEdit = (nurse: Nurse) => {
    setEditTabState({
      isOpen: true,
      isEdit: true,
      isAdd: false,
      nurse: nurse,
    });
  };
  const openAdd = () => {
    const temp = [...nurses].sort((a, b) => a.id - b.id);
    const newNurse: Nurse = {
      id: temp[temp.length].id + 1,
      name: '간호사',
      proficiency: 1,
      phone: '01012341234',
      isConnected: false,
      shiftOption: [
        { shift: shiftList[0], prefer: true, avail: true },
        { shift: shiftList[1], prefer: false, avail: true },
        { shift: shiftList[2], prefer: true, avail: true },
      ],
      workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
      workPrefer: [shiftList[1]],
      workRequest: [],
      trait: [],
      accWeekendOff: 0,
    };
    setEditTabState({
      isOpen: true,
      isEdit: false,
      isAdd: true,
      nurse: newNurse,
    });
  };

  return { editTabState, openEdit, openAdd, closeTab, nurses, updateNurse };
};

export default useRegistNurse;
