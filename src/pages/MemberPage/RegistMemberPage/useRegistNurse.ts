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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nurses]);

  const updateNurse = (id: number, updatedNurse: Nurse) => {
    setNurses((prevNurses) => {
      const nurseArray = prevNurses.map((nurse) => (nurse.id === id ? updatedNurse : nurse));
      nurseArray.sort((a, b) => a.proficiency - b.proficiency);
      return nurseArray;
    });
  };

  const selectNurse = (nurse: Nurse) => {
    setNurse(nurse);
  };

  const addNurse = () => {
    const temp = [...nurses].sort((a, b) => a.id - b.id);
    const newNurse: Nurse = {
      id: temp[temp.length - 1].id + 1,
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
    temp.push(newNurse);
    setNurse(newNurse);
    setNurses(temp);
  };

  const deleteNurse = (id: number) => {
    const temp = [...nurses].filter((nurse) => nurse.id !== id);
    setNurses(temp);
  };

  return { nurse, selectNurse, addNurse, deleteNurse, nurses, updateNurse };
};

export default useRegistNurse;
