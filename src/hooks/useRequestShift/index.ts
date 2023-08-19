/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRequestShiftStore } from './store';
import { shallow } from 'zustand/shallow';
import { findNurse, keydownEventMapper, moveFocusByKeydown } from '@hooks/useEditShift/handlers';
import { produce } from 'immer';
import useGlobalStore from 'store';
import { getReqShift, getShiftTeams, updateReqShift } from '@libs/api/ward';

const useRequestShift = () => {
  const [year, month, focus, currentShiftTeam, foldedLevels, wardShiftTypeMap, setState] =
    useRequestShiftStore(
      (state) => [
        state.year,
        state.month,
        state.focus,
        state.currentShiftTeam,
        state.foldedLevels,
        state.wardShiftTypeMap,
        state.setState,
      ],
      shallow
    );
  const { wardId } = useGlobalStore();

  const queryClient = useQueryClient();
  const requestShiftQueryKey = ['requestShift', wardId, year, month, currentShiftTeam];
  const shiftTeamQueryKey = ['shiftTeams', wardId];

  const { data: shiftTeams } = useQuery(shiftTeamQueryKey, () => getShiftTeams(wardId!), {
    enabled: wardId != null,
    onSuccess: (data) => {
      if (currentShiftTeam === null) setState('currentShiftTeam', data[0]);
    },
  });
  const { data: requestShift, status: shiftStatus } = useQuery(
    requestShiftQueryKey,
    () => getReqShift(wardId!, currentShiftTeam!.shiftTeamId, year, month),
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
  const { mutate: focusedShiftChange, status: changeStatus } = useMutation(
    ({
      wardId,
      requestShift,
      focus,
      shiftTypeId,
    }: {
      wardId: number;
      requestShift: RequestShift;
      focus: Focus;
      shiftTypeId: number | null;
    }) =>
      updateReqShift(
        wardId,
        year,
        month,
        requestShift.days[focus.day].day,
        findNurse(requestShift, focus.shiftNurseId)!.shiftNurseId,
        shiftTypeId
      ),
    {
      onMutate: async ({ focus, shiftTypeId }) => {
        await queryClient.cancelQueries(['requestShift']);
        const oldShift = queryClient.getQueryData<RequestShift>(requestShiftQueryKey);

        if (!oldShift) return;

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

        return { oldShift, history };
      },
      onError: (_, __, context) => {
        if (
          context === undefined ||
          context.oldShift === undefined ||
          context.history === undefined
        )
          return;
        console.log('error');
        queryClient.setQueryData(['shift'], context.oldShift);
      },
    }
  );

  const foldLevel = (level: number) => {
    if (!requestShift || !foldedLevels) return;
    setState(
      'foldedLevels',
      foldedLevels.map((x, index) => (index === level ? !x : x))
    );
  };

  const changeMonth = (type: 'prev' | 'next') => {
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
  };

  const changeFocusedShift = (shiftTypeId: number | null) => {
    if (
      !wardId ||
      !focus ||
      !requestShift ||
      requestShift.divisionShiftNurses
        .flatMap((x) => x)
        .find((x) => x.shiftNurse.shiftNurseId === focus.shiftNurseId)!.wardReqShiftList[
        focus.day
      ] === shiftTypeId
    )
      return;
    focusedShiftChange({ wardId, requestShift, focus, shiftTypeId });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!focus || !requestShift) return;
    moveFocusByKeydown(e, requestShift, focus, (focus: Focus | null) => setState('focus', focus));
    keydownEventMapper(
      e,
      ...requestShift.wardShiftTypes.map((shiftType) => ({
        keys: [shiftType.shortName],
        callback: () => changeFocusedShift(shiftType.wardShiftTypeId),
      })),
      { keys: ['Backspace'], callback: () => changeFocusedShift(null) }
    );
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focus, requestShift]);

  return {
    state: {
      month,
      requestShift,
      focus,
      foldedLevels,
      changeStatus,
      shiftStatus,
      shiftTeams,
      currentShiftTeam,
      wardShiftTypeMap,
    },
    actions: {
      foldLevel,
      changeMonth,
      changeFocus: (focus: Focus | null) => setState('focus', focus),
      changeShiftTeam: (shiftTeam: ShiftTeam) => setState('currentShiftTeam', shiftTeam),
    },
  };
};

export default useRequestShift;
