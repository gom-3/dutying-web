import 'index.css';

interface Props {
  nurses: Nurse[][];
}

const NurseCount = ({ nurses }: Props) => {
  const dots = (num: number) => {
    return Array.from({ length: num }).map(() => (
      <div className="h-[0.375rem] w-[0.375rem] rounded-full bg-white" />
    ));
  };

  const proficiencyCount = () => {
    return nurses.map((group, i) => {
      return (
        <div className="relative flex h-[6.125rem] w-[7.3rem] flex-col items-center justify-center border-r-[0.5px] last:border-r-0">
          <div className="absolute top-[0.1875rem] flex w-[1.5rem] justify-between">
            {dots(3 - i)}
          </div>
          <div className="ml-[0.6rem] mt-[0.75rem] flex items-center justify-center">
            {group.length}
            <div className="font-apple text-[1rem]">명</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex">
      <div className="flex flex-col items-center">
        <div className="mb-[1rem] font-apple text-[1rem] font-medium text-sub-2">전체 인원</div>
        <div className="flex h-[8.125rem] w-[8.125rem] items-center justify-center rounded-[20px] bg-main-1 font-poppins text-[2.5rem] font-medium text-white shadow-shadow-2">
          20<div className="font-apple text-[1rem]">명</div>
        </div>
      </div>
      <div className="ml-[1.25rem] flex flex-col items-center">
        <div className="mb-[1rem] font-apple text-[1rem] font-medium text-sub-2">숙련도별</div>
        <div className="flex h-[8.125rem] w-[22rem] items-center rounded-[20px] bg-main-2 font-poppins text-[2.5rem] font-medium text-white shadow-shadow-2">
          
          <div className="relative flex h-[6.125rem] w-[7.3rem] flex-col items-center justify-center border-r-[0.5px]">
            <div className="absolute top-[0.1875rem] flex w-[0.95rem] justify-between">
              {dots(2)}
            </div>
            <div className="ml-[0.6rem] mt-[0.75rem] flex items-center justify-center">
              5<div className="font-apple text-[1rem]">명</div>
            </div>
          </div>
          <div className="relative flex h-[6.125rem] w-[7.3rem] flex-col items-center justify-center">
            <div className="absolute top-[0.1875rem] flex w-[0.4rem] justify-between">
              {dots(1)}
            </div>
            <div className="ml-[0.6rem] mt-[0.75rem] flex items-center justify-center">
              5<div className="font-apple text-[1rem]">명</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseCount;
