import {type TShiftTypeColorStyle, useUIConfigStore} from './store';

const useUIConfigUseCase = () => {
    const setSeparateWeekendColor = useUIConfigStore((state) => state.setSeparateWeekendColor);
    const setShiftTypeColorStyle = useUIConfigStore((state) => state.setShiftTypeColorStyle);

    const handleChangeSeparateWeekendColor = (value: boolean) => {
        setSeparateWeekendColor(value);
    };
    const handleShiftTypeColorStyle = (value: TShiftTypeColorStyle) => {
        setShiftTypeColorStyle(value);
    };

    return {
        handleChangeSeparateWeekendColor,
        handleShiftTypeColorStyle,
    };
};

export default useUIConfigUseCase;
