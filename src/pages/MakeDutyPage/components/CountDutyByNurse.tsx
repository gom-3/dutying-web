interface Props {
  duty: Duty;
}

function CountDutyByNurse({ duty }: Props) {
  return (
    <table>
      <thead>
        <tr className="flex h-[60px] items-center bg-[#C1CFF5] pr-4">
          <th className="w-[40px] shrink-0  text-center text-base font-bold text-[#333]">D</th>
          <th className="w-[40px] shrink-0  text-center text-base font-bold text-[#333]">E</th>
          <th className="w-[40px] shrink-0  text-center text-base font-bold text-[#333]">N</th>
          <th className="w-[40px] shrink-0  text-center text-base font-bold text-[#333]">O</th>
          <th className="w-[40px] shrink-0  text-center text-base font-bold text-[#333]">WO</th>
        </tr>
      </thead>
      <tbody>
        {duty.dutyRows.map((row, i) => (
          <tr key={i} className="flex h-[50px] border-b-[1px] border-[#E0E0E0]">
            <td className="flex h-full w-[40px] items-center justify-center">
              {row.shiftList.filter((shiftId) => shiftId === 1).length}
            </td>
            <td className="flex h-full w-[40px] items-center justify-center">
              {row.shiftList.filter((shiftId) => shiftId === 2).length}
            </td>
            <td className="flex h-full w-[40px] items-center justify-center">
              {row.shiftList.filter((shiftId) => shiftId === 3).length}
            </td>
            <td className="flex h-full w-[40px] items-center justify-center">
              {row.shiftList.filter((shiftId) => shiftId === 0).length}
            </td>
            <td className="flex h-full w-[40px] items-center justify-center">
              {
                row.shiftList.filter(
                  (shiftId, i) =>
                    shiftId === 0 && duty.days.find((x) => x.day === i + 1)?.dayKind != 'workday'
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
