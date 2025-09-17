import { useUIConfigStore } from './store';

const useUIConfig = () => {
  const { separateWeekendColor, shiftTypeColorStyle, setState } = useUIConfigStore();
  const handleChangeSeparateWeekendColor = (value: boolean) => {
    setState('separateWeekendColor', value);
  };
  const handleShiftTypeColorStyle = (value: typeof shiftTypeColorStyle) => {
    setState('shiftTypeColorStyle', value);
  };

  return {
    state: {
      separateWeekendColor,
      shiftTypeColorStyle,
    },
    actions: {
      handleChangeSeparateWeekendColor,
      handleShiftTypeColorStyle,
    },
  };
};

export default useUIConfig;
