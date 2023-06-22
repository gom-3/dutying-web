interface Props {
  shiftList: ShiftList;
  duty: Duty;
}

function CountDutyByNurse({ shiftList, duty }: Props) {
  return (
    <table>
      <thead>
        <tr className="flex h-[60px] items-center bg-[#C1CFF5] pr-4">
          {shiftList.slice(1).map((shift, index) => (
            <th
              key={index}
              className="w-[40px] shrink-0 text-center text-base font-bold text-[#333]"
            >
              {shift.name}
            </th>
          ))}
          <th className="w-[40px] shrink-0 text-center text-base font-bold text-[#333]">O</th>
          <th className="w-[40px] shrink-0 text-center text-base font-bold text-[#333]">WO</th>
        </tr>
      </thead>
      <tbody>
        {duty.dutyRows.map((row, i) => (
          <tr key={i} className="flex h-[50px] border-b-[1px] border-[#E0E0E0]">
            {shiftList.slice(1).map((_, index) => (
              <td key={index} className="flex h-full w-[40px] items-center justify-center">
                {row.shiftIndexList.filter((shiftIndex) => shiftIndex === index).length}
              </td>
            ))}
            <td className="flex h-full w-[40px] items-center justify-center">
              {row.shiftIndexList.filter((shiftIndex) => shiftIndex === 0).length}
            </td>
            <td className="flex h-full w-[40px] items-center justify-center">
              {
                row.shiftIndexList.filter(
                  (shiftIndex, i) =>
                    shiftIndex === 0 && duty.days.find((x) => x.day === i + 1)?.dayKind != 'workday'
                ).length
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CountDutyByNurse;
