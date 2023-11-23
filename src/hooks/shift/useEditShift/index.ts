/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WardShiftsDTO, getShift, updateShift, updateShifts, postShift } from '@libs/api/shift';
import { getWardConstraint, updateWardConstraint } from '@libs/api/ward';
import { updateNurseCarry } from '@libs/api/nurse';
import { match } from 'ts-pattern';
import { events, sendEvent } from 'analytics';
import { produce } from 'immer';
import { shallow } from 'zustand/shallow';
import useEditShiftStore from './store';
import {
  checkShift,
  findNurse,
  keydownEventMapper,
  moveFocus,
  updateCheckFaultOption,
} from './handlers';
import { getShiftTeams } from '@libs/api/shiftTeam';
import useAuth from '@hooks/auth/useAuth';
import useLoading from '@hooks/ui/useLoading';
import toast from 'react-hot-toast';

const useEditShift = (activeEffect = false) => {
  const [
    year,
    month,
    currentShiftTeamId,
    oldCurrentShiftTeamId,
    focus,
    focusedDayInfo,
    foldedLevels,
    editHistory,
    faults,
    checkFaultOptions,
    wardShiftTypeMap,
    readonly,
    showLayer,
    setState,
  ] = useEditShiftStore(
    (state) => [
      state.year,
      state.month,
      state.currentShiftTeamId,
      state.oldCurrentShiftTeamId,
      state.focus,
      state.focusedDayInfo,
      state.foldedLevels,
      state.editHistory,
      state.faults,
      state.checkFaultOptions,
      state.wardShiftTypeMap,
      state.readonly,
      state.showLayer,
      state.setState,
    ],
    shallow
  );
  const {
    state: { wardId },
  } = useAuth();
  const { setLoading } = useLoading();

  const queryClient = useQueryClient();

  const shiftQueryKey = ['shift', wardId, year, month, currentShiftTeamId];
  const shiftTeamQueryKey = ['shiftTeams', wardId];
  const wardConstraintQueryKey = ['wardConstraint', currentShiftTeamId, wardId];

  const { data: shiftTeams } = useQuery(shiftTeamQueryKey, () => getShiftTeams(wardId!), {
    enabled: wardId != null,
    onSuccess: (data) => {
      if (currentShiftTeamId) {
        data.every((x) => x.shiftTeamId !== currentShiftTeamId) &&
          setState('currentShiftTeamId', data[0].shiftTeamId);
      } else setState('currentShiftTeamId', data[0].shiftTeamId);
    },
  });

  const { data: wardConstraint } = useQuery(
    wardConstraintQueryKey,
    () => getWardConstraint(wardId!, currentShiftTeamId!),
    {
      enabled: wardId !== null && currentShiftTeamId !== null,
    }
  );
  const { mutate: updateWardConstraintMutate } = useMutation(
    ({
      wardId,
      shiftTeamId,
      constraint,
    }: {
      wardId: number;
      shiftTeamId: number;
      constraint: WardConstraint;
    }) => updateWardConstraint(wardId, shiftTeamId, constraint),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(wardConstraintQueryKey);
      },
    }
  );

  const { data: shift, status: shiftStatus } = useQuery(
    shiftQueryKey,
    () => getShift(wardId!, currentShiftTeamId!, year, month),
    {
      enabled: wardId !== null && currentShiftTeamId !== null,
      onSuccess: (data) => {
        if (data === null) return;

        if (
          !foldedLevels ||
          !oldCurrentShiftTeamId ||
          (oldCurrentShiftTeamId && oldCurrentShiftTeamId !== currentShiftTeamId)
        ) {
          setState(
            'foldedLevels',
            data.divisionShiftNurses.map(() => false)
          );
          setState('oldCurrentShiftTeamId', currentShiftTeamId);
        }
      },
    }
  );
  const { mutate: mutateShift, status: changeStatus } = useMutation(
    ({
      wardId,
      focus,
      shiftTypeId,
    }: {
      wardId: number;
      focus: Focus;
      shiftTypeId: number | null;
    }) => updateShift(wardId, year, month, focus.day + 1, focus.shiftNurseId, shiftTypeId),
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
            const histories = draft.get(year + ',' + month + ',' + currentShiftTeamId);
            if (histories) {
              histories.history = histories.history.slice(0, histories.current + 1);
              histories.history.push(edit);
              histories.current = histories.history.length - 1;
            } else {
              draft.set(year + ',' + month + ',' + currentShiftTeamId, {
                current: 0,
                history: [edit],
              });
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
          events.makePage.changeShift,
          `${focus.shiftNurseName} / ${day + 1}일 | ` +
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

  const { mutate: mutateShiftsAndHistory } = useMutation(
    ({
      wardId,
      wardShiftsDTO,
    }: {
      wardId: number;
      wardShiftsDTO: WardShiftsDTO;
      lastFocus: Focus;
      diff: number;
    }) => updateShifts(wardId, wardShiftsDTO),
    {
      onMutate: async ({ wardShiftsDTO, lastFocus, diff }) => {
        await queryClient.cancelQueries(['shift']);
        const oldShift = queryClient.getQueryData<Shift>(shiftQueryKey);
        const oldEditHistory = editHistory;
        const oldFocus = focus;

        if (!oldShift) return;

        queryClient.setQueryData<Shift>(
          shiftQueryKey,
          produce(oldShift, (draft) => {
            wardShiftsDTO.forEach((wardShift) => {
              draft.divisionShiftNurses
                .flatMap((x) => x)
                .find((x) => x.shiftNurse.shiftNurseId === wardShift.shiftNurseId)!.wardShiftList[
                parseInt(wardShift.date.split('-')[2]) - 1
              ] = wardShift.wardShiftTypeId;
            });
          })
        );

        setState('focus', lastFocus);

        setState(
          'editHistory',
          produce(editHistory, (draft) => {
            draft.get(year + ',' + month + ',' + currentShiftTeamId)!.current += diff;
          })
        );

        return { oldShift, oldEditHistory, oldFocus };
      },
      onError: (_, __, context) => {
        if (context === undefined || context.oldShift === undefined) return;
        queryClient.setQueryData(shiftQueryKey, context.oldShift);
        setState('editHistory', context.oldEditHistory);
        setState('focus', context.oldFocus);
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

  const { mutate: postShiftMutate, isLoading: postShiftLoading } = useMutation(
    ({
      wardId,
      shiftTeamId,
      year,
      month,
    }: {
      wardId: number;
      shiftTeamId: number;
      year: number;
      month: number;
    }) => postShift(wardId, shiftTeamId, year, month)
  );

  const changeMonth = useCallback(
    (type: 'prev' | 'next') => {
      if (type === 'prev') {
        if (new Date(year, month, 1) <= new Date() && !readonly) {
          alert('두달 전 근무는 수정하실 수 없습니다');
          setState('readonly', true);
        }
        if (month === 1) {
          setState('month', 12);
          setState('year', year - 1);
        } else {
          setState('month', month - 1);
        }
      } else if (type === 'next') {
        if (new Date(year, month - 1, 1) > new Date()) {
          alert('두달 뒤 근무는 만드실 수 없습니다.');
          return;
        }
        if (month === 12) {
          setState('month', 1);
          setState('year', year + 1);
        } else {
          setState('month', month + 1);
        }
      }
    },
    [month, year, readonly]
  );

  const changeFocusedShift = useCallback(
    (shiftTypeId: number | null) => {
      if (!wardId || !focus || !shift) return;
      if (
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

      mutateShift({ wardId, focus, shiftTypeId });
    },
    [focus, shift]
  );

  const foldLevel = (level: number) => {
    if (!shift || !foldedLevels) return;
    setState(
      'foldedLevels',
      foldedLevels.map((x, index) => (index === level ? !x : x))
    );
  };

  const moveHistory = (diff: number) => {
    if (diff === 0 || !wardId) return;
    if (!editHistory.get(year + ',' + month + ',' + currentShiftTeamId)) return;
    const { current, history } = editHistory.get(year + ',' + month + ',' + currentShiftTeamId)!;
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
          edit.focus.shiftNurseId + ',' + (edit.focus.day + 1),
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
          edit.focus.shiftNurseId + ',' + (edit.focus.day + 1),
          edit.nextShiftType === null ? null : edit.nextShiftType.wardShiftTypeId
        );
        lastFocus = edit.focus;
        tempDiff++;
      }
    }

    const wardShiftsDTO: WardShiftsDTO = Array.from(changesMap.keys()).map((key) => ({
      shiftNurseId: parseInt(key.split(',')[0]),
      date: `${year}-${month.toString().padStart(2, '0')}-${key.split(',')[1].padStart(2, '0')}`,
      wardShiftTypeId: changesMap.get(key) as number | null,
    }));
    mutateShiftsAndHistory({ wardId, wardShiftsDTO, lastFocus, diff });
  };

  const pasteShift = async () => {
    if (!wardId || !shift || !focus || !wardShiftTypeMap) return;
    setLoading(true);
    try {
      const shiftNameTable = (await navigator.clipboard.readText())
        .replace(/\r/g, '')
        .split('\n')
        .map((x) => x.split('\t'));
      const updateShiftPromises: Promise<void>[] = [];
      const flatNurses = shift.divisionShiftNurses.flatMap((x) => x);
      const startNurseIndex = flatNurses.findIndex(
        (x) => x.shiftNurse.shiftNurseId === focus.shiftNurseId
      );
      for (let i = 0; i < shiftNameTable.length; i++) {
        const wardShiftsDTO = [];
        for (let j = 0; j < shiftNameTable[i].length; j++) {
          const row = flatNurses[startNurseIndex + i];
          const wardShiftType = shift.wardShiftTypes.find((x) => {
            return x.shortName === shiftNameTable[i][j];
          });
          if (!wardShiftType || !row || focus.day + j + 1 > shift.days.length) continue;

          wardShiftsDTO.push({
            shiftNurseId: row.shiftNurse.shiftNurseId,
            date: `${year}-${month.toString().padStart(2, '0')}-${(focus.day + j + 1)
              .toString()
              .padStart(2, '0')}`,
            wardShiftTypeId: wardShiftType.wardShiftTypeId,
          });
        }
        updateShiftPromises.push(updateShifts(wardId, wardShiftsDTO));
      }
      await Promise.all(updateShiftPromises);
      await queryClient.invalidateQueries(shiftQueryKey);
    } catch (e) {
      console.error(e);
      toast.error('붙여넣기에 실패했습니다..');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // if (
      //   ['Ctrl', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) != -1
      // ) {
      //   e.preventDefault(); // Key 입력으로 화면이 이동하는 것을 막습니다.
      // }
      const ctrlKey = e.ctrlKey || e.metaKey;

      if (ctrlKey && e.key === 'z') {
        if (e.shiftKey) {
          moveHistory(1);
          sendEvent(events.makePage.redoBykey);
        } else {
          moveHistory(-1);
          sendEvent(events.makePage.undoBykey);
        }
      }

      if (ctrlKey && e.key === 'v') {
        pasteShift();
      }

      if (!focus || !shift) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        moveFocus(
          e.key.replace('Arrow', '').toLowerCase() as 'left' | 'right' | 'up' | 'down',
          ctrlKey,
          shift,
          focus,
          (focus: Focus | null) => {
            setState('focus', focus);
            sendEvent(
              ctrlKey ? events.makePage.moveCellFocus : events.makePage.moveCellFocus,
              e.key
            );
          }
        );
      }
      keydownEventMapper(
        e,
        ...shift.wardShiftTypes.map((shiftType) => ({
          keys: [shiftType.shortName],
          callback: () => {
            changeFocusedShift(shiftType.wardShiftTypeId);
            moveFocus('right', ctrlKey, shift, focus, (focus: Focus | null) => {
              setState('focus', focus);
              sendEvent(
                ctrlKey ? events.makePage.moveCellFocus : events.makePage.moveCellFocus,
                e.key
              );
            });
          },
        })),
        {
          keys: ['Backspace'],
          callback: () => {
            changeFocusedShift(null);
            moveFocus('left', ctrlKey, shift, focus, (focus: Focus | null) => {
              setState('focus', focus);
              sendEvent(
                ctrlKey ? events.makePage.moveCellFocus : events.makePage.moveCellFocus,
                e.key
              );
            });
          },
        },
        { keys: ['Delete'], callback: () => changeFocusedShift(null) }
      );
    },
    [shift, focus, editHistory]
  );

  const handleToggleEditMode = useCallback(() => {
    if (readonly) {
      setState('readonly', false);
    } else {
      setState('readonly', true);
      setState('focus', null);
      shift &&
        setState(
          'foldedLevels',
          shift.divisionShiftNurses.map(() => false)
        );
    }
  }, [readonly, shift]);

  const handleCreateNextMonthShift = useCallback(() => {
    setState('month', new Date().getMonth() + 2);
    handleToggleEditMode();
  }, []);

  useEffect(() => {
    if (activeEffect && shift) {
      window.dispatchEvent(new Event('resize'));
      const wardShiftTypeMap = new Map<number, WardShiftType>();
      shift.wardShiftTypes.forEach((wardShiftType) => {
        wardShiftTypeMap.set(wardShiftType.wardShiftTypeId, wardShiftType);
      });
      setState(
        'foldedLevels',
        shift.divisionShiftNurses.map(() => false)
      );
      setState('wardShiftTypeMap', wardShiftTypeMap);
    }
  }, [activeEffect, shift]);

  useEffect(() => {
    if (activeEffect && wardConstraint)
      setState('checkFaultOptions', updateCheckFaultOption(wardConstraint));
  }, [activeEffect, wardConstraint]);

  useEffect(() => {
    if (activeEffect && shift && checkFaultOptions && wardShiftTypeMap)
      setState('faults', checkShift(shift, checkFaultOptions, wardShiftTypeMap));
  }, [activeEffect, shift, checkFaultOptions, wardShiftTypeMap, readonly]);

  useEffect(() => {
    if (activeEffect) document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeEffect, focus, shift, editHistory, handleKeyDown]);

  useEffect(() => {
    if (activeEffect) {
      if (shiftStatus === 'loading') {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }
    return () => {
      setLoading(false);
    };
  }, [shiftStatus]);

  return {
    queryKey: {
      shiftQueryKey,
      shiftTeamQueryKey,
      wardConstraintQueryKey,
    },
    state: {
      year,
      month,
      shift,
      focus,
      faults,
      histories: editHistory.get(year + ',' + month + ',' + currentShiftTeamId),
      focusedDayInfo,
      foldedLevels,
      changeStatus,
      shiftStatus,
      checkFaultOptions,
      wardShiftTypeMap,
      wardConstraint,
      readonly,
      showLayer,
      currentShiftTeam: shiftTeams?.find((x) => x.shiftTeamId === currentShiftTeamId) || null,
      shiftTeams,
      postShiftLoading,
    },
    actions: {
      toggleEditMode: handleToggleEditMode,
      createNextMonthShift: handleCreateNextMonthShift,
      foldLevel,
      changeMonth,
      changeFocus: (focus: Focus | null) => setState('focus', focus),
      updateCarry: (shiftNurseId: number, value: number) => mutateCarry({ shiftNurseId, value }),
      moveHistory,
      updateConstraint: (constraint: WardConstraint) =>
        wardId &&
        currentShiftTeamId &&
        updateWardConstraintMutate({
          wardId,
          shiftTeamId: currentShiftTeamId,
          constraint,
        }),
      toggleLayer: (key: 'fault' | 'check' | 'slash') =>
        setState('showLayer', {
          ...showLayer,
          [key]: !showLayer[key],
        }),
      changeShiftTeam: (shiftTeam: ShiftTeam) => setState('currentShiftTeamId', shiftTeam),
      postShift: () => {
        if (!wardId || !currentShiftTeamId) return;
        postShiftMutate({
          wardId,
          shiftTeamId: currentShiftTeamId,
          year,
          month,
        });
      },
    },
  };
};

export default useEditShift;
