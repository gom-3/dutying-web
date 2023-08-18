/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as Excel from 'exceljs';

export const shiftToExcel = (month: number, shift: Shift) => {
  const flatRows = shift.divisionShiftNurses.flatMap((row) => row);

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(`${month}월 근무표`);

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
    ...(shift.wardShiftTypes.map((x) => ({
      key: x.shortName,
      width: 8,
      style: { alignment: { horizontal: 'center', vertical: 'middle' } },
    })) as Excel.Column[]),
    {
      key: 'WO',
      width: 8,
      style: { alignment: { horizontal: 'center', vertical: 'middle' } },
    },
  ];

  const title = worksheet.addRow({ name: `${month}월 근무표` });
  title.font = { bold: true, size: 16 };
  title.alignment = { horizontal: 'left' };

  const header = worksheet.addRow({
    name: '이름',
    lastShift: '전달 근무',
    ...shift.days.reduce((acc, day, index) => {
      acc[index + 1] = day.day;
      return acc;
    }, {} as { [key: string]: number }),
    ...shift.wardShiftTypes.reduce((acc, shiftType) => {
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
          day.dayType === 'workday'
            ? 'FF000000'
            : day.dayType === 'saturday'
            ? 'FF2029FA'
            : 'FFFA2D12',
      },
    };
  });

  flatRows.map((dutyRow) =>
    worksheet.addRow({
      name: dutyRow.shiftNurse.name,
      lastShift: dutyRow.lastWardShiftList
        .map((current) =>
          current !== null
            ? shift.wardShiftTypes.find((x) => x.wardShiftTypeId === current)!.shortName
            : ''
        )
        .join(''),
      ...dutyRow.wardShiftList.reduce((acc, current, index) => {
        acc[index + 1] =
          current != null
            ? shift.wardShiftTypes.find((x) => x.wardShiftTypeId === current)!.shortName
            : '';
        return acc;
      }, {} as { [key: string]: string }),
      ...shift.wardShiftTypes.reduce((acc, shiftType, index) => {
        acc[shiftType.shortName] = dutyRow.wardShiftList.filter(
          (current) => current === index
        ).length;
        return acc;
      }, {} as { [key: string]: number }),
      WO: dutyRow.wardShiftList.filter(
        (current, i) =>
          current === 3 && shift.days.find((x) => x.day === i + 1)?.dayType != 'workday'
      ).length,
    })
  );

  shift.wardShiftTypes.map((shiftType, index) => {
    worksheet.addRow({
      lastShift: shiftType.name,
      ...shift.days.reduce((acc, _, i) => {
        acc[i + 1] = flatRows.filter((item) => item.wardShiftList[i] === index).length;
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
    anchor.download = `${month}월 근무표.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  });

  return workbook;
};
