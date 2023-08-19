export const moveFocusByKeydown = (
  e: KeyboardEvent,
  shift: RequestShift,
  focus: Focus,
  setFocus: (focus: Focus) => void
) => {
  const flatNurses = shift.divisionNumNurses
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

export const findNurse = (shift: RequestShift, shiftNurseId: number) => {
  return (
    shift.divisionNumNurses
      .flatMap<{ shiftNurse: ShiftNurse }>((x) => x)
      .find((x) => x.shiftNurse.shiftNurseId === shiftNurseId)?.shiftNurse || null
  );
};
