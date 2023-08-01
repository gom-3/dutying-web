import useEditNurse from '@hooks/useEditNurse';

interface Props {
  devide: number;
}

const LevelSelect = ({ devide }: Props) => {
  const {
    state: { selectedNurse },
    actions: { updateNurse },
  } = useEditNurse();
  const width = ['', '', 'w-[12.1875rem]', 'w-[16.875rem]', 'w-[21.5625rem]'];

  const handleOnClick = (i: number) => {
    if (!selectedNurse) return;
    updateNurse({ ...selectedNurse, level: i });
  };

  return (
    selectedNurse && (
      <div className={`flex ${width[devide - 1]} mt-4 justify-between`}>
        {Array.from({ length: devide }).map((_option, i) => {
          return (
            <div
              key={i}
              className={`flex h-[2.8125rem] w-[2.8125rem] cursor-pointer items-center justify-center rounded-[0.3125rem] font-poppins text-[1.25rem] ${
                selectedNurse.level === devide - i
                  ? 'bg-main-2 text-white'
                  : 'border border-sub-3 text-sub-3'
              }`}
              onClick={() => handleOnClick(devide - i)}
            >
              {devide - i}
            </div>
          );
        })}
      </div>
    )
  );
};

export default LevelSelect;
