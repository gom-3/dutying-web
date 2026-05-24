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
            className={cn('relative h-4 w-7.5 rounded-2xl transition-[0.8s]', isOn ? 'bg-main-1' : 'bg-sub-4')}
        />
    );
};

export default Toggle;
