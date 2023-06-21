/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useShiftKind } from 'stores/shiftStore';

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
  const shiftKind = useShiftKind();

  useEffect(() => {
    let tempAvail: CheckState = {};
    shiftKind.forEach((shift) => {
      tempAvail = { ...tempAvail, [shift.id]: false };
    });
    let tempPrefer: CheckState = {};
    shiftKind.forEach((shift) => {
      tempPrefer = { ...tempPrefer, [shift.id]: false };
    });

    if (isEdit) {
      nurse.workAvailable.forEach((shift) => (tempAvail[shift.id] = true));
      nurse.workPrefer.forEach((shift) => (tempPrefer[shift.id] = true));
    }
    if (isAdd) {
      for (const key in tempAvail) tempAvail[key] = true;
    }

    setAvailChecked(tempAvail);
    setPreferChecked(tempPrefer);
  }, [shiftKind]);

  /** 가능 근무, 선호 근무 체크리스트 업데이트 */
  useEffect(() => {
    const updatedWorkAvailable: ShiftKind[] = [];
    const updatedWorkPrefer: ShiftKind[] = [];

    for (const key in availChecked) {
      if (availChecked[key] === true) {
        const item = shiftKind.find((item) => item.id === +key);
        if (item) updatedWorkAvailable.push(item);
      }
      if (preferChecked[key] === true) {
        const item = shiftKind.find((item) => item.id === +key);
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
    shiftKind,
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
