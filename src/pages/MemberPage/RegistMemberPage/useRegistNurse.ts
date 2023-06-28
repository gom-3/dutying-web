import { useEffect, useState } from 'react';
import { nurses as tempNurse } from '@mocks/members/data';
import { shiftList } from '@mocks/duty/data';

const useRegistNurse = () => {
  const [nurse, setNurse] = useState(tempNurse[0]);
  const [nurses, setNurses] = useState<Nurse[]>(tempNurse);

  useEffect(() => {
    const id = nurse.id;
    const temp = nurses.find((n) => n.id === id);
    setNurse(temp || nurses[0]);
  }, [nurses]);

  const updateNurse = (id: number, updatedNurse: Nurse) => {
    console.log(id);
    console.log(updatedNurse);
    setNurses((prevNurses) => {
      const nurseArray = prevNurses.map((nurse) => (nurse.id === id ? updatedNurse : nurse));
      nurseArray.sort((a, b) => a.proficiency - b.proficiency);
      return nurseArray;
    });
  };

  const openEdit = (nurse: Nurse) => {
    setNurse(nurse);
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
    setNurse(newNurse);
  };

  return { nurse, openEdit, openAdd, nurses, updateNurse };
};

export default useRegistNurse;
