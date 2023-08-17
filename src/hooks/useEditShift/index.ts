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

const useEditShift = (activeEffect = false) => {
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
        const oldEditHistory = editHistory;

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

        setState(
          'editHistory',
          produce(oldEditHistory, (draft) => {
            const histories = draft.get(year + '' + month);
            if (histories) {
              histories.history = histories.history.slice(0, histories.current + 1);
              histories.history.push(edit);
              histories.current = histories.history.length - 1;
            } else {
              draft.set(year + '' + month, { current: 0, history: [edit] });
            }
          })
        );

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

        return { oldShift, oldEditHistory };
      },
      onError: (_, __, context) => {
        if (
          context === undefined ||
          context.oldShift === undefined ||
          context.oldEditHistory === undefined
        )
          return;
        queryClient.setQueryData(shiftQueryKey, context.oldShift);
        setState('editHistory', context.oldEditHistory);
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

      const { reqShift: request, shift: current } = shift.levelNurses
        .flatMap((x) => x)
        .find((x) => x.nurse.nurseId === focus.nurse.nurseId)!.shiftTypeIndexList[focus.day];
      if (
        request != null &&
        request === current &&
        !confirm('신청 근무입니다 정말 바꾸시겠습니까?')
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

  const moveHistory = (diff: number) => {
    if (diff === 0) return;
    if (!editHistory.get(year + '' + month)) return;
    const { current, history } = editHistory.get(year + '' + month)!;
    const changesMap = new Map<string, number | null>();

    let lastFocus = focus!;
    if (diff < 0) {
      let tempDiff = 0;
      while (tempDiff !== diff) {
        const edit = history[current + tempDiff];
        if (!edit) {
          diff = tempDiff;
          break;
        }
        changesMap.set(
          edit.focus.nurse.nurseId + '/' + edit.focus.day,
          edit.prevShiftType === null ? null : edit.prevShiftType.shiftTypeId
        );
        lastFocus = edit.focus;
        tempDiff--;
      }
    } else if (diff > 0) {
      let tempDiff = 0;
      while (tempDiff !== diff) {
        const edit = history[current + tempDiff + 1];
        if (!edit) {
          diff = tempDiff;
          break;
        }
        changesMap.set(
          edit.focus.nurse.nurseId + '/' + edit.focus.day,
          edit.nextShiftType === null ? null : edit.nextShiftType.shiftTypeId
        );
        lastFocus = edit.focus;
        tempDiff++;
      }
    }

    const changes = Array.from(changesMap.keys()).map((key) => ({
      nurseId: parseInt(key.split('/')[0]),
      day: parseInt(key.split('/')[1]),
      shiftTypeId: changesMap.get(key) as number | null,
    }));

    setState('focus', lastFocus);

    setState(
      'editHistory',
      produce(editHistory, (draft) => {
        draft.get(year + '' + month)!.current += diff;
      })
    );

    if (shift) {
      queryClient.setQueryData(
        shiftQueryKey,
        produce(shift, (draft) => {
          changes.forEach((change) => {
            draft.levelNurses
              .flatMap((x) => x)
              .find((x) => x.nurse.nurseId === change.nurseId)!.shiftTypeIndexList[
              change.day
            ].shift =
              change.shiftTypeId === null
                ? null
                : shift.shiftTypes.findIndex((x) => x.shiftTypeId === change.shiftTypeId);
          });
        })
      );
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          moveHistory(1);
        } else {
          moveHistory(-1);
        }
      }
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
    [shift, focus, editHistory]
  );

  useEffect(() => {
    if (activeEffect && ward) setState('checkFaultOptions', updateCheckFaultOption(ward));
  }, [activeEffect, ward]);

  useEffect(() => {
    if (activeEffect && shift && checkFaultOptions)
      setState('faults', checkShift(shift, checkFaultOptions));
  }, [activeEffect, shift, checkFaultOptions]);

  useEffect(() => {
    if (activeEffect) document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeEffect, focus, shift, editHistory, handleKeyDown]);

  return {
    state: {
      month,
      shift,
      focus,
      faults,
      histories: editHistory.get(year + '' + month),
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
      moveHistory,
    },
  };
};

export default useEditShift;
