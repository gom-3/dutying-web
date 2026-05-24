import {events, sendEvent} from '@/analytics';
import {FaultDotIcon, RequestCheckIcon, RequestSlashIcon} from '@/shared/assets/svg';
import {type TLayerFlags} from '../types';

type TToolbarLayerTogglesProps = {
    showLayer: TLayerFlags;
    onToggleLayer: (layer: keyof TLayerFlags) => void;
};

const layerConfigs = [
    {
        key: 'fault',
        label: '잘못된 근무',
        borderClassName: 'border-[#FF0000]',
        backgroundClassName: 'bg-[#ff000033]',
        Icon: FaultDotIcon,
    },
    {
        key: 'check',
        label: '신청 근무 반영',
        borderClassName: 'border-[#06E738]',
        backgroundClassName: 'bg-[#06e73833]',
        Icon: RequestCheckIcon,
    },
    {
        key: 'slash',
        label: '신청 근무 미반영',
        borderClassName: 'border-[#0027F4]',
        backgroundClassName: 'bg-[#0027f433]',
        Icon: RequestSlashIcon,
    },
] as const;

export function ToolbarLayerToggles({showLayer, onToggleLayer}: TToolbarLayerTogglesProps) {
    return (
        <div className="ml-12.5 flex gap-[.25rem]">
            {layerConfigs.map(({key, label, borderClassName, backgroundClassName, Icon}) => (
                <div
                    key={key}
                    className={`flex h-9 cursor-pointer items-center gap-[.5rem] rounded-[.3125rem] border-[.0313rem] border-sub-4 px-[.625rem] ${
                        showLayer[key] ? 'white' : 'bg-sub-5'
                    }`}
                    onClick={() => {
                        onToggleLayer(key);
                        sendEvent(showLayer[key] ? events.makePage.toolbar.offLayer : events.makePage.toolbar.onLayer, key);
                    }}
                >
                    <div
                        className={`relative h-[.875rem] w-[.875rem] rounded-[.1875rem] border-[.0806rem] ${borderClassName} ${backgroundClassName}`}
                    >
                        <Icon className="absolute -top-2 -right-0.75 h-[.4rem] w-[.4rem]" />
                    </div>
                    <p className={`font-apple text-[.75rem] select-none ${showLayer[key] ? 'text-sub-2' : 'text-sub-3'}`}>{label}</p>
                </div>
            ))}
        </div>
    );
}
