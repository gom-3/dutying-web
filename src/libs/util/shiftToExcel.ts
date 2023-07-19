import * as Excel from 'exceljs';

export const shiftToExcel = (shift: Shift, shiftTypeList: ShiftType[]) => {
  const flatRows = shift.levels.flatMap((row) => row);

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(`${shift.month}월 근무표`);

  worksheet.columns = [
    { key: 'name', width: 8, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
    {
      key: 'lastShift',
      width: 10,
      style: { alignment: { horizontal: 'center', vertical: 'middle' } },
    },
    ...(shift.days.map((day) => ({
      key: day.day.toString(),
      width: 3,
      style: { alignment: { horizontal: 'center', vertical: 'middle' } },
    })) as Excel.Column[]),
    ...(shiftTypeList.slice(1).map((x) => ({
      key: x.shortName,
      width: 8,
      style: { alignment: { horizontal: 'center', vertical: 'middle' } },
    })) as Excel.Column[]),
    {
      key: 'O',
      width: 8,
      style: { alignment: { horizontal: 'center', vertical: 'middle' } },
    },
    {
      key: 'WO',
      width: 8,
      style: { alignment: { horizontal: 'center', vertical: 'middle' } },
    },
  ];

  const title = worksheet.addRow({ name: `${shift.month}월 근무표` });
  title.font = { bold: true, size: 16 };
  title.alignment = { horizontal: 'left' };

  const header = worksheet.addRow({
    name: '이름',
    lastShift: '전달 근무',
    ...shift.days.reduce((acc, day, index) => {
      acc[index + 1] = day.day;
      return acc;
    }, {} as { [key: string]: number }),
    ...shiftTypeList.slice(1).reduce((acc, shiftType) => {
      acc[shiftType.shortName] = shiftType.shortName;
      return acc;
    }, {} as { [key: string]: string }),
    O: 'O',
    WO: 'WO',
  });

  // 토요일 일요일 공휴일 표시
  shift.days.map((day) => {
    header.getCell(day.day.toString()).font = {
      color: {
        argb:
          day.dayKind === 'workday'
            ? 'FF000000'
            : day.dayKind === 'saturday'
            ? 'FF2029FA'
            : 'FFFA2D12',
      },
    };
  });

  flatRows.map((dutyRow) =>
    worksheet.addRow({
      name: dutyRow.nurse.name,
      lastShift: dutyRow.lastShiftTypeIndexList
        .map(({ current }) =>
          current
            ? shiftTypeList[current].shortName === '/'
              ? 'O'
              : shiftTypeList[current].shortName
            : ''
        )
        .join(''),
      ...dutyRow.shiftTypeIndexList.reduce((acc, { current }, index) => {
        acc[index + 1] = current != null ? shiftTypeList[current].shortName : '';
        return acc;
      }, {} as { [key: string]: string }),
      ...shiftTypeList.slice(1).reduce((acc, shiftType, index) => {
        acc[shiftType.shortName] = dutyRow.shiftTypeIndexList.filter(
          ({ current }) => current === index + 1
        ).length;
        return acc;
      }, {} as { [key: string]: number }),
      O: dutyRow.shiftTypeIndexList.filter(({ current }) => current === 0).length,
      WO: dutyRow.shiftTypeIndexList.filter(
        ({ current }, i) =>
          current === 0 && shift.days.find((x) => x.day === i + 1)?.dayKind != 'workday'
      ).length,
    })
  );

  shiftTypeList.slice(1).map((shiftType, index) => {
    worksheet.addRow({
      lastShift: shiftType.name,
      ...shift.days.reduce((acc, _, i) => {
        acc[i + 1] = flatRows.filter(
          (item) => item.shiftTypeIndexList[i].current === index + 1
        ).length;
        return acc;
      }, {} as { [key: string]: number }),
    });
  });

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    // 파일명
    anchor.download = `${shift.month}월 근무표.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  });

  return workbook;
};