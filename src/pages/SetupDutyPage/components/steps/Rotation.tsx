/* eslint-disable react-refresh/only-export-components */
interface ContentsProps {
  currentRotation: DutyConstraint['rotation'];
  setCurrentRotation: (rotation: DutyConstraint['rotation']) => void;
}

function Contents({ currentRotation, setCurrentRotation }: ContentsProps) {
  return (
    <div className="mt-[3.125rem] h-[22rem] w-[76%] rounded-[1.25rem] bg-white shadow-[0rem_.25rem_2.125rem_#EDE9F5]">
      <div className="mx-auto h-full w-[80%] pt-[4.375rem]">
        <p className="font-apple text-[1.5rem] text-sub-2">
          교대 근무 형태를{' '}
          <span className="text-[1.75rem] font-semibold">{currentRotation}교대</span>로 지정합니다.
        </p>
        <div className="mt-[1.875rem] flex gap-[10%]">
          {[2, 3, 4].map((rotation) => {
            const isActive = currentRotation === rotation;
            return (
              <button
                key={rotation}
                className={`h-[6.25rem] flex-1 rounded-[.9375rem] font-apple text-[2.25rem] font-medium
              ${isActive ? 'bg-main-1 text-white' : 'bg-sub-4.5 text-sub-2.5'}`}
                onClick={() => setCurrentRotation(rotation)}
              >
                {rotation}교대
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Description() {
  return (
    <div className="mt-[1.875rem] h-[12.125rem] w-[76%] rounded-[1.25rem] bg-[#EDE4FF] shadow-[0rem_.25rem_2.125rem_#EDE9F5]">
      <div className="mx-auto flex h-full w-[80%] flex-col justify-center gap-3">
        <p className="font-apple text-[1.5rem] text-sub-2">
          2교대: 데이(D), 나이트(N)로 근무표를 작성합니다.
        </p>
        <p className="font-apple text-[1.5rem] text-sub-2">
          3교대: 데이(D), 이브닝(E), 나이트(N)로 근무표를 작성합니다.
        </p>
      </div>
    </div>
  );
}

export default { Contents, Description };
