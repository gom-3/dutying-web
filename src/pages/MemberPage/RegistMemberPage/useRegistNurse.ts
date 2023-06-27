import { useState } from 'react';
import { nurses as tempNurse } from '@mocks/members/data';

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

const useRegistNurse = () => {
  const [editTabState, setEditTabState] = useState<EditTabState>(editTabDefaultState);
  const [nurses, setNurses] = useState<Nurse[][]>(tempNurse);

  const closeTab = () => {
    setEditTabState(editTabDefaultState);
  };

  const updateNurse = (id: number, updatedNurse: Nurse) => {
    // setNurses((prevNurses) => {
    //   const nurseArray = prevNurses.map((nurse) => (nurse.id === id ? updatedNurse : nurse));
    //   nurseArray.sort((a, b) => a.proficiency - b.proficiency);
    //   return nurseArray;
    // });
  };

  const addNurse = (newNurse: Nurse) => {
    // setNurses((prevNurses) => {
    //   const nurseArray = [...prevNurses, newNurse];
    //   nurseArray.sort((a, b) => a.proficiency - b.proficiency);
    //   return nurseArray;
    // });
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
    setEditTabState({
      isOpen: true,
      isEdit: false,
      isAdd: true,
      nurse: undefined,
    });
  };

  return { editTabState, openEdit, openAdd, closeTab, nurses, updateNurse, addNurse };
};

export default useRegistNurse;
