import { koToEn } from '@libs/util/koToEn';

export const moveFocusByKeydown = (
  e: KeyboardEvent,
  shift: Shift,
  focus: Focus,
  setFocus: (focus: Focus) => void
) => {
  const flatNurses = shift.divisionShiftNurses
    .flatMap<{ shiftNurse: ShiftNurse }>((x) => x)
    .map((x) => x.shiftNurse);
  const { day, shiftNurseId } = focus;
  const dayCnt = shift.days.length;
  const nurseIndex = flatNurses.findIndex((x) => x.shiftNurseId === shiftNurseId);
  let newNurseId = shiftNurseId;
  let newDay = day;

  if (['Ctrl', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) != -1) {
    e.preventDefault(); // Key 입력으로 화면이 이동하는 것을 막습니다.
  }

  switch (e.key) {
    case 'ArrowLeft': {
      if (day === 0) {
        if (nurseIndex === 0) {
          newDay = dayCnt - 1;
          newNurseId = flatNurses[flatNurses.length - 1].shiftNurseId;
        } else {
          newNurseId = flatNurses[nurseIndex - 1].shiftNurseId;
          newDay = dayCnt - 1;
        }
      } else {
        newDay = e.ctrlKey || e.metaKey ? 0 : Math.max(0, day - 1);
      }
      break;
    }
    case 'ArrowRight': {
      if (day === dayCnt - 1) {
        if (nurseIndex === flatNurses.length - 1) {
          newNurseId = flatNurses[0].shiftNurseId;
          newDay = 0;
        } else {
          newNurseId = flatNurses[nurseIndex + 1].shiftNurseId;
          newDay = 0;
        }
      } else {
        newDay = e.ctrlKey || e.metaKey ? dayCnt - 1 : Math.min(dayCnt - 1, day + 1);
      }
      break;
    }
    case 'ArrowUp': {
      if (nurseIndex === 0) {
        newNurseId = flatNurses[flatNurses.length - 1].shiftNurseId;
        newDay = day;
      } else {
        newNurseId =
          e.ctrlKey || e.metaKey
            ? flatNurses[0].shiftNurseId
            : flatNurses[nurseIndex - 1].shiftNurseId;
        newDay = day;
      }
      break;
    }
    case 'ArrowDown': {
      if (nurseIndex === flatNurses.length - 1) {
        newNurseId = flatNurses[0].shiftNurseId;
        newDay = day;
      } else {
        newNurseId =
          e.ctrlKey || e.metaKey
            ? flatNurses[flatNurses.length - 1].shiftNurseId
            : flatNurses[nurseIndex + 1].shiftNurseId;
        newDay = day;
      }
      break;
    }
  }
  if (newDay != day || newNurseId != shiftNurseId) {
    setFocus({
      day: newDay,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shiftNurseName: findNurse(shift, shiftNurseId)!.name,
      shiftNurseId: newNurseId,
    });
  }
};

export const keydownEventMapper = (
  e: KeyboardEvent,
  ...op: { keys: string[]; callback: () => void }[]
) => {
  op.forEach(({ keys, callback }) => {
    if (keys.map((key) => key.toUpperCase()).indexOf(koToEn(e.key).toUpperCase()) != -1) {
      callback();
    }
  });
};

