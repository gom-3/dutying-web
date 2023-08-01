import useEditNurse from '@hooks/useEditNurse';
import 'index.css';

interface Props {
  level: number;
}

const width = ['w-[0.375rem]', 'w-[0.9375rem]', 'w-[1.5rem]', 'w-[0.9375rem]'];

const Count = ({ level }: Props) => {
  const {
    state: { nurses },
  } = useEditNurse();

  const dots = (num: number) => {
    return Array.from({ length: num }).map((_, i) => (
      <div key={i} className="h-[0.375rem] w-[0.375rem] rounded-full bg-white" />
    ));
  };

  return (
    nurses && (
      <div className="flex">
        <div className="flex flex-col items-center">
          <div className="mb-[1rem] font-apple text-[1rem] font-medium text-sub-2">전체 인원</div>
          <div className="flex h-[8.125rem] w-[8.125rem] items-center justify-center rounded-[1.25rem] bg-main-1 font-poppins text-[2.5rem] font-medium text-white shadow-shadow-2">
            {nurses?.length}
            <div className="font-apple text-[1rem]">명</div>
          </div>
        </div>
        <div className="ml-[1.25rem] flex flex-col items-center">
          <div className="mb-[1rem] font-apple text-[1rem] font-medium text-sub-2">숙련도별</div>
          <div className="flex h-[8.125rem] w-[22rem] items-center rounded-[1.25rem] bg-main-2 font-poppins text-[2.5rem] font-medium text-white shadow-shadow-2">
            {Array.from({ length: level }).map((_group, i) => {
              return (
                <div
                  key={i}
                  className="relative flex h-[6.125rem] w-[7.3rem] flex-col items-center justify-center border-r-[0.5px] last:border-r-0"
                >
                  <div className={`absolute top-[0.1875rem] flex ${width[i]} justify-between`}>
                    {dots(i + 1)}
                  </div>
                  <div className="ml-[0.2rem] mt-[0.75rem] flex items-center justify-center">
                    {nurses.filter((nurse) => nurse.level === i + 1).length}
                    <div className="font-apple text-[1rem]">명</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
};

export default Count;
