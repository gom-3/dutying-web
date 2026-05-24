import {useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {events, sendEvent} from '@/analytics';
import {type TShift} from '@/entities';
import {useScheduleDisplayViolations, useShiftEditorStore} from '@/features/shift-editor/model';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';

interface IPanelProps {
    shift: TShift;
    readonly?: boolean;
}

function getHistoryLabel(
    t: ReturnType<typeof useTypedTranslation>['t'],
    index: number,
    source: 'user' | 'ai' | 'system',
    changedCellCount: number,
    changedRows: boolean,
) {
    if (changedRows) return `${index + 1}. ${t('feature.shiftEditor.panel.history.reordered')}`;

    if (changedCellCount > 0) {
        const sourceText =
            source === 'ai'
                ? t('feature.shiftEditor.panel.history.sourceAi')
                : source === 'system'
                  ? t('feature.shiftEditor.panel.history.sourceSystem')
                  : t('feature.shiftEditor.panel.history.sourceUser');

        return `${index + 1}. ${t('feature.shiftEditor.panel.history.editedCells', {source: sourceText, count: changedCellCount})}`;
    }

    return `${index + 1}. ${t('feature.shiftEditor.panel.history.defaultLabel')}`;
}

/**
 * @deprecated 근무표 작성 기능 개편 중으로 인해 deprecated 예정
 */
function Panel({shift, readonly = false}: IPanelProps) {
    const {t} = useTypedTranslation();
    const violations = useScheduleDisplayViolations();
    const history = useShiftEditorStore((s) => s.history);
    const [open, setOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState('histories');
    const historyEntries = history.past.slice().reverse();

    return !readonly ? (
        <div
            className={twMerge(
                'flex flex-col rounded-[1.25rem] bg-white shadow-banner',
                open && 'absolute right-5 bottom-5 h-[300%] max-h-[50vh]',
            )}
            style={{
                width: `${(shift.wardShiftTypes.filter((x) => x.isCounted).length + 1) * 2 + 1.25 + 1.25}rem`,
            }}
        >
            <div className="flex h-10 w-full border-b-[.0313rem] border-sub-4 font-apple text-base font-medium">
                <div
                    className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-tl-[1.25rem] border-r-[.0313rem] border-sub-4 ${currentTab === 'histories' ? 'bg-main-4 text-sub-1' : 'bg-sub-5 text-sub-2.5'}`}
                    onClick={() => {
                        setCurrentTab('histories');
                        sendEvent(events.makePage.panel.changePanelTab, 'histories');
                    }}
                >
                    {t('feature.shiftEditor.panel.histories')}
                </div>
                <div
                    className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-tr-[1.25rem] ${currentTab === 'faults' ? 'bg-main-4 text-sub-1' : 'bg-sub-5 text-sub-2.5'}`}
                    onClick={() => {
                        setCurrentTab('faults');
                        sendEvent(events.makePage.panel.changePanelTab, 'faults');
                    }}
                >
                    <p className="relative">
                        {t('feature.shiftEditor.panel.faults')}
                        <span className="absolute top-0 right-0 flex h-[.875rem] w-[.875rem] translate-x-full items-center justify-center rounded-full bg-main-2 font-apple text-[.625rem] text-white">
                            {violations.length}
                        </span>
                    </p>
                </div>
            </div>
            <div className="scrollbar-hide flex flex-1 flex-col overflow-y-scroll">
                {currentTab === 'histories' ? (
                    historyEntries.length > 0 ? (
                        historyEntries.map((entry, index) => {
                            const changedCellCount = entry.tx.ops.reduce(
                                (count, op) => (op.kind === 'setCells' ? count + op.cells.length : count),
                                0,
                            );
                            const changedRows = entry.tx.ops.some((op) => op.kind === 'reorderRows');

                            return (
                                <p
                                    key={`${entry.tx.timestamp}-${index}`}
                                    className="cursor-default border-b-[.0313rem] border-sub-4 px-[.8125rem] py-[.625rem] font-apple text-[.75rem] text-sub-2 last:border-none"
                                >
                                    {getHistoryLabel(t, index, entry.tx.source, changedCellCount, changedRows)}
                                </p>
                            );
                        })
                    ) : (
                        <p className="px-[.8125rem] py-[.625rem] font-apple text-[.75rem] text-sub-3">
                            {t('feature.shiftEditor.panel.history.empty')}
                        </p>
                    )
                ) : violations.length > 0 ? (
                    violations.map((violation, index) => (
                        <p
                            key={index}
                            className="cursor-pointer border-b-[.0313rem] border-sub-4 px-[.8125rem] py-[.625rem] font-apple text-[.75rem] text-sub-2 last:border-none"
                        >
                            {violation.message}
                        </p>
                    ))
                ) : (
                    <p className="px-[.8125rem] py-[.625rem] font-apple text-[.75rem] text-sub-3">
                        {t('feature.shiftEditor.panel.faultsEmpty')}
                    </p>
                )}
            </div>
            <div
                className="flex h-7.5 w-full cursor-pointer items-center justify-center font-apple text-[.625rem] text-main-3"
                onClick={() => {
                    setOpen(!open);
                    sendEvent(open ? events.makePage.panel.foldPanel : events.makePage.panel.spreadPanel);
                }}
            >
                {open ? t('feature.shiftEditor.panel.fold') : t('feature.shiftEditor.panel.expand')}
            </div>
        </div>
    ) : null;
}

export default Panel;
