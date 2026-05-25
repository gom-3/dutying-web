import {cn} from '@dutying/utils/style';
import {Switch} from '@/shared/ui/primitives/switch';

interface IToggleProps {
    isOn: boolean;
    setIsOn: (isOn: boolean) => void;
}

const Toggle = ({isOn, setIsOn}: IToggleProps) => {
    return (
        <Switch
            data-testid="toggle"
            checked={isOn}
            onCheckedChange={(checked) => setIsOn(checked)}
            className={cn(
                'relative h-5 w-9 justify-start border-0 p-0 shadow-none transition-colors data-[state=checked]:bg-main-1 data-[state=unchecked]:bg-sub-4',
                isOn ? 'bg-main-1' : 'bg-sub-4',
            )}
            thumbClassName="absolute top-0.5 left-0.5 h-4 w-4 translate-x-0 bg-white shadow-sm data-[state=checked]:translate-x-4"
        />
    );
};

export default Toggle;
