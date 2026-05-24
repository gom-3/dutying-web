import {useState} from 'react';
import {events, sendEvent} from '@/analytics';
import {type TShift, type TWardConstraint, type TShiftTeam} from '@/entities';
import {InfoIcon, NextIcon, PenIcon, PrevIcon} from '@/shared/assets/svg';
import Button from '@/shared/ui/form-controls/Button';
import {ToolbarActionGroup} from './toolbar/toolbar-action-group';
import {ToolbarLayerToggles} from './toolbar/toolbar-layer-toggles';
import {ToolbarSettingsPanel} from './toolbar/toolbar-settings-panel';
import {ToolbarShiftInfoPanel} from './toolbar/toolbar-shift-info-panel';
import {type TLayerFlags, type TToolbarSetupTab} from './types';

interface IToolbarProps {
    year: number;
    month: number;
    shift: TShift | null;
    showLayer: TLayerFlags;
    currentShiftTeam: TShiftTeam | null;
    shiftTeams: TShiftTeam[] | null;
    readonly: boolean;
    saveStatus: 'pending' | 'saved';
    wardConstraint: TWardConstraint | null;
    onChangeMonth: (direction: 'prev' | 'next') => void;
    onToggleLayer: (layer: keyof TLayerFlags) => void;
    onUndo: () => void;
    onRedo: () => void;
    onPostShift: () => void;
    onToggleEditMode: () => void;
    onDownloadExcel: () => void;
    onDownloadImage: () => void;
    onCreateNextMonth: () => void;
    onChangeShiftTeam: (shiftTeamId: number) => void;
    onUpdateConstraint: (constraint: TWardConstraint) => void;
    isDownloadingExcel: boolean;
    isDownloadingImage: boolean;
}

function Toolbar({
    year,
    month,
    shift,
    showLayer,
    currentShiftTeam,
    shiftTeams,
    readonly,
    saveStatus,
    wardConstraint,
    onChangeMonth,
    onToggleLayer,
    onUndo,
    onRedo,
    onPostShift,
    onToggleEditMode,
    onDownloadExcel,
    onDownloadImage,
    onCreateNextMonth,
    onChangeShiftTeam,
    onUpdateConstraint,
    isDownloadingExcel,
    isDownloadingImage,
}: IToolbarProps) {
    const [openInfo, setOpenInfo] = useState(false);
    const [currentSetup, setCurrentSetup] = useState<TToolbarSetupTab | null>(null);

    return (
        <div id="toolbar" className="sticky top-0 z-30 flex h-24.5 w-full items-center bg-[#FDFCFE] pt-7.5 pr-4 pb-[.75rem] pl-5">
            <div className="flex gap-5">
                <div className="w-13.5"></div>
                <div className="w-17.5"></div>
                <div className="w-7.5"></div>
                <div className="w-22.5"></div>
            </div>

            <div className="absolute flex items-center">
                <PrevIcon
                    onClick={() => {
                        onChangeMonth('prev');
                        sendEvent(events.makePage.toolbar.changeMonth);
                    }}
                    className="h-7.5 w-7.5 cursor-pointer"
                />
                <p className="mx-[.625rem] font-poppins text-2xl text-main-1">{month}월</p>
                <NextIcon
                    onClick={() => {
                        onChangeMonth('next');
                        sendEvent(events.makePage.toolbar.changeMonth);
                    }}
                    className="h-7.5 w-7.5 cursor-pointer"
                />
                <p className="ml-5 font-apple text-[.875rem] text-main-1">
                    기본 OFF {shift?.days.filter((x) => x.dayType !== 'workday').length}일
                </p>
            </div>

            {!readonly && (
                <Button
                    variant="outline"
                    className="mr-5 flex h-10 w-31.75 items-center justify-center rounded-[3.125rem] border-[.0313rem] border-main-2 bg-main-4 text-base font-normal"
                    onClick={() => {
                        setCurrentSetup((prev) => (prev ? null : 'constraint'));
                        sendEvent(events.makePage.toolbar.openEditWardModal);
                    }}
                >
                    <PenIcon className="h-6 w-6 stroke-main-1" />
                    설정 편집
                </Button>
            )}

            <ToolbarSettingsPanel
                currentSetup={currentSetup}
                wardConstraint={wardConstraint}
                onSelectSetup={setCurrentSetup}
                onClose={() => setCurrentSetup(null)}
                onUpdateConstraint={onUpdateConstraint}
            />

            <InfoIcon
                className="h-6.5 w-6.5 cursor-pointer text-sub-2.5"
                onClick={() => {
                    setOpenInfo((prev) => !prev);
                    sendEvent(events.makePage.toolbar.openShiftInfoModal);
                }}
            />
            <ToolbarShiftInfoPanel shift={shift} open={openInfo} onClose={() => setOpenInfo(false)} />

            {!readonly && <ToolbarLayerToggles showLayer={showLayer} onToggleLayer={onToggleLayer} />}

            <ToolbarActionGroup
                year={year}
                month={month}
                readonly={readonly}
                saveStatus={saveStatus}
                currentShiftTeam={currentShiftTeam}
                shiftTeams={shiftTeams}
                onUndo={onUndo}
                onRedo={onRedo}
                onPostShift={onPostShift}
                onToggleEditMode={onToggleEditMode}
                onDownloadExcel={onDownloadExcel}
                onDownloadImage={onDownloadImage}
                onCreateNextMonth={onCreateNextMonth}
                onChangeShiftTeam={onChangeShiftTeam}
                isDownloadingExcel={isDownloadingExcel}
                isDownloadingImage={isDownloadingImage}
            />
        </div>
    );
}

export default Toolbar;
