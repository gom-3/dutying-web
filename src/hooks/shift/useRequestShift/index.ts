/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { acceptRequestShift, getReqShift, getRequestList, updateReqShift } from '@libs/api/shift';
import { match } from 'ts-pattern';
import { event, sendEvent } from 'analytics';
import { produce } from 'immer';
import { shallow } from 'zustand/shallow';
import { getShiftTeams } from '@libs/api/shiftTeam';
import useAuth from '@hooks/auth/useAuth';
import { useRequestShiftStore } from './store';
import { findNurse, keydownEventMapper, moveFocus } from '../useEditShift/handlers';

const useRequestShift = (activeEffect = false) => {
  const [
    year,
    month,
    focus,
    foldedLevels,
    currentShiftTeam,
    oldCurrentShiftTeamId,
    wardShiftTypeMap,
    readonly,
    setState,
  ] = useRequestShiftStore(
    (state) => [
      state.year,
      state.month,
      state.focus,
      state.foldedLevels,
      state.currentShiftTeam,
      state.oldCurrentShiftTeamId,
      state.wardShiftTypeMap,
      state.readonly,
      state.setState,
    ],
    shallow
  );
  const {
    state: { wardId },
  } = useAuth();

  const queryClient = useQueryClient();

  const requestShiftQueryKey = ['requestShift', wardId, year, month, currentShiftTeam];
  const shiftTeamQueryKey = ['shiftTeams', wardId];
  const wardConstraintQueryKey = ['wardConstraint', currentShiftTeam, wardId];
  const dutyRequestQueryKey = ['dutyRequest', wardId, year, month, currentShiftTeam];

  const { data: shiftTeams } = useQuery(shiftTeamQueryKey, () => getShiftTeams(wardId!), {
    enabled: wardId != null,
    onSuccess: (data) => {
      if (currentShiftTeam) {
        data.every((x) => x.shiftTeamId !== currentShiftTeam.shiftTeamId) &&
          setState('currentShiftTeam', data[0]);
      } else setState('currentShiftTeam', data[0]);
    },
  });

  const { data: dutyRequestList } = useQuery(
    dutyRequestQueryKey,
    () => getRequestList(wardId!, currentShiftTeam!.shiftTeamId, year, month),
    // () => getRequestList(wardId!, currentShiftTeam!.shiftTeamId, year, month),
    {
      enabled: wardId !== null,
    }
  );

  const { data: requestShift, status: shiftStatus } = useQuery(
    requestShiftQueryKey,
    () => getReqShift(wardId!, currentShiftTeam!.shiftTeamId, year, month),
    {
      enabled: wardId !== null && currentShiftTeam !== null,
      onSuccess: (data) => {
        if (data === null) return;

        if (
          !foldedLevels ||
          !oldCurrentShiftTeamId ||
          (oldCurrentShiftTeamId && oldCurrentShiftTeamId !== currentShiftTeam?.shiftTeamId)
        ) {
          setState(
            'foldedLevels',
            data.divisionShiftNurses.map(() => false)
          );
          setState('oldCurrentShiftTeamId', currentShiftTeam?.shiftTeamId);
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
    }) => updateReqShift(wardId, year, month, focus.day + 1, focus.shiftNurseId, shiftTypeId),
    {
      onMutate: async ({ focus, shiftTypeId }) => {
        await queryClient.cancelQueries(['requestShift']);
        const { shiftNurseId, day } = focus;
        const oldShift = queryClient.getQueryData<RequestShift>(requestShiftQueryKey);

        if (!oldShift || !wardShiftTypeMap) return;
        const oldShiftTypeId = oldShift.divisionShiftNurses
          .flatMap((x) => x)
          .find((x) => x.shiftNurse.shiftNurseId === shiftNurseId)!.wardReqShiftList[focus.day];

        const edit = {
          nurseName: findNurse(oldShift, focus.shiftNurseId)!.name,
          focus,
          prevShiftType:
            oldShiftTypeId !== null ? wardShiftTypeMap.get(oldShiftTypeId) || null : null,
          nextShiftType: shiftTypeId !== null ? wardShiftTypeMap.get(shiftTypeId) || null : null,
          dateString: new Date().toLocaleString(),
        };

        queryClient.setQueryData<RequestShift>(
          requestShiftQueryKey,
          produce(oldShift, (draft) => {
            draft.divisionShiftNurses
              .flatMap((x) => x)
              .find((x) => x.shiftNurse.shiftNurseId === focus.shiftNurseId)!.wardReqShiftList[
              focus.day
            ] = shiftTypeId;
          })
        );

        sendEvent(
          event.change_shift_rq,
          `${focus.shiftNurseName} / ${day + 1}일 | ` +
            match(edit)
              .with({ prevShiftType: null }, () => `추가 → ${edit.nextShiftType?.shortName}`)
              .with({ nextShiftType: null }, () => `${edit.prevShiftType?.shortName} → 삭제`)
              .otherwise(
                () => `${edit.prevShiftType?.shortName} → ${edit.nextShiftType?.shortName}`
              )
        );

        return { oldShift };
      },
      onError: (_, __, context) => {
        if (context === undefined || context.oldShift === undefined) return;
        queryClient.setQueryData(requestShiftQueryKey, context.oldShift);
      },
    }
  );

  const { mutate: acceptRequestMutate } = useMutation(
    ({
      wardId,
      reqShiftId,
      isAccepted,
    }: {
      wardId: number;
      reqShiftId: number;
      isAccepted: boolean | null;
    }) => acceptRequestShift(wardId, reqShiftId, isAccepted),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(requestShiftQueryKey);
        queryClient.invalidateQueries(dutyRequestQueryKey);
      },
    }
  );

  const changeMonth = useCallback(
    (type: 'prev' | 'next') => {
      if (type === 'prev') {
        if (month === 1) {
          setState('month', 12);
          setState('year', year - 1);
        } else {
          setState('month', month - 1);
        }
      } else if (type === 'next') {
        if (month === 12) {
          setState('month', 1);
          setState('year', year + 1);
        } else {
          setState('month', month + 1);
        }
      }
      sendEvent(event.change_month);
    },
    [month, year]
  );

  const changeFocusedShift = useCallback(
    (shiftTypeId: number | null) => {
      if (!wardId || !focus || !requestShift) return;
      if (
        requestShift.divisionShiftNurses
          .flatMap((x) => x)
          .find((x) => x.shiftNurse.shiftNurseId === focus.shiftNurseId)!.wardReqShiftList[
          focus.day
        ] === shiftTypeId
      )
        return;

      const requestDutyRequest = dutyRequestList?.find(
        (x) =>
          x.nurseId ===
            requestShift.divisionShiftNurses
              .flatMap((x) => x)
              .find((x) => x.shiftNurse.shiftNurseId === focus.shiftNurseId)?.shiftNurse.nurseId &&
          x.date === focus.day
      );

      if (
        requestDutyRequest &&
        requestDutyRequest.wardShiftTypeId !== shiftTypeId &&
        !confirm('신청을 거절하시겠습니까?')
      )
        return;

      if (requestDutyRequest) {
        acceptRequestMutate({
          wardId,
          reqShiftId: requestDutyRequest.wardReqShiftId,
          isAccepted:
            shiftTypeId === null ? null : requestDutyRequest.wardShiftTypeId === shiftTypeId,
        });
      }

      mutateShift({ wardId, focus, shiftTypeId });
    },
    [focus, requestShift, dutyRequestList]
  );

  const foldLevel = useCallback(
    (level: number) => {
      if (!requestShift || !foldedLevels) return;
      setState(
        'foldedLevels',
        foldedLevels.map((x, index) => (index === level ? !x : x))
      );
    },
    [requestShift, foldedLevels]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        ['Ctrl', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) != -1
      ) {
        e.preventDefault(); // Key 입력으로 화면이 이동하는 것을 막습니다.
      }

      const ctrlKey = e.ctrlKey || e.metaKey;

      if (!focus || !requestShift) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        moveFocus(
          e.key.replace('Arrow', '').toLowerCase() as 'left' | 'right' | 'up' | 'down',
          ctrlKey,
          requestShift,
          focus,
          (focus: Focus | null) => {
            setState('focus', focus);
            sendEvent(ctrlKey ? event.move_cell_focus_end : event.move_cell_focus, e.key);
          }
        );
      }
      keydownEventMapper(
        e,
        ...requestShift.wardShiftTypes.map((shiftType) => ({
          keys: [shiftType.shortName],
          callback: () => {
            changeFocusedShift(shiftType.wardShiftTypeId);
            moveFocus('right', ctrlKey, requestShift, focus, (focus: Focus | null) => {
              setState('focus', focus);
              sendEvent(ctrlKey ? event.move_cell_focus_end : event.move_cell_focus, e.key);
            });
          },
        })),
        {
          keys: ['Backspace'],
          callback: () => {
            changeFocusedShift(null);
            moveFocus('left', ctrlKey, requestShift, focus, (focus: Focus | null) => {
              setState('focus', focus);
              sendEvent(ctrlKey ? event.move_cell_focus_end : event.move_cell_focus, e.key);
            });
          },
        },
        { keys: ['Delete'], callback: () => changeFocusedShift(null) }
      );
    },
    [requestShift, focus]
  );

  const handleToggleEditMode = useCallback(() => {
    if (readonly) {
      setState('readonly', false);
    } else {
      setState('readonly', true);
      setState('focus', null);
      requestShift &&
        setState(
          'foldedLevels',
          requestShift.divisionShiftNurses.map(() => false)
        );
    }
  }, [readonly, requestShift]);

  const handleCreateNextMonthShift = useCallback(() => {
    setState('month', new Date().getMonth() + 2);
    handleToggleEditMode();
  }, []);

  useEffect(() => {
    if (activeEffect && requestShift) {
      const wardShiftTypeMap = new Map<number, WardShiftType>();
      requestShift.wardShiftTypes.forEach((wardShiftType) => {
        wardShiftTypeMap.set(wardShiftType.wardShiftTypeId, wardShiftType);
      });
      setState('wardShiftTypeMap', wardShiftTypeMap);
    }
  }, [activeEffect, requestShift]);

  useEffect(() => {
    if (activeEffect) document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeEffect, focus, requestShift, handleKeyDown]);

  return {
    queryKey: {
      requestShiftQueryKey,
      shiftTeamQueryKey,
      wardConstraintQueryKey,
    },
    state: {
      year,
      month,
      requestShift,
      dutyRequestList,
      focus,
      foldedLevels,
      changeStatus,
      shiftStatus,
      wardShiftTypeMap,
      readonly,
      currentShiftTeam,
      shiftTeams,
    },
    actions: {
      changeRequestShift: (focus: Focus, shiftTypeId: number | null) =>
        wardId && mutateShift({ wardId, focus, shiftTypeId }),
      toggleEditMode: handleToggleEditMode,
      createNextMonthShift: handleCreateNextMonthShift,
      acceptRequest: (reqShiftId: number, isAccepted: boolean | null) =>
        wardId && acceptRequestMutate({ wardId, isAccepted, reqShiftId }),
      foldLevel,
      changeMonth,
      changeFocus: (focus: Focus | null) => setState('focus', focus),
      changeShiftTeam: (shiftTeam: ShiftTeam) => {
        setState('currentShiftTeam', shiftTeam);
        sendEvent(event.change_shift_team);
      },
    },
  };
};

export default useRequestShift;
