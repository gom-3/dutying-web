/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useShiftList } from 'stores/shiftStore';

export type CheckState = {
  [key: string]: boolean;
};

const useEditNurseTab = (
  nurse: Nurse,
  closeTab: () => void,
  isAdd: boolean,
  isEdit: boolean,
  updateNurse: (id: number, updatedNurse: Nurse) => void,
  addNurse: (newNurse: Nurse) => void
) => {
  const [form, setForm] = useState(nurse);
  const [availChecked, setAvailChecked] = useState<CheckState>({});
  const [preferChecked, setPreferChecked] = useState<CheckState>({});
  const ref = useOnclickOutside(() => closeTab());
  const shiftList = useShiftList();

  useEffect(() => {
    let tempAvail: CheckState = {};
    shiftList.forEach((_, index) => {
      tempAvail = { ...tempAvail, [index]: false };
    });
    let tempPrefer: CheckState = {};
    shiftList.forEach((_, index) => {
      tempPrefer = { ...tempPrefer, [index]: false };
    });

    if (isEdit) {
      nurse.workAvailable.forEach((_, index) => (tempAvail[index] = true));
      nurse.workPrefer.forEach((_, index) => (tempPrefer[index] = true));
    }
    if (isAdd) {
      for (const key in tempAvail) tempAvail[key] = true;
    }

    setAvailChecked(tempAvail);
    setPreferChecked(tempPrefer);
  }, [shiftList]);

  /** 가능 근무, 선호 근무 체크리스트 업데이트 */
  useEffect(() => {
    const updatedWorkAvailable: Shift[] = [];
    const updatedWorkPrefer: Shift[] = [];

    for (const key in availChecked) {
      if (availChecked[key] === true) {
        const item = shiftList.find((_, index) => index === +key);
        if (item) updatedWorkAvailable.push(item);
      }
      if (preferChecked[key] === true) {
        const item = shiftList.find((_, index) => index === +key);
        if (item) updatedWorkPrefer.push(item);
      }
    }
    setForm((prev) => ({
      ...prev,
      workAvailable: updatedWorkAvailable,
      workPrefer: updatedWorkPrefer,
    }));
  }, [availChecked, preferChecked]);

  const handleAvailCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;

    setAvailChecked((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handlePreferCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;

    setPreferChecked((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSaveButton = () => {
    if (isAdd) addNurse(form);
    if (isEdit) updateNurse(form.id, form);
  };

  return {
    formState: { form, availChecked, preferChecked },
    shiftList,
    ref,
    handlers: {
      handleAvailCheckboxChange,
      handlePreferCheckboxChange,
      handleInputChange,
      handleSaveButton,
    },
  };
};

export default useEditNurseTab;
