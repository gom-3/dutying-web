interface Props {
  duty: Duty;
  shiftList: ShiftList;
}

function CountDutyByDay({ duty, shiftList }: Props) {
  return (
    <table>
      <tbody>
        {shiftList.slice(1).map((shift, index) => (
          <tr
            key={index}
            className="flex h-[50px] items-center justify-center gap-3 border-b-[1px] border-[#E0E0E0] px-4"
          >
            <td className="text-[#333} w-[40px] text-center text-sm font-bold">{shift.fullname}</td>
            <td className="text-[#333} w-[40px] text-center text-sm font-bold">{shift.name}</td>
            <td className="flex">
              {duty.lastDays.map((_date, i) => (
                <p
                  key={i}
                  className="m-[2px] flex h-[26px] w-[26px] items-center justify-center text-center text-sm font-bold"
                >
                  {duty.dutyRows.filter((item) => item.shiftIndexList[i] === index + 1).length}
                </p>
              ))}
            </td>
            <td className="flex">
              {duty.days.map((_date, i) => (
                <p
                  key={i}
                  className="m-[2px] flex h-[26px] w-[26px] items-center justify-center text-center text-sm font-bold"
                >
                  {duty.dutyRows.filter((item) => item.shiftIndexList[i] === index + 1).length}
                </p>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CountDutyByDay;
