import type React from 'react';
import {events, sendEvent} from '@/analytics';
import {type TWardConstraint} from '@/entities';
import {DUTY_RULE_KEYS, DUTY_RULE_META} from '@/features/shift-editor/model/duty-constraints';
import {ArrowDownIcon} from '@/shared/assets/svg';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import Toggle from '@/shared/ui/Toggle';

const Select = ({
    value,
    onChange,
    options,
}: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> & {
    options: number[];
}) => (
    <div className="relative mx-[.3125rem] h-11 w-16.75">
        <ArrowDownIcon className="absolute top-[50%] right-[.625rem] h-6.25 w-6.25 translate-y-[-50%]" />
        <select
            value={value}
            onChange={onChange}
            className="relative z-10 h-full w-full appearance-none rounded-[.3125rem] bg-transparent px-3.75 text-left font-apple outline-[.0625rem] outline-main-4"
        >
            {options?.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

interface ISetConstraintProps {
    wardConstraint: TWardConstraint;
    onUpdateConstraint: (constraint: TWardConstraint) => void;
}

const SetConstraint = ({wardConstraint, onUpdateConstraint}: ISetConstraintProps) => {
    const {t} = useTypedTranslation();

    return (
        <div className="flex w-145 flex-col font-apple">
            {DUTY_RULE_KEYS.map((key) => {
                const meta = DUTY_RULE_META[key];
                const label = t(meta.labelKey);
                const isActive = Boolean(wardConstraint[meta.booleanField]);
                const value = meta.valueField ? (wardConstraint[meta.valueField] as number) : null;

                return (
                    <div key={key} className="flex h-18.5 items-center border-b-[.0313rem] border-sub-4.5 px-10 last:border-none">
                        <p className="text-[1.25rem] text-sub-1">{label}</p>
                        {meta.valueOptions && meta.valueField && (
                            <div className="ml-2 flex items-center text-[1.25rem] text-main-1">
                                {(meta.kind === 'maxDays' || meta.kind === 'minDays') &&
                                    t(`page.makeShift.constraints.phrase.${meta.kind === 'maxDays' ? 'max' : 'min'}`)}
                                <Select
                                    value={value ?? ''}
                                    options={meta.valueOptions}
                                    onChange={(e) => {
                                        onUpdateConstraint({
                                            ...wardConstraint,
                                            [meta.valueField!]: parseInt(e.target.value),
                                        });
                                        sendEvent(events.makePage.editWardModal.changeConstraintValue, meta.valueField!);
                                    }}
                                    className="w-16.5"
                                />
                                {t('page.makeShift.constraints.phrase.day')}&nbsp;
                                {meta.kind === 'maxDays' && <span className="underline">{t('page.makeShift.constraints.phrase.lte')}</span>}
                                {meta.kind === 'minDays' && <span className="underline">{t('page.makeShift.constraints.phrase.gte')}</span>}
                            </div>
                        )}
                        <div className="ml-auto flex w-30.25 cursor-pointer items-center justify-between">
                            <Toggle
                                isOn={isActive}
                                setIsOn={() => {
                                    onUpdateConstraint({
                                        ...wardConstraint,
                                        [meta.booleanField]: !isActive,
                                    });
                                    sendEvent(events.makePage.editWardModal.changeConstraintActivation);
                                }}
                            />
                            {isActive ? (
                                <p className="flex-1 text-center text-[.75rem] text-sub-3">근무표 적용</p>
                            ) : (
                                <p className="flex-1 text-center text-[.75rem] text-sub-3">근무표 미적용</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SetConstraint;
