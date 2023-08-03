import useEditWard from '@hooks/useEditWard';

function SetDivision() {
  const {
    state: { tempWard },
    actions: { changeTempWard },
  } = useEditWard();

  return tempWard ? (
    <div className="mx-auto h-full w-[80%] pt-[4.375rem]">
      <p className="font-apple text-[1.5rem] text-sub-2">
        숙련도 구분을{' '}
        <span className="text-[1.75rem] font-semibold">{tempWard.levelDivision}로 </span>
        지정합니다.
      </p>
      <div className="mt-[1.875rem] flex gap-[10%]">
        {[3, 4, 5, 6].map((level) => {
          const isActive = tempWard.levelDivision === level;
          return (
            <button
              key={level}
              className={`h-[6.25rem] flex-1 rounded-[.9375rem] font-apple text-[2.25rem] font-medium
              ${isActive ? 'bg-main-1 text-white' : 'bg-sub-4.5 text-sub-2.5'}`}
              onClick={() => changeTempWard('levelDivision', level)}
            >
              {level}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;
}

export default SetDivision;
