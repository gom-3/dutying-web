import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useCallback, useEffect } from 'react';
import { match } from 'ts-pattern';
import useAuth from '@/hooks/auth/useAuth';
import { acceptRequestShift, getReqShift, getRequestList, updateReqShift } from '@/libs/api/shift';
import { getShiftTeams } from '@/libs/api/shiftTeam';
import { type RequestShift } from '@/types/shift';
import { type ShiftTeam, type WardShiftType } from '@/types/ward';
import { events, sendEvent } from 'analytics';
import { useRequestShiftStore } from './store';
import { findNurse, keydownEventMapper, moveFocus } from '../useEditShift/handlers';
import { type Focus } from '../useEditShift/types';

const useRequestShift = (activeEffect = false) => {
  const {
    year,
    month,
    focus,
    foldedLevels,
    currentShiftTeamId,
    oldCurrentShiftTeamId,
    wardShiftTypeMap,
    readonly,
    setState,
  } = useRequestShiftStore();
  const {
    state: { wardId },
  } = useAuth();
  const queryClient = useQueryClient();
  const requestShiftQueryKey = ['requestShift', wardId, year, month, currentShiftTeamId];
  const shiftTeamQueryKey = ['shiftTeams', wardId];
  const wardConstraintQueryKey = ['wardConstraint', currentShiftTeamId, wardId];
  const dutyRequestQueryKey = ['dutyRequest', wardId, year, month, currentShiftTeamId];
  const { data: shiftTeams } = useQuery({
    queryKey: shiftTeamQueryKey,
    queryFn: async () => {
      const res = await getShiftTeams(wardId!);

      if (currentShiftTeamId) {
        if (res.every((x) => x.shiftTeamId !== currentShiftTeamId)) {
          setState('currentShiftTeamId', res[0].shiftTeamId);
        }
      } else {
        setState('currentShiftTeamId', res[0].shiftTeamId);
      }

      return res;
    },
    enabled: !!wardId,
  });
  const { data: dutyRequestList } = useQuery({
    queryKey: dutyRequestQueryKey,
    queryFn: () => getRequestList(wardId!, currentShiftTeamId!, year, month),
    enabled: wardId !== null && currentShiftTeamId !== null,
  });
  const { data: requestShift, status: shiftStatus } = useQuery({
    queryKey: requestShiftQueryKey,
    queryFn: async () => {
      const res = await getReqShift(wardId!, currentShiftTeamId!, year, month);

      if (res === null) return;

      if (
        !foldedLevels ||
        !oldCurrentShiftTeamId ||
        (oldCurrentShiftTeamId && oldCurrentShiftTeamId !== currentShiftTeamId)
      ) {
        setState(
          'foldedLevels',
          res.divisionShiftNurses.map(() => false),
        );
        setState('oldCurrentShiftTeamId', currentShiftTeamId);
      }

      return res;
    },
    enabled: wardId !== null && currentShiftTeamId !== null,
  });
  const { mutate: mutateShift, status: changeStatus } = useMutation({
    mutationFn: ({
      wardId,
      focus,
      shiftTypeId,
    }: {
      wardId: number;
      focus: Focus;
      shiftTypeId: number | null;
    }) => updateReqShift(wardId, year, month, focus.day + 1, focus.shiftNurseId, shiftTypeId),
    onMutate: async ({ focus, shiftTypeId }) => {
      await queryClient.cancelQueries({ queryKey: ['requestShift'] });

      const { shiftNurseId, day } = focus;
      const oldShift = queryClient.getQueryData<RequestShift>(requestShiftQueryKey);

      if (!oldShift || !wardShiftTypeMap) return;

      const oldShiftTypeId = oldShift.divisionShiftNurses
        .flatMap((x) => x)
        .find((x) => x.shiftNurse.shiftNurseId === shiftNurseId)!.wardReqShiftList[focus.day];
      const edit = {
        nurseName: findNurse(oldShift, focus.shiftNurseId)!.name,
        focus,
        prevShiftType: oldShiftTypeId ? wardShiftTypeMap.get(oldShiftTypeId) : null,
        nextShiftType: shiftTypeId ? wardShiftTypeMap.get(shiftTypeId) : null,
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
        }),
      );

      sendEvent(
        events.requestPage.changeShift,
        `${focus.shiftNurseName} / ${day + 1}일 | ` +
          match(edit)
            .with({ prevShiftType: null }, () => `추가 → ${edit.nextShiftType?.shortName}`)
            .with({ nextShiftType: null }, () => `${edit.prevShiftType?.shortName} → 삭제`)
            .otherwise(() => `${edit.prevShiftType?.shortName} → ${edit.nextShiftType?.shortName}`),
      );

      return { oldShift };
    },
    onError: (_, __, context) => {
      if (context?.oldShift === undefined) return;

      queryClient.setQueryData(requestShiftQueryKey, context.oldShift);
    },
  });
  const { mutate: acceptRequestMutate } = useMutation({
    mutationFn: ({
      wardId,
      reqShiftId,
      isAccepted,
    }: {
      wardId: number;
      reqShiftId: number;
      isAccepted: boolean | null;
    }) => acceptRequestShift(wardId, reqShiftId, isAccepted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestShiftQueryKey });
      queryClient.invalidateQueries({ queryKey: dutyRequestQueryKey });
    },
  });
  const changeMonth = (type: 'prev' | 'next') => {
    if (type === 'prev') {
      if (new Date(year, month, 1) <= new Date() && !readonly) {
        alert('두달 전 신청 근무는 수정하실 수 없습니다');
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
        alert('두달 뒤 신청 근무는 아직 수정하실  수 없습니다.');

        return;
      }

      if (month === 12) {
        setState('month', 1);
        setState('year', year + 1);
      } else {
        setState('month', month + 1);
      }
    }
  };
  const changeFocusedShift = (shiftTypeId: number | null) => {
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
        x.date === focus.day,
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
  };
  const foldLevel = (level: number) => {
    if (!requestShift || !foldedLevels) return;

    setState(
      'foldedLevels',
      foldedLevels.map((x, index) => (index === level ? !x : x)),
    );
  };
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
          (focus: Focus | null) => setState('focus', focus),
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
              sendEvent(
                ctrlKey ? events.requestPage.moveCellFocus : events.requestPage.moveCellFocus,
                e.key,
              );
            });
          },
        })),
        {
          keys: ['Backspace'],
          callback: () => {
            changeFocusedShift(null);
            moveFocus('left', ctrlKey, requestShift, focus, (focus: Focus | null) => {
              setState('focus', focus);
              sendEvent(
                ctrlKey ? events.requestPage.moveCellFocus : events.requestPage.moveCellFocus,
                e.key,
              );
            });
          },
        },
        { keys: ['Delete'], callback: () => changeFocusedShift(null) },
      );
    },
    [requestShift, focus],
  );
  const handleToggleEditMode = useCallback(() => {
    if (readonly) {
      setState('readonly', false);
    } else {
      setState('readonly', true);
      setState('focus', null);

      if (requestShift) {
        setState(
          'foldedLevels',
          requestShift.divisionShiftNurses.map(() => false),
        );
      }
    }
  }, [readonly, requestShift]);
  const handleCreateNextMonthShift = useCallback(() => {
    const nextMonth = new Date().getMonth() + 2;

    if (nextMonth > 12) {
      setState('year', year + 1);
      setState('month', 1);
    } else {
      setState('month', nextMonth);
    }

    handleToggleEditMode();
  }, []);

  useEffect(() => {
    if (activeEffect && requestShift) {
      window.dispatchEvent(new Event('resize'));

      const wardShiftTypeMap = new Map<number, WardShiftType>();

      requestShift.wardShiftTypes.forEach((wardShiftType) => {
        wardShiftTypeMap.set(wardShiftType.wardShiftTypeId, wardShiftType);
      });

      if (foldedLevels && foldedLevels?.length !== requestShift.divisionShiftNurses.length) {
        setState(
          'foldedLevels',
          requestShift.divisionShiftNurses.map(() => false),
        );
      }

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
      currentShiftTeam: shiftTeams?.find(
        (x) => x.shiftTeamId === currentShiftTeamId,
      ) as ShiftTeam | null,
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
      changeShiftTeam: (shiftTeam: ShiftTeam) =>
        setState('currentShiftTeamId', shiftTeam.shiftTeamId),
    },
  };
};

export default useRequestShift;
