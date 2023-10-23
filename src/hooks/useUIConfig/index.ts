import { shallow } from 'zustand/shallow';
import { useUIConfigStore } from './store';

const useUIConfig = () => {
  const [separateWeekendColor, shiftTypeColorStyle, setState] = useUIConfigStore(
    (state) => [state.separateWeekendColor, state.shiftTypeColorStyle, state.setState],
    shallow
  );

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
