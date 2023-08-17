/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRequestShift, updateRequestShift } from '@libs/api/shift';
import { koToEn } from '@libs/util/koToEn';
import { useRequestShiftStore } from './store';
import { shallow } from 'zustand/shallow';
import { findNurse, keydownEventMapper, moveFocusByKeydown } from '@hooks/useEditShift/handlers';
import { produce } from 'immer';
import useGlobalStore from 'store';

const useRequestShift = () => {
  const [year, month, focus, foldedLevels, setState] = useRequestShiftStore(
    (state) => [state.year, state.month, state.focus, state.foldedLevels, state.setState],
    shallow
  );
  const { wardId } = useGlobalStore();

  const queryClient = useQueryClient();
  const requestShiftQueryKey = ['requestShift', wardId, year, month];
  const { data: requestShift, status: shiftStatus } = useQuery(
    requestShiftQueryKey,
    () => getRequestShift(wardId!, year, month),
    {
      enabled: wardId !== null,
      onSuccess: (data) =>
        setState(
          'foldedLevels',
          data.divisionShiftNurses.map(() => false)
        ),
    }
  );
  const { mutate: focusedShiftChange, status: changeStatus } = useMutation(
    ({
      requestShift,
      focus,
      shiftTypeId,
    }: {
      requestShift: RequestShift;
      focus: Focus;
      shiftTypeId: number | null;
    }) =>
      updateRequestShift(
        year,
        month,
        requestShift.days[focus.day].day,
        findNurse(requestShift, focus.shiftNurseId)!.shiftNurseId,
        shiftTypeId
      ),
    {
      onMutate: async ({ focus, shiftTypeId }) => {
        await queryClient.cancelQueries(['shift']);
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
      !focus ||
      !requestShift ||
      requestShift.divisionShiftNurses
        .flatMap((x) => x)
        .find((x) => x.shiftNurse.shiftNurseId === focus.shiftNurseId)!.wardReqShiftList[
        focus.day
      ] === shiftTypeId
    )
      return;
    focusedShiftChange({ requestShift, focus, shiftTypeId });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!focus || !requestShift) return;
    moveFocusByKeydown(e, requestShift, focus, (focus: Focus | null) => setState('focus', focus));
    keydownEventMapper(
      e,
      ...requestShift.shiftTypes.map((shiftType) => ({
        keys: [shiftType.shortName],
        callback: () => {
          if (shiftType.shortName.toUpperCase() === koToEn(e.key).toUpperCase() && focus) {
            changeFocusedShift(shiftType.wardShiftTypeId);
          }
        },
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
    },
    actions: {
      foldLevel,
      changeMonth,
      changeFocus: (focus: Focus | null) => setState('focus', focus),
    },
  };
};

export default useRequestShift;
