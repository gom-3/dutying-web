import {produce} from 'immer';
import {type Dispatch, type SetStateAction} from 'react';
import {Plus} from 'lucide-react';
import {CancelIcon, EnterIcon, XIcon} from '@/shared/assets/svg';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';

interface IRegisterWardShiftTeamsSectionProps {
    shiftTeams: string[][];
    setShiftTeams: Dispatch<SetStateAction<string[][]>>;
}

function RegisterWardShiftTeamsSection({shiftTeams, setShiftTeams}: IRegisterWardShiftTeamsSectionProps) {
    const {t} = useTypedTranslation();
    const appendClipboardTextToNurse = async (index: number) => {
        const nurses = (await navigator.clipboard.readText()).split('\n').map((x) => x.replace(/\r/g, ''));

        setShiftTeams(
            produce(shiftTeams, (draft) => {
                draft[index] = draft[index].concat(nurses);
            }),
        );
    };

    return (
        <div className="mt-5 w-full shrink-0 rounded-[1.25rem] bg-white px-11.25 py-7.5 shadow-banner">
            <div className="mb-6.25 flex items-center">
                <p className="font-apple text-[1.25rem] font-medium text-sub-3">{t('feature.registerWard.shiftTeams.title')}</p>
                <p className="ml-6 font-apple text-[1rem] text-main-2">{t('feature.registerWard.shiftTeams.excludeMe')}</p>
                <div
                    className="ml-auto flex cursor-pointer gap-[.625rem]"
                    onClick={() => {
                        setShiftTeams(
                            produce(shiftTeams, (draft) => {
                                draft.push([]);
                            }),
                        );
                    }}
                >
                    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#CFD6DF] transition-colors group-hover:bg-[#EEF2F6]">
                        <Plus className="h-[12px] w-[12px] text-[#4F5A71]" strokeWidth={3} />
                    </span>
                    <p className="font-apple text-[1rem] font-medium text-main-2">{t('feature.registerWard.shiftTeams.addTeam')}</p>
                </div>
            </div>
            {shiftTeams.map((shiftTeam, index) => (
                <div key={index} className="mt-5">
                    <div className="flex justify-between">
                        <div className="flex">
                            <div className="flex h-9 w-45 items-center justify-center gap-[.75rem] rounded-t-[.625rem] bg-sub-2 font-apple text-white">
                                <p className="text-[1.25rem] font-medium">
                                    {t('feature.registerWard.shiftTeams.teamName', {index: index + 1})}
                                </p>
                                <p className="text-[.875rem]">{t('feature.registerWard.shiftTeams.count', {count: shiftTeam.length})}</p>
                            </div>
                        </div>
                        <CancelIcon
                            className="h-6 w-6 cursor-pointer self-center"
                            onClick={() => {
                                setShiftTeams(
                                    produce(shiftTeams, (draft) => {
                                        draft.splice(index, 1);
                                    }),
                                );
                            }}
                        />
                    </div>
                    <div className="flex w-full flex-wrap gap-[.625rem] rounded-[.625rem] rounded-tl-none border-[.0313rem] border-sub-3 bg-main-bg p-7.5">
                        {shiftTeam.map((name, nameIndex) => (
                            <div
                                key={nameIndex}
                                className="flex h-7 items-center gap-[.25rem] rounded-[.3125rem] border-[.0313rem] border-main-2 bg-main-4 px-[.5rem]"
                            >
                                <p className="font-apple text-[1rem] text-sub-1">{name}</p>
                                <XIcon
                                    className="h-4.5 w-4.5 cursor-pointer"
                                    onClick={() => {
                                        setShiftTeams(
                                            produce(shiftTeams, (draft) => {
                                                draft[index].splice(nameIndex, 1);
                                            }),
                                        );
                                    }}
                                />
                            </div>
                        ))}
                        <p className="flex h-7 w-27 items-center justify-center rounded-[.3125rem] border-[.0625rem] border-main-1 bg-white font-apple text-[1rem] text-sub-1">
                            <input
                                placeholder={t('feature.registerWard.shiftTeams.addNamePlaceholder')}
                                className="w-[70%] focus:outline-none"
                                onKeyDown={(e) => {
                                    if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
                                        e.preventDefault();
                                        appendClipboardTextToNurse(index);

                                        return;
                                    }

                                    if (e.nativeEvent.isComposing) return;

                                    if (e.currentTarget.value === '') return;

                                    if (e.key === 'Enter') {
                                        e.preventDefault();

                                        const value = e.currentTarget.value;

                                        e.currentTarget.value = '';
                                        setShiftTeams(
                                            produce(shiftTeams, (draft) => {
                                                draft[index].push(value);
                                            }),
                                        );
                                    }
                                }}
                            />
                            <EnterIcon className="h-6 w-6" />
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RegisterWardShiftTeamsSection;


