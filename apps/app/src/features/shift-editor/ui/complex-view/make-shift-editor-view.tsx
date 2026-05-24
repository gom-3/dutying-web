import {type ComponentProps, useRef} from 'react';
import {type TShift} from '@/entities';
import {type TDutyDoc, useShiftExcelExport, useShiftImageExport} from '@/features/shift-editor/model';
import NurseEditModal from './nurse-edit-modal';
import type ShiftCalendar from './shift-calendar';
import {ShiftEditorCanvas} from './shift-editor-canvas';
import Toolbar from './toolbar';

interface IMakeShiftEditorViewProps {
    shift: TShift;
    doc: TDutyDoc;
    readonly?: boolean;
    showToolbar?: boolean;
    showCalendar?: boolean;
    showCountByDay?: boolean;
    showNurseEditModal?: boolean;
    className?: string;
    calendarProps?: Omit<ComponentProps<typeof ShiftCalendar>, 'shift' | 'doc' | 'showCountByDay'>;
    toolbarProps?: Omit<
        ComponentProps<typeof Toolbar>,
        'shift' | 'onDownloadImage' | 'isDownloadingImage' | 'onDownloadExcel' | 'isDownloadingExcel'
    >;
}

export const MakeShiftEditorView = ({
    shift,
    doc,
    showToolbar = true,
    showCalendar = true,
    showCountByDay = true,
    showNurseEditModal = true,
    className,
    calendarProps,
    toolbarProps,
}: IMakeShiftEditorViewProps) => {
    const exportRef = useRef<HTMLDivElement>(null);
    const {isExporting, downloadImage} = useShiftImageExport({
        targetRef: exportRef,
        year: toolbarProps?.year ?? new Date().getFullYear(),
        month: toolbarProps?.month ?? 1,
        teamName: toolbarProps?.currentShiftTeam?.name ?? null,
        disabled: !shift,
    });
    const {isExporting: isExportingExcel, exportExcel} = useShiftExcelExport({
        month: toolbarProps?.month ?? 1,
        shift,
        disabled: !shift,
    });

    return (
        <div className={`mx-auto flex w-fit flex-col ${className ?? ''}`}>
            {showToolbar && toolbarProps && (
                <Toolbar
                    shift={shift}
                    isDownloadingExcel={isExportingExcel}
                    isDownloadingImage={isExporting}
                    onDownloadExcel={() => void exportExcel()}
                    onDownloadImage={() => void downloadImage()}
                    {...toolbarProps}
                />
            )}
            {showCalendar && (
                <ShiftEditorCanvas
                    shift={shift}
                    doc={doc}
                    showCountByDay={showCountByDay}
                    exportMode={isExporting}
                    exportRef={exportRef}
                    calendarProps={calendarProps}
                />
            )}
            {showNurseEditModal && <NurseEditModal />}
        </div>
    );
};
