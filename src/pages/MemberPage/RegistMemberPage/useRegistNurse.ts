import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { nurses as tempNurse } from '@mocks/nurse/data';
import { mockShiftList } from '@mocks/duty/data';
import { getNurses } from '@libs/api/nurse';

const useRegistNurse = () => {
  const [nurse, setNurse] = useState<Nurse>(tempNurse[0]);
  const [nurses, setNurses] = useState<Nurse[]>(tempNurse);

  const { data, isLoading, isError } = useQuery(['nurses'], getNurses);

  useEffect(() => {
    // if(data && !isError && !isLoading) setNurses(data);
  }, [data, isLoading, isError]);

  useEffect(() => {
    const id = nurse.nurseId;
    const temp = nurses.find((n) => n.nurseId === id);
    setNurse(temp || nurses[0]);
    getNurses();
  }, [nurses]);

  const updateNurse = (id: number, updatedNurse: Nurse) => {
    setNurses((prevNurses) => {
      const nurseArray = prevNurses.map((nurse) => (nurse.nurseId === id ? updatedNurse : nurse));
      nurseArray.sort((a, b) => a.level - b.level);
      return nurseArray;
    });
  };

  const selectNurse = (nurse: Nurse) => {
    setNurse(nurse);
  };

  const addNurse = () => {
    const temp = [...nurses].sort((a, b) => a.nurseId - b.nurseId);
    const newNurse: Nurse = {
      nurseId: temp[temp.length - 1].nurseId + 1,
      accountId: null,
      wardId: 1, // store 값으로 변경
      name: '간호사',
      level: 1,
      phoneNum: '01012341234',
      isConnected: false,
      isAssistant: false,
      isDutyManager: false,
      isWardManager: false,
      gender: '여',
      employmentDate: '2010-10-10',
      nurseShiftTypes: mockShiftList.map((shift, index) => ({
        nurseShiftTypeId: index, // shift에 id 추가해서 변경
        name: shift.name,
        shoftName: shift.shortName,
        isPossible: true,
        isPreferred: false,
      })),
    };
    temp.push(newNurse);
    setNurse(newNurse);
    setNurses(temp);
  };

  const deleteNurse = (id: number) => {
    const temp = [...nurses].filter((nurse) => nurse.nurseId !== id);
    setNurses(temp);
  };

  return { nurse, selectNurse, addNurse, deleteNurse, nurses, updateNurse };
};

export default useRegistNurse;
