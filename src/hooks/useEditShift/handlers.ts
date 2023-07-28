import { koToEn } from '@libs/util/koToEn';

export const moveFocusByKeydown = (
  e: KeyboardEvent,
  shift: Shift | RequestShift,
  focus: Focus,
  setFocus: (focus: Focus) => void
) => {
  const { level, day, row } = focus;
  const levelCnt = shift.levelNurses.length;
  const rowCnt = shift.levelNurses[level].length;
  const dayCnt = shift.days.length;
  let newLevel = level;
  let newDay = day;
  let newRow = row;

  if (['Ctrl', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) != -1) {
    e.preventDefault(); // Key 입력으로 화면이 이동하는 것을 막습니다.
  }

  switch (e.key) {
    case 'ArrowLeft': {
      if (day === 0) {
        if (row === 0) {
          newLevel = level === 0 ? levelCnt - 1 : level - 1;
          newDay = dayCnt - 1;
          newRow = shift.levelNurses[newLevel].length - 1;
        } else {
          newDay = dayCnt - 1;
          newRow = row - 1;
        }
      } else {
        newDay = e.ctrlKey || e.metaKey ? 0 : Math.max(0, day - 1);
        newRow = row;
      }
      break;
    }
    case 'ArrowRight': {
      if (day === dayCnt - 1) {
        if (row === rowCnt - 1) {
          newLevel = level === levelCnt - 1 ? 0 : level + 1;
          newDay = 0;
          newRow = 0;
        } else {
          newRow = row + 1;
          newDay = 0;
        }
      } else {
        newDay = e.ctrlKey || e.metaKey ? dayCnt - 1 : Math.min(dayCnt - 1, day + 1);
        newRow = row;
      }
      break;
    }
    case 'ArrowUp': {
      if (row === 0) {
        newLevel = level === 0 ? levelCnt - 1 : level - 1;
        newDay = day;
        newRow = shift.levelNurses[newLevel].length - 1;
      } else {
        newDay = day;
        newRow = e.ctrlKey || e.metaKey ? 0 : row - 1;
      }
      break;
    }
    case 'ArrowDown': {
      if (row === rowCnt - 1) {
        newLevel = level === levelCnt - 1 ? 0 : level + 1;
        newDay = day;
        newRow = 0;
      } else {
        newDay = day;
        newRow = e.ctrlKey || e.metaKey ? rowCnt - 1 : row + 1;
      }
      break;
    }
  }

  setFocus({
    level: newLevel,
    day: newDay,
    row: newRow,
  });
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

export const updateCheckFaultOption = (ward: Ward) => {
  return {
    twoOffAfterNight: {
      isActive: true,
      regExp: new RegExp(`2([01]|3[012])`, 'g'),
      message: `나이트 근무 후 2일 이상 OFF를 권장합니다.`,
      type: 'wrong',
    },
    ed: {
      isActive: true,
      regExp: new RegExp(`10`, 'g'),
      message: `E 근무 후 D 근무는 권장되지 않습니다.`,
      type: 'wrong',
    },
    maxContinuousWork: {
      isActive: true,
      regExp: new RegExp(`(?<=[^012])[012]{${ward.maxContinuousWork + 1},}(?=[^012])`, 'g'),
      message: `근무는 연속 ${ward.maxContinuousWork}일을 초과할 수 없습니다.`,
      type: 'wrong',
    },
    maxContinuousNight: {
      isActive: true,
      regExp: new RegExp(`2{${ward.maxContinuousNight + 1},}`, 'g'),
      message: `나이트 근무가 연속 ${ward.maxContinuousNight}일을 초과했습니다`,
      type: 'wrong',
    },
    minNightInterval: {
      isActive: true,
      regExp: new RegExp(`2[^2]{1,${ward.minNightInterval - 1}}2`, 'g'),
      message: `나이트 간격이 최소 ${ward.minNightInterval}일 이상이어야 합니다.`,
      type: 'wrong',
    },
    singleNight: {
      isActive: true,
      regExp: new RegExp(`(?<!(2|x))2(?!(2|x))`, 'g'),
      message: `단일 나이트 근무는 권장되지 않습니다.`,
      type: 'bad',
    },
    maxContinuousOff: {
      isActive: false,
      regExp: new RegExp(`3{4,}`, 'g'),
      message: `OFF가 연속 3일을 초과했습니다.`,
      type: 'bad',
    },
    pongdang: {
      isActive: true,
      regExp: new RegExp(`(3030|0303|1313|3131)`, 'g'),
      message: `퐁당퐁당 근무입니다.`,
      type: 'bad',
    },
    noeeod: {
      isActive: true,
      regExp: new RegExp(`130`, 'g'),
      message: `EOD 형태의 근무는 권장되지 않습니다.`,
      type: 'bad',
    },
  } as CheckFaultOptions;
};

export const checkShift = (shift: Shift, checkFaultOptions: CheckFaultOptions) => {
  const faults: Map<string, Fault> = new Map();

  for (let i = 0; i < shift.levelNurses.length; i++) {
    const level = shift.levelNurses[i];
    for (let j = 0; j < level.length; j++) {
      const row = level[j];
      for (const key of Object.keys(checkFaultOptions) as FaultType[]) {
        const option = checkFaultOptions[key];
        let str = row.shiftTypeIndexList.map((x) => (x.shift === null ? 'x' : x.shift)).join('');
        str = 'x' + str + 'x'; // 단일 나이트 검사를 위한 처리
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const match = option.regExp.exec(str);
          if (match === null) break;
          const focus = { level: i, row: j, day: match.index - 1 };

          faults.set(Object.values(focus).join(), {
            type: option.type,
            faultType: key,
            nurse: row.nurse,
            focus,
            message: option.message,
            matchString: match[0]
              .split('')
              .map((x) => (x === 'x' ? '-' : shift.shiftTypes[Number(x)].shortName))
              .map((x) => (x === '/' ? 'O' : x))
              .join(''),
            length: match[0].length,
          });
        }
      }
    }
  }

  return faults;
};
