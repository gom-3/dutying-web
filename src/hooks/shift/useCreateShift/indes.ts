import useLoading from '@hooks/ui/useLoading';
import useEditShift from '../useEditShift';
import { match } from 'ts-pattern';
import axiosInstance from '@libs/api/client';
import { useQueryClient } from '@tanstack/react-query';
import useAuth from '@hooks/auth/useAuth';
import { updateShifts } from '@libs/api/shift';
import toast from 'react-hot-toast';

function useCreateShift() {
  const { setLoading } = useLoading();
  const {
    queryKey: { shiftQueryKey },
    state: { year, month, shift, wardShiftTypeMap },
    actions: { postShift },
  } = useEditShift();
  const {
    state: { wardId },
  } = useAuth();

  const queryClient = useQueryClient();

  const autoCompleteShift = async () => {
    if (!shift || !wardShiftTypeMap || !wardId) return;
    if (shift?.divisionShiftNurses.flatMap((x) => x).length < 10) {
      toast.error('자동완성 기능을 사용하시려면 최소 10명의 간호사가 필요합니다');
      return;
    }
    if (
      !confirm(
        '근무표를 자동으로 채우시겠습니까?\n신청 근무를 최대한 반영한 채 채워집니다.\n약 1분~2분이 소요됩니다!'
      )
    )
      return;
    setLoading(true);

    try {
      const duty = (
        await axiosInstance.post<string[][]>(
          'https://ml.dutying.net/make',
          {
            names: shift.divisionShiftNurses
              .flatMap((x) => x)
              .map((row) => ({
                name: row.shiftNurse.name,
                prev: ['0'].concat(
                  row.lastWardShiftList.map((shiftId) => {
                    return shiftId
                      ? match(wardShiftTypeMap.get(shiftId)?.shortName)
                          .with('D', () => '1')
                          .with('E', () => '2')
                          .with('N', () => '3')
                          .with('O', () => '4')
                          .otherwise(() => '0')
                      : '0';
                  })
                ),
                request: row.wardShiftList.map((shiftId) => {
                  return shiftId
                    ? match(wardShiftTypeMap.get(shiftId)?.shortName)
                        .with('D', () => '1')
                        .with('E', () => '2')
                        .with('N', () => '3')
                        .with('O', () => '4')
                        .otherwise(() => '0')
                    : '0';
                }),
              })),
          },
          {
            withCredentials: false,
          }
        )
      ).data;

      if (!duty || !shift || !wardShiftTypeMap) return;
      const flatNurses = shift.divisionShiftNurses.flatMap((x) => x);
      const updateShiftPromises: Promise<void>[] = [];
      for (let i = 0; i < duty.length; i++) {
        const wardShiftsDTO = [];
        for (let j = 0; j < duty[i].length; j++) {
          const row = flatNurses[i];
          const wardShiftType =
            shift.wardShiftTypes.find((x) => {
              return (
                x.shortName ===
                match(duty[i][j])
                  .with('D', () => 'D')
                  .with('E', () => 'E')
                  .with('N', () => 'N')
                  .with('-', () => 'O')
                  .otherwise(() => null)
              );
            }) || null;
          if (!row || j + 1 > shift.days.length) continue;

          wardShiftsDTO.push({
            shiftNurseId: row.shiftNurse.shiftNurseId,
            date: `${year}-${month.toString().padStart(2, '0')}-${(j + 1)
              .toString()
              .padStart(2, '0')}`,
            wardShiftTypeId: wardShiftType === null ? null : wardShiftType.wardShiftTypeId,
          });
        }
        updateShiftPromises.push(updateShifts(wardId, wardShiftsDTO));
      }
      await Promise.all(updateShiftPromises);
      await queryClient.invalidateQueries(shiftQueryKey);
      postShift();
    } catch (e) {
      console.error(e);
      toast.error('근무표 생성에 실패했습니다..');
    } finally {
      setLoading(false);
    }
  };

  return {
    autoCompleteShift,
  };
}

export default useCreateShift;
