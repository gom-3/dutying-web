import { shallow } from 'zustand/shallow';
import { useUIConfigStore } from './store';

const useUIConfig = () => {
  const [separateWeekendColor, shiftTypeColorStyle, shiftTypeRadiusStyle, setState] =
    useUIConfigStore(
      (state) => [
        state.separateWeekendColor,
        state.shiftTypeColorStyle,
        state.shiftTypeRadiusStyle,
        state.setState,
      ],
      shallow
    );

  const handleChangeSeparateWeekendColor = (value: boolean) => {
    setState('separateWeekendColor', value);
  };

  const handleShiftTypeColorStyle = (value: typeof shiftTypeColorStyle) => {
    setState('shiftTypeColorStyle', value);
  };

  const handleShiftTypeRadiusStyle = (value: number) => {
    setState('shiftTypeRadiusStyle', value);
  };

  return {
    state: {
      separateWeekendColor,
      shiftTypeColorStyle,
      shiftTypeRadiusStyle,
    },
    actions: {
      handleChangeSeparateWeekendColor,
      handleShiftTypeColorStyle,
      handleShiftTypeRadiusStyle,
    },
  };
};

export default useUIConfig;
