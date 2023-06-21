/* eslint-disable react-refresh/only-export-components */
interface ContentsProps {
  currentRotation: number;
  setCurrentRotation: (rotation: number) => void;
}

function Contents({ currentRotation, setCurrentRotation }: ContentsProps) {
  return (
    <div className="mx-auto h-full w-[80%] pt-[70px]">
      <p className="font-apple text-[24px] text-sub-2">
        교대 근무 형태를 <span className="text-[28px] font-medium">{currentRotation}교대</span>로
        지정합니다.
      </p>
      <div className="mt-[30px] flex gap-[10%]">
        {[2, 3, 4].map((rotation) => {
          const isActive = currentRotation === rotation;
          return (
            <button
              key={rotation}
              className={`h-[100px] flex-1 rounded-[15px] font-apple text-[36px] font-medium
              ${isActive ? 'bg-main-1 text-white' : 'bg-[#E7E7EF] text-[#93939D]'}`}
              onClick={() => setCurrentRotation(rotation)}
            >
              {rotation}교대
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Description() {
  return (
    <div className="mx-auto flex h-full w-[80%] flex-col justify-center gap-3">
      <p className="font-apple text-[24px]">2교대: 데이(D), 나이트(N)로 근무표를 작성합니다.</p>
      <p className="font-apple text-[24px]">
        3교대: 데이(D), 이브닝(E), 나이트(N)로 근무표를 작성합니다.
      </p>
    </div>
  );
}

export default { Contents, Description };
