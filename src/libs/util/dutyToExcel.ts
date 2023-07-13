import * as Excel from 'exceljs';

export const dutyToExcel = (duty: Duty, shiftList: ShiftList) => {
  const flatDuty = duty.dutyRowsByLevel.flatMap((row) => row.dutyRows);

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(`${duty.month}월 근무표`);
  console.log(
    ...(shiftList.map((x) => ({
      key: x.shortName,
      width: 8,
      style: { alignment: { horizontal: 'center', vertical: 'middle' } },
    })) as Excel.Column[])
  );
  worksheet.columns = [
    { key: 'name', width: 8, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
    {
      key: 'lastShift',
      width: 10,
      style: { alignment: { horizontal: 'center', vertical: 'middle' } },
    },
    ...(duty.days.map((day) => ({
      key: day.day.toString(),
      width: 3,
      style: { alignment: { horizontal: 'center', vertical: 'middle' } },
    })) as Excel.Column[]),
    ...(shiftList.slice(1).map((x) => ({
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

  const title = worksheet.addRow({ name: `${duty.month}월 근무표` });
  title.font = { bold: true, size: 16 };
  title.alignment = { horizontal: 'left' };

  const header = worksheet.addRow({
    name: '이름',
    lastShift: '전달 근무',
    ...duty.days.reduce((acc, day, index) => {
      acc[index + 1] = day.day;
      return acc;
    }, {} as { [key: string]: number }),
    ...shiftList.slice(1).reduce((acc, shift) => {
      acc[shift.shortName] = shift.shortName;
      return acc;
    }, {} as { [key: string]: string }),
    O: 'O',
    WO: 'WO',
  });

  // 토요일 일요일 공휴일 표시
  duty.days.map((day) => {
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

  flatDuty.map((dutyRow) =>
    worksheet.addRow({
      name: dutyRow.user.name,
      lastShift: dutyRow.lastShiftIndexList
        .map((shiftIndex) =>
          shiftList[shiftIndex].shortName === '/' ? 'O' : shiftList[shiftIndex].shortName
        )
        .join(''),
      ...dutyRow.shiftIndexList.reduce((acc, shiftIndex, index) => {
        acc[index + 1] = shiftList[shiftIndex].shortName;
        return acc;
      }, {} as { [key: string]: string }),
      ...shiftList.slice(1).reduce((acc, shift, index) => {
        acc[shift.shortName] = dutyRow.shiftIndexList.filter((x) => x === index + 1).length;
        return acc;
      }, {} as { [key: string]: number }),
      O: dutyRow.shiftIndexList.filter((x) => x === 0).length,
      WO: dutyRow.shiftIndexList.filter(
        (shiftIndex, i) =>
          shiftIndex === 0 && duty.days.find((x) => x.day === i + 1)?.dayKind != 'workday'
      ).length,
    })
  );

  shiftList.slice(1).map((shift, index) => {
    worksheet.addRow({
      lastShift: shift.name,
      ...duty.days.reduce((acc, _, i) => {
        acc[i + 1] = flatDuty.filter((item) => item.shiftIndexList[i] === index + 1).length;
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
    anchor.download = `${duty.month}월 근무표.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  });

  return workbook;
};
