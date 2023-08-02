/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getShift, updateShift } from '@libs/api/shift';
import { useAccount } from 'store';
import { getWard } from '@libs/api/ward';
import { updateNurseCarry } from '@libs/api/nurse';
import { match } from 'ts-pattern';
import { event, sendEvent } from 'analytics';
import { produce } from 'immer';
import { shallow } from 'zustand/shallow';
import useEditShiftStore from './store';
import {
  checkShift,
  keydownEventMapper,
  moveFocusByKeydown,
  updateCheckFaultOption,
} from './handlers';

const useEditShift = () => {
  const [
    year,
    month,
    focus,
    focusedDayInfo,
    foldedLevels,
    editHistory,
    faults,
    checkFaultOptions,
    setState,
  ] = useEditShiftStore(
    (state) => [
      state.year,
      state.month,
      state.focus,
      state.focusedDayInfo,
      state.foldedLevels,
      state.editHistory,
      state.faults,
      state.checkFaultOptions,
      state.setState,
    ],
    shallow
  );
  const { account } = useAccount();

  const queryClient = useQueryClient();

  const wardQueryKey = ['ward', account.wardId];
  const shiftQueryKey = ['shift', account.wardId, year, month];
  const { data: ward } = useQuery(wardQueryKey, () => getWard(account.wardId));
  const { data: shift, status: shiftStatus } = useQuery(
    shiftQueryKey,
    () => getShift(account.wardId, year, month),
    {
      onSuccess: (data) =>
        setState(
          'foldedLevels',
          data.levelNurses.map(() => false)
        ),
    }
  );
  const { mutate: mutateShift, status: changeStatus } = useMutation(
    ({ shift, focus, shiftTypeId }: { shift: Shift; focus: Focus; shiftTypeId: number | null }) =>
      updateShift(year, month, shift.days[focus.day].day, focus.nurse.nurseId, shiftTypeId),
    {
      onMutate: async ({ focus, shiftTypeId }) => {
        await queryClient.cancelQueries(['shift']);
        const {
          nurse: { nurseId, name },
          day,
        } = focus;
        const oldShift = queryClient.getQueryData<Shift>(shiftQueryKey);

        if (!oldShift) return;
        const oldShiftTypeIndex = oldShift.levelNurses
          .flatMap((x) => x)
          .find((x) => x.nurse.nurseId === nurseId)!.shiftTypeIndexList[day].shift;

        const edit = {
          year,
          month,
          focus,
          prevShiftType: oldShiftTypeIndex !== null ? oldShift.shiftTypes[oldShiftTypeIndex] : null,
          nextShiftType: oldShift.shiftTypes.find((x) => x.shiftTypeId === shiftTypeId) || null,
          dateString: new Date().toLocaleString(),
        };
        setState('editHistory', [...editHistory, edit]);

        const newShiftTypeIndex = shiftTypeId
          ? oldShift.shiftTypes.findIndex((x) => x.shiftTypeId === shiftTypeId)
          : null;

        queryClient.setQueryData<Shift>(
          shiftQueryKey,
          produce(oldShift, (draft) => {
            draft.levelNurses
              .flatMap((x) => x)
              .find((x) => x.nurse.nurseId === nurseId)!.shiftTypeIndexList[day].shift =
              newShiftTypeIndex;
          })
        );

        sendEvent(
          event.changeShift,
          `${name} / ${day + 1}일 | ` +
            match(edit)
              .with({ prevShiftType: null }, () => `추가 → ${edit.nextShiftType?.shortName}`)
              .with({ nextShiftType: null }, () => `${edit.prevShiftType?.shortName} → 삭제`)
              .otherwise(
                () => `${edit.prevShiftType?.shortName} → ${edit.nextShiftType?.shortName}`
              )
        );

        return { oldShift, edit };
      },
      onError: (_, __, context) => {
        if (context === undefined || context.oldShift === undefined || context.edit === undefined)
          return;
        queryClient.setQueryData(shiftQueryKey, context.oldShift);
        setState(
          'editHistory',
          editHistory.filter((x) => x !== context.edit)
        );
      },
    }
  );
  const { mutate: mutateCarry } = useMutation(
    ({ nurseId, value }: { nurseId: number; value: number }) =>
      updateNurseCarry(year, month, nurseId, value),
    {
      onMutate: async ({ nurseId, value }) => {
        await queryClient.cancelQueries(['shift']);
        const oldShift = queryClient.getQueryData<Shift>(shiftQueryKey);

        if (!oldShift) return;

        queryClient.setQueryData<Shift>(
          shiftQueryKey,
          produce(oldShift, (draft) => {
            const nurse = draft.levelNurses
              .flatMap((rows) => rows)
              .find((row) => row.nurse.nurseId === nurseId);
            if (nurse) nurse.carried = value;
          })
        );

        return { oldShift };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: shiftQueryKey });
      },
      onError: (_, __, context) => {
        if (context === undefined || context.oldShift === undefined) return;
        queryClient.setQueryData(shiftQueryKey, context.oldShift);
      },
    }
  );

  const changeMonth = useCallback(
    (type: 'prev' | 'next') => {
      if (type === 'prev') {
        // if (month === 1) {
        //   setMonth(12);
        //   setYear(year - 1);
        // } else {
        //   setMonth(month - 1);
        // }
        if (month === 7) return;
        else setState('month', month - 1);
      } else if (type === 'next') {
        // if (month === 12) {
        //   setMonth(1);
        //   setYear(year + 1);
        // } else {
        //   setMonth(month + 1);
        // }
        if (month === 8) return;
        else setState('month', month + 1);
      }
    },
    [month, year]
  );

  const changeFocusedShift = useCallback(
    (shiftTypeId: number | null) => {
      if (
        !focus ||
        !shift ||
        shift.levelNurses.flatMap((x) => x).find((x) => x.nurse.nurseId === focus.nurse.nurseId)!
          .shiftTypeIndexList[focus.day].shift ===
          shift.shiftTypes.findIndex((x) => x.shiftTypeId === shiftTypeId)
      )
        return;
      mutateShift({ shift, focus, shiftTypeId });
    },
    [focus, shift]
  );

  const foldLevel = useCallback(
    (level: Nurse['level']) => {
      if (!shift || !foldedLevels) return;
      setState(
        'foldedLevels',
        foldedLevels.map((x, index) => (index === level ? !x : x))
      );
    },
    [shift, foldedLevels]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!focus || !shift) return;
      moveFocusByKeydown(e, shift, focus, (focus: Focus | null) => setState('focus', focus));
      keydownEventMapper(
        e,
        ...shift.shiftTypes.map((shiftType) => ({
          keys: [shiftType.shortName],
          callback: () => changeFocusedShift(shiftType.shiftTypeId),
        })),
        { keys: ['Backspace'], callback: () => changeFocusedShift(null) }
      );
    },
    [shift, focus]
  );

  useEffect(() => {
    if (ward) setState('checkFaultOptions', updateCheckFaultOption(ward));
  }, [ward]);

  useEffect(() => {
    if (shift && checkFaultOptions) setState('faults', checkShift(shift, checkFaultOptions));
  }, [shift, checkFaultOptions]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focus, shift, handleKeyDown]);

  return {
    state: {
      month,
      shift,
      focus,
      faults,
      histories: editHistory.filter((x) => x.month === month && x.year === year),
      focusedDayInfo,
      foldedLevels,
      changeStatus,
      shiftStatus,
    },
    actions: {
      foldLevel,
      changeMonth,
      changeFocus: (focus: Focus | null) => setState('focus', focus),
      updateCarry: (nurseId: number, value: number) => mutateCarry({ nurseId, value }),
    },
  };
};

export default useEditShift;
