/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getShift, updateShift } from '@libs/api/shift';
import useGlobalStore from 'store';
import { getWard, getWardConstraint } from '@libs/api/ward';
import { updateNurseCarry } from '@libs/api/nurse';
import { match } from 'ts-pattern';
import { event, sendEvent } from 'analytics';
import { produce } from 'immer';
import { shallow } from 'zustand/shallow';
import useEditShiftStore from './store';
import {
  checkShift,
  findNurse,
  keydownEventMapper,
  moveFocusByKeydown,
  updateCheckFaultOption,
} from './handlers';

const useEditShift = (activeEffect = false) => {
  const [
    year,
    month,
    currentShiftTeam,
    focus,
    focusedDayInfo,
    foldedLevels,
    editHistory,
    faults,
    checkFaultOptions,
    wardShiftTypeMap,
    setState,
  ] = useEditShiftStore(
    (state) => [
      state.year,
      state.month,
      state.currentShiftTeam,
      state.focus,
      state.focusedDayInfo,
      state.foldedLevels,
      state.editHistory,
      state.faults,
      state.checkFaultOptions,
      state.wardShiftTypeMap,
      state.setState,
    ],
    shallow
  );
  const { wardId } = useGlobalStore();

  const queryClient = useQueryClient();

  const wardQueryKey = ['ward', wardId];
  const shiftQueryKey = ['shift', wardId, year, month];
  const { data: wardConstraint } = useQuery(
    ['wardConstraint'],
    () => getWardConstraint(wardId!, currentShiftTeam!),
    {
      enabled: wardId !== null && currentShiftTeam !== null,
    }
  );
  const { data: ward } = useQuery(wardQueryKey, () => getWard(wardId!), {
    enabled: wardId !== null,
  });
  const { data: shift, status: shiftStatus } = useQuery(
    shiftQueryKey,
    () => getShift(wardId!, currentShiftTeam!, year, month),
    {
      enabled: wardId !== null && currentShiftTeam !== null,
      onSuccess: (data) => {
        if (data === null) return;
        setState(
          'foldedLevels',
          data.divisionShiftNurses.map(() => false)
        );

        const wardShiftTypeMap = new Map<number, WardShiftType>();
        data.wardShiftTypes.forEach((wardShiftType) => {
          wardShiftTypeMap.set(wardShiftType.wardShiftTypeId, wardShiftType);
        });
        setState('wardShiftTypeMap', wardShiftTypeMap);
      },
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
      updateShift(wardId, year, month, shift.days[focus.day].day, focus.shiftNurseId, shiftTypeId),
    {
      onMutate: async ({ focus, shiftTypeId }) => {
        await queryClient.cancelQueries(['shift']);
        const { shiftNurseId, day } = focus;
        const oldShift = queryClient.getQueryData<Shift>(shiftQueryKey);
        const oldEditHistory = editHistory;

        if (!oldShift || !wardShiftTypeMap) return;
        const oldShiftTypeId = oldShift.divisionShiftNurses
          .flatMap((x) => x)
          .find((x) => x.shiftNurse.shiftNurseId === shiftNurseId)!.wardShiftList[focus.day];

        const edit = {
          nurseName: findNurse(oldShift, focus.shiftNurseId)!.name,
          focus,
          prevShiftType:
            oldShiftTypeId !== null ? wardShiftTypeMap.get(oldShiftTypeId) || null : null,
          nextShiftType: shiftTypeId !== null ? wardShiftTypeMap.get(shiftTypeId) || null : null,
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

        queryClient.setQueryData<Shift>(
          shiftQueryKey,
          produce(oldShift, (draft) => {
            draft.divisionShiftNurses
              .flatMap((x) => x)
              .find((x) => x.shiftNurse.shiftNurseId === focus.shiftNurseId)!.wardShiftList[
              focus.day
            ] = shiftTypeId;
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
    ({ shiftNurseId, value }: { shiftNurseId: number; value: number }) =>
      updateNurseCarry(shiftNurseId, value),
    {
      onMutate: async ({ shiftNurseId, value }) => {
        await queryClient.cancelQueries(['shift']);
        const oldShift = queryClient.getQueryData<Shift>(shiftQueryKey);

        if (!oldShift) return;

        queryClient.setQueryData<Shift>(
          shiftQueryKey,
          produce(oldShift, (draft) => {
            const nurse = draft.divisionShiftNurses
              .flatMap((rows) => rows)
              .find((row) => row.shiftNurse.shiftNurseId === shiftNurseId)?.shiftNurse;
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
        shift.divisionShiftNurses
          .flatMap((x) => x)
          .find((x) => x.shiftNurse.shiftNurseId === focus.shiftNurseId)!.wardShiftList[
          focus.day
        ] === shiftTypeId
      )
        return;

      const current = shift.divisionShiftNurses
        .flatMap((x) => x)
        .find((x) => x.shiftNurse.shiftNurseId === focus.shiftNurseId)!.wardShiftList[focus.day];
      const request = shift.divisionShiftNurses
        .flatMap((x) => x)
        .find((x) => x.shiftNurse.shiftNurseId === focus.shiftNurseId)!.wardReqShiftList[focus.day];
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
    (level: number) => {
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
          edit.focus.shiftNurseId + '/' + edit.focus.day,
          edit.prevShiftType === null ? null : edit.prevShiftType.wardShiftTypeId
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
          edit.focus.shiftNurseId + '/' + edit.focus.day,
          edit.nextShiftType === null ? null : edit.nextShiftType.wardShiftTypeId
        );
        lastFocus = edit.focus;
        tempDiff++;
      }
    }

    const changes = Array.from(changesMap.keys()).map((key) => ({
      shiftNurseId: parseInt(key.split('/')[0]),
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
            draft.divisionShiftNurses
              .flatMap((x) => x)
              .find((x) => x.shiftNurse.shiftNurseId === change.shiftNurseId)!.wardShiftList[
              change.day
            ] = change.shiftTypeId;
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
        ...shift.wardShiftTypes.map((shiftType) => ({
          keys: [shiftType.shortName],
          callback: () => changeFocusedShift(shiftType.wardShiftTypeId),
        })),
        { keys: ['Backspace'], callback: () => changeFocusedShift(null) }
      );
    },
    [shift, focus, editHistory]
  );

  useEffect(() => {
    if (activeEffect && wardConstraint)
      setState('checkFaultOptions', updateCheckFaultOption(wardConstraint));
  }, [activeEffect, wardConstraint]);

  useEffect(() => {
    if (activeEffect && shift && checkFaultOptions && wardShiftTypeMap)
      setState('faults', checkShift(shift, checkFaultOptions, wardShiftTypeMap));
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
      wardShiftTypeMap,
    },
    actions: {
      foldLevel,
      changeMonth,
      changeFocus: (focus: Focus | null) => setState('focus', focus),
      updateCarry: (shiftNurseId: number, value: number) => mutateCarry({ shiftNurseId, value }),
      moveHistory,
    },
  };
};

export default useEditShift;