export const updateCheckFaultOption = (wardConstraint: WardConstraint): CheckFaultOptions => {
  return {
    maxContinuousWork: {
      type: 'wrong',
      isActive: wardConstraint.maxContinuousWork,
      regExp: new RegExp(
        `(?<=[^den])[den]{${wardConstraint.maxContinuousWorkVal + 1},}(?=[^den])`,
        'g'
      ),
      message: `근무는 연속 ${wardConstraint.maxContinuousWorkVal}일을 초과할 수 없습니다.`,
      value: wardConstraint.maxContinuousWorkVal,
      label: '연속 근무 수',
    },
    minNightInterval: {
      type: 'wrong',
      isActive: wardConstraint.minNightInterval,
      regExp: new RegExp(`n[^n]{1,${wardConstraint.minNightIntervalVal - 1}}n`, 'g'),
      message: `나이트 간격이 최소 ${wardConstraint.minNightIntervalVal}일 이상이어야 합니다.`,
      value: wardConstraint.minNightIntervalVal,
      label: '나이트 간격',
    },
    maxContinuousNight: {
      type: 'wrong',
      isActive: wardConstraint.maxContinuousNight,
      regExp: new RegExp(`n{${wardConstraint.maxContinuousNightVal + 1},}`, 'g'),
      message: `나이트 근무가 연속 ${wardConstraint.maxContinuousNightVal}일을 초과했습니다`,
      value: wardConstraint.maxContinuousNightVal,
      label: '연속 나이트',
    },
    minContinuousNight: {
      type: 'bad',
      isActive: wardConstraint.minContinuousNight,
      regExp: new RegExp(
        `(?<!(n|-))n{1,${wardConstraint.minContinuousNightVal - 1}}(?!(n|-))`,
        'g'
      ),
      message: `나이트 근무는 최소 ${wardConstraint.minContinuousNightVal}일 이상 배정해야 합니다.`,
      value: wardConstraint.minContinuousNightVal,
      label: '연속 나이트',
    },
    minOffAssignAfterNight: {
      type: 'bad',
      isActive: wardConstraint.minOffAssignAfterNight,
      regExp: new RegExp(`n([de]|o{1,${wardConstraint.minOffAssignAfterNightVal - 1}}[den])`, 'g'),
      message: `나이트 근무 후 ${wardConstraint.minOffAssignAfterNightVal}일 이상 OFF를 권장합니다.`,
      value: wardConstraint.minOffAssignAfterNightVal,
      label: '나이트 근무 후 오프 배정',
    },
    excludeCertainWorkTypes: {
      type: 'bad',
      isActive: wardConstraint.excludeCertainWorkTypes,
      regExp: new RegExp(`(ed|nd|ne|nod)`, 'g'),
      message: `ND/ED/NE/NOD 형태의 근무는 권장되지 않습니다.`,
      value: null,
      label: 'ND / ED / NE / NOD 근무 형태 불가능',
    },
    excludeNightBeforeReqOff: {
      type: 'bad',
      isActive: wardConstraint.excludeNightBeforeReqOff,
      regExp: new RegExp(`nO`, 'g'),
      message: `신청 오프 전날에는 나이트 근무를 권장하지 않습니다.`,
      value: null,
      label: '신청 오프 전날에는 나이트 근무 불가능',
    },
  };
};

export const checkShift = (
  shift: Shift,
  checkFaultOptions: CheckFaultOptions,
  wardShiftTypeMap: Map<number, WardShiftType>
) => {
  const faults: Map<string, Fault> = new Map();

  for (let i = 0; i < shift.divisionShiftNurses.length; i++) {
    const division = shift.divisionShiftNurses[i];
    for (let j = 0; j < division.length; j++) {
      const row = division[j];
      for (const key of Object.keys(checkFaultOptions) as FaultType[]) {
        const option = checkFaultOptions[key];
        if (option.isActive === false) continue;
        let str = row.wardShiftList
          .map((x, index) =>
            x === null
              ? '-'
              : x === row.wardReqShiftList[index]
              ? wardShiftTypeMap.get(x)?.shortName.toUpperCase()
              : wardShiftTypeMap.get(x)?.shortName.toLowerCase()
          )
          .join('');
        str = '-' + str + '-'; // 단일 나이트 검사를 위한 처리
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const match = option.regExp.exec(str);
          if (match === null) break;
          const focus: Focus = {
            shiftNurseId: row.shiftNurse.shiftNurseId,
            shiftNurseName: row.shiftNurse.name,
            day: match.index - 1,
          };

          faults.set(
            Object.values({ shiftNurseId: focus.shiftNurseId, day: focus.day }).join(','),
            {
              type: option.type,
              faultType: key,
              nurseName: row.shiftNurse.nurseInfo.name,
              focus,
              message: option.message,
              matchString: match[0],
              length: match[0].length,
            }
          );
        }
      }
    }
  }

  return faults;
};

export const findNurse = (shift: Shift, shiftNurseId: number) => {
  return (
    shift.divisionShiftNurses
      .flatMap<{ shiftNurse: ShiftNurse }>((x) => x)
      .find((x) => x.shiftNurse.shiftNurseId === shiftNurseId)?.shiftNurse || null
  );
};
