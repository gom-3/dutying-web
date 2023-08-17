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
    histories,
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
      state.histories,
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
    () => getShift(account.wardId, 3, year, month),
    {
      onSuccess: (data) =>
        setState(
          'foldedLevels',
          data.divisionNumNurses.map(() => false)
        ),
    }
  );
  const { mutate: mutateShift, status: changeStatus } = useMutation(
    ({
      wardId,
      shift,
      focus,
      shiftTypeId,
    }: {
      wardId: number;
      shift: Shift;
      focus: Focus;
      shiftTypeId: number | null;
    }) =>
      updateShift(
        wardId,
        year,
        month,
        shift.days[focus.day].day,
        shift.divisionNumNurses[focus.level][focus.row].nurse.nurseId,
        shiftTypeId
      ),
    {
      onMutate: async ({ focus, shiftTypeId }) => {
        await queryClient.cancelQueries(['shift']);
        const oldShift = queryClient.getQueryData<Shift>(shiftQueryKey);

        if (!oldShift) return;
        const oldShiftTypeIndex =
          oldShift.divisionNumNurses[focus.level][focus.row].wardShiftList[focus.day];

        const history: EditHistory = {
          nurse: oldShift.divisionNumNurses[focus.level][focus.row].nurse,
          focus,
          prevShiftType:
            oldShiftTypeIndex !== null ? oldShift.wardShiftTypes[oldShiftTypeIndex] : null,
          nextShiftType:
            oldShift.wardShiftTypes.find((x) => x.wardShiftTypeId === shiftTypeId) || null,
          dateString: new Date().toLocaleString(),
        };
        setState('histories', [...histories, history]);

        const newShiftTypeIndex = shiftTypeId
          ? oldShift.wardShiftTypes.findIndex((x) => x.wardShiftTypeId === shiftTypeId)
          : null;

        queryClient.setQueryData<Shift>(
          shiftQueryKey,
          produce(oldShift, (draft) => {
            draft.divisionNumNurses[focus.level][focus.row].wardShiftList[focus.day] =
              newShiftTypeIndex;
          })
        );

        sendEvent(
          event.changeShift,
          `${history.nurse.name} / ${history.focus.day + 1}일 | ` +
            match(history)
              .with({ prevShiftType: null }, () => `추가 → ${history.nextShiftType?.shortName}`)
              .with({ nextShiftType: null }, () => `${history.prevShiftType?.shortName} → 삭제`)
              .otherwise(
                () => `${history.prevShiftType?.shortName} → ${history.nextShiftType?.shortName}`
              )
        );

        return { oldShift, history };
      },
      onError: (_, __, context) => {
        if (
          context === undefined ||
          context.oldShift === undefined ||
          context.history === undefined
        )
          return;
        queryClient.setQueryData(shiftQueryKey, context.oldShift);
        setState(
          'histories',
          histories.filter((history) => history !== context.history)
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
            const nurse = draft.divisionNumNurses
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
        !ward ||
        !focus ||
        !shift ||
        shift.divisionNumNurses[focus.level][focus.row].wardShiftList[focus.day] ===
          shift.wardShiftTypes.findIndex((x) => x.wardShiftTypeId === shiftTypeId)
      )
        return;

      const current = shift.divisionNumNurses[focus.level][focus.row].wardShiftList[focus.day];
      const request = shift.divisionNumNurses[focus.level][focus.row].wardReqShiftList[focus.day];
      if (
        request != null &&
        request === current &&
        !confirm('신청 근무입니다 정말 바꾸시겠습니까?')
      )
        return;

      mutateShift({ wardId: ward.wardId, shift, focus, shiftTypeId });
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
        ...shift.wardShiftTypes.map((shiftType) => ({
          keys: [shiftType.shortName],
          callback: () => changeFocusedShift(shiftType.wardShiftTypeId),
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
      histories,
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
