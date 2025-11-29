import React from 'react';
import {match} from 'ts-pattern';
import {ArrowDownIcon} from '@/assets/svg';
import Toggle from '@/components/Toggle';
import useEditShift from '@/hooks/shift/useEditShift';
import {events, sendEvent} from 'analytics';

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
            className="relative z-10 h-full w-full appearance-none rounded-[.3125rem] bg-transparent px-3.75 text-left font-apple outline outline-[.0625rem] outline-main-4"
        >
            {options?.map((option, _) => (
                <option key={_} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);
const SetConstraint = () => {
    const {
        state: {wardConstraint, checkFaultOptions},
        actions: {updateConstraint},
    } = useEditShift();

    return (
        checkFaultOptions &&
        wardConstraint && (
            <div className="flex w-145 flex-col font-apple">
                {Object.entries(checkFaultOptions).map(([key, {label, value, isActive}]) => (
                    <div key={key} className="flex h-18.5 items-center border-b-[.0313rem] border-sub-4.5 px-10 last:border-none">
                        <p className="text-[1.25rem] text-sub-1">{label}</p>
                        {match(key)
                            .with('maxContinuousWork', () => (
                                <div className="ml-2 flex items-center text-[1.25rem] text-main-1">
                                    최대
                                    <Select
                                        value={value!}
                                        options={[3, 4, 5, 6]}
                                        onChange={(e) => {
                                            updateConstraint({
                                                ...wardConstraint,
                                                maxContinuousWorkVal: parseInt(e.target.value),
                                            });
                                            sendEvent(events.makePage.editWardModal.changeConstraintValue, 'maxContinuousWorkVal');
                                        }}
                                        className="w-16.5"
                                    />
                                    일&nbsp;
                                    <span className="underline">이하</span>
                                </div>
                            ))
                            .with('maxContinuousNight', () => (
                                <div className="ml-2 flex items-center text-[1.25rem] text-main-1">
                                    최대
                                    <Select
                                        value={value!}
                                        options={[3, 4, 5]}
                                        onChange={(e) => {
                                            updateConstraint({
                                                ...wardConstraint,
                                                maxContinuousNightVal: parseInt(e.target.value),
                                            });
                                            sendEvent(events.makePage.editWardModal.changeConstraintValue, 'maxContinuousNightVal');
                                        }}
                                        className="w-16.5"
                                    />
                                    일&nbsp;
                                    <span className="underline">이하</span>
                                </div>
                            ))
                            .with('minContinuousNight', () => (
                                <div className="ml-2 flex items-center text-[1.25rem] text-main-1">
                                    최소
                                    <Select
                                        value={value!}
                                        options={[2, 3, 4, 5]}
                                        onChange={(e) => {
                                            updateConstraint({
                                                ...wardConstraint,
                                                minContinuousNightVal: parseInt(e.target.value),
                                            });
                                            sendEvent(events.makePage.editWardModal.changeConstraintValue, 'minContinuousNightVal');
                                        }}
                                        className="w-16.5"
                                    />
                                    일&nbsp;
                                    <span className="underline">이상</span>
                                </div>
                            ))
                            .with('minNightInterval', () => (
                                <div className="ml-2 flex items-center text-[1.25rem] text-main-1">
                                    최소
                                    <Select
                                        value={value!}
                                        options={[3, 4, 5, 6, 7]}
                                        onChange={(e) => {
                                            updateConstraint({
                                                ...wardConstraint,
                                                minNightIntervalVal: parseInt(e.target.value),
                                            });
                                            sendEvent(events.makePage.editWardModal.changeConstraintValue, 'minNightIntervalVal');
                                        }}
                                        className="w-16.5"
                                    />
                                    일&nbsp;
                                    <span className="underline">이상</span>
                                </div>
                            ))
                            .with('minOffAssignAfterNight', () => (
                                <div className="ml-2 flex items-center text-[1.25rem] text-main-1">
                                    <Select
                                        value={value!}
                                        options={[2, 3]}
                                        onChange={(e) => {
                                            updateConstraint({
                                                ...wardConstraint,
                                                minOffAssignAfterNightVal: parseInt(e.target.value),
                                            });
                                            sendEvent(events.makePage.editWardModal.changeConstraintValue, 'minOffAssignAfterNightVal');
                                        }}
                                        className="w-16.5"
                                    />
                                    일&nbsp;
                                </div>
                            ))
                            .otherwise(() => null)}
                        <div className="ml-auto flex w-30.25 cursor-pointer items-center justify-between">
                            <Toggle
                                isOn={isActive}
                                setIsOn={() => {
                                    updateConstraint({
                                        ...wardConstraint,
                                        [key]: isActive ? false : true,
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
                ))}
            </div>
        )
    );
};

export default SetConstraint;
