import {cn} from '@dutying/utils/style';
import {Check, Search} from 'lucide-react';
import {useMemo, useState} from 'react';
import {type TWaitingNurse} from '@/entities/nurse';
import {type TShiftTeam} from '@/entities/ward';
import {PersonIcon} from '@/shared/assets/svg';
import type {TConnectMode} from '../../model/connection-manage';

interface IConnectionManageTargetStepProps {
    currentWaitingNurse: TWaitingNurse | null;
    shiftTeams: TShiftTeam[] | undefined;
    connectMode: TConnectMode;
    toLinkNurseId: number | null;
    toAddShiftTeamId: number | null;
    isNextDisabled: boolean;
    onBack: () => void;
    onNext: () => void;
    onSelectLinkNurse: (nurseId: number) => void;
    onSelectShiftTeam: (shiftTeamId: number) => void;
}

type TLinkFilter = 'all' | `team:${number}`;

const normalizeText = (value?: string | null) => (value ?? '').trim();
const normalizePhone = (value?: string | null) => (value ?? '').replace(/\D/g, '');
const formatPhone = (phone?: string | null) => {
    const normalized = normalizePhone(phone);
    if (normalized.length !== 11) return phone ?? '-';

    return `${normalized.slice(0, 3)}-${normalized.slice(3, 7)}-${normalized.slice(7, 11)}`;
};

function ConnectionManageTargetStep({
    currentWaitingNurse,
    shiftTeams,
    connectMode,
    toLinkNurseId,
    toAddShiftTeamId,
    isNextDisabled,
    onBack,
    onNext,
    onSelectLinkNurse,
    onSelectShiftTeam,
}: IConnectionManageTargetStepProps) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [linkFilter, setLinkFilter] = useState<TLinkFilter>('all');

    const waitingName = normalizeText(currentWaitingNurse?.name);
    const waitingPhone = normalizePhone(currentWaitingNurse?.phoneNum);
    const teamTabs = shiftTeams?.map((team) => ({key: `team:${team.shiftTeamId}` as const, label: team.name, teamId: team.shiftTeamId})) ?? [];
    const modalWidth = useMemo(() => {
        if (connectMode !== 'link') {
            return 620;
        }

        const filterLabels = ['전체', ...teamTabs.map((tab) => tab.label)];
        const chipWidths = filterLabels.reduce((sum, label) => {
            const textWidth = Math.max(52, label.length * 9);

            return sum + textWidth + 28;
        }, 0);
        const gaps = Math.max(0, filterLabels.length - 1) * 8;
        const horizontalPadding = 48;
        const calculated = chipWidths + gaps + horizontalPadding;

        return Math.min(900, Math.max(620, calculated));
    }, [connectMode, teamTabs]);
    const allNurseRows = useMemo(
        () =>
            (shiftTeams ?? []).flatMap((shiftTeam) =>
                shiftTeam.nurses.map((nurse) => ({
                    nurseId: nurse.nurseId,
                    name: nurse.name,
                    phoneNum: nurse.phoneNum,
                    isConnected: nurse.isConnected,
                    shiftTeamId: shiftTeam.shiftTeamId,
                    shiftTeamName: shiftTeam.name,
                })),
            ),
        [shiftTeams],
    );
    const recommendedRows = useMemo(
        () =>
            allNurseRows.filter(
                (row) =>
                    !row.isConnected &&
                    (normalizeText(row.name) === waitingName || (waitingPhone && normalizePhone(row.phoneNum) === waitingPhone)),
            ),
        [allNurseRows, waitingName, waitingPhone],
    );
    const filteredRows = useMemo(() => {
        const keyword = normalizeText(searchKeyword).toLowerCase();
        const keywordDigits = keyword.replace(/\D/g, '');

        const unconnectedRows = allNurseRows.filter((row) => !row.isConnected);
        const recommendedNurseIdSet = new Set(recommendedRows.map((row) => row.nurseId));
        const baseByFilter =
            linkFilter === 'all'
                ? unconnectedRows
                : unconnectedRows.filter((row) => row.shiftTeamId === Number(linkFilter.replace('team:', '')));

        const filteredByKeyword = !keyword
            ? baseByFilter
            : baseByFilter.filter((row) => {
                  const name = normalizeText(row.name).toLowerCase();
                  const phone = normalizePhone(row.phoneNum);

                  return name.includes(keyword) || (keywordDigits ? phone.includes(keywordDigits) : false);
              });

        if (linkFilter !== 'all') {
            return filteredByKeyword;
        }

        return [...filteredByKeyword].sort((a, b) => {
            const aRecommended = recommendedNurseIdSet.has(a.nurseId) ? 0 : 1;
            const bRecommended = recommendedNurseIdSet.has(b.nurseId) ? 0 : 1;

            return aRecommended - bRecommended;
        });
    }, [allNurseRows, linkFilter, recommendedRows, searchKeyword]);

    return (
        <div
            className="w-full rounded-[16px] bg-white px-6 py-5"
            style={{maxWidth: `${modalWidth}px`}}
            onClick={(event) => event.stopPropagation()}
        >
            <div className="flex items-center justify-between">
                <h1 className="font-apple text-[22px] font-semibold text-sub-1">
                    {connectMode === 'link'
                        ? '연결할 기존 간호사를 선택해 주세요'
                        : `${currentWaitingNurse?.name ?? '간호사'}님이 소속될 팀을 선택해 주세요`}
                </h1>
            </div>

            {connectMode === 'link' ? (
                <div className="mt-4">
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#93A0B5]" />
                        <input
                            value={searchKeyword}
                            onChange={(event) => {
                                setSearchKeyword(event.target.value);
                                setLinkFilter('all');
                            }}
                            placeholder="이름 또는 전화번호로 검색"
                            className="h-10 w-full rounded-[10px] border border-[#D9E0EC] bg-white pr-3 pl-9 font-apple text-[14px] text-sub-1 outline-none focus:border-main-2"
                        />
                    </div>

                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setLinkFilter('all')}
                            className={cn(
                                'shrink-0 rounded-full px-3 py-1.5 font-apple text-[13px] font-semibold transition-colors',
                                linkFilter === 'all' ? 'bg-main-1 text-white' : 'bg-[#EEF2F7] text-[#6E7A90]',
                            )}
                        >
                            전체
                        </button>
                        {teamTabs.map((teamTab) => (
                            <button
                                key={teamTab.key}
                                type="button"
                                onClick={() => setLinkFilter(teamTab.key)}
                                className={cn(
                                    'shrink-0 rounded-full px-3 py-1.5 font-apple text-[13px] font-semibold transition-colors',
                                    linkFilter === teamTab.key ? 'bg-main-1 text-white' : 'bg-[#EEF2F7] text-[#6E7A90]',
                                )}
                            >
                                {teamTab.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-3 space-y-2">
                        {filteredRows.length === 0 ? (
                            <div className="rounded-[10px] bg-[#F7F9FC] px-3 py-6 text-center font-apple text-[14px] text-gray-3">
                                {searchKeyword ? '검색어를 바꾸면 간호사를 찾을 수 있어요.' : '팀에 간호사를 추가하면 선택할 수 있어요.'}
                            </div>
                        ) : (
                            filteredRows.map((row) => (
                                <button
                                    key={row.nurseId}
                                    type="button"
                                    className={cn(
                                        'flex h-12 w-full items-center rounded-[10px] px-3 text-left',
                                        toLinkNurseId === row.nurseId ? 'bg-main-light' : 'bg-[#F7F9FC] hover:bg-[#EDF2F9]',
                                    )}
                                    onClick={() => onSelectLinkNurse(row.nurseId)}
                                >
                                    <span className="w-[120px] truncate font-apple text-[14px] font-semibold text-sub-1">{row.name}</span>
                                    <span className="w-[120px] font-poppins text-[13px] text-[#6E7A90]">{formatPhone(row.phoneNum)}</span>
                                    <span className="truncate font-apple text-[13px] text-[#7F8AA0]">{row.shiftTeamName}</span>
                                    {toLinkNurseId === row.nurseId ? <Check className="ml-auto h-4 w-4 text-main-1" strokeWidth={3} /> : null}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {shiftTeams?.map((shiftTeam) => (
                        <button
                            key={shiftTeam.shiftTeamId}
                            type="button"
                            className={cn(
                                'flex items-center rounded-[10px] border px-2 py-3.5 text-left',
                                toAddShiftTeamId === shiftTeam.shiftTeamId
                                    ? 'border-main-1 bg-main-light'
                                    : 'border-[#DDE3EE] bg-white hover:bg-[#F8FAFD]',
                            )}
                            onClick={() => onSelectShiftTeam(shiftTeam.shiftTeamId)}
                        >
                            <p
                                className={cn(
                                    'font-apple text-[15px] font-semibold',
                                    toAddShiftTeamId === shiftTeam.shiftTeamId ? 'text-main-1' : 'text-sub-1',
                                )}
                            >
                                {shiftTeam.name}
                            </p>
                            <span
                                className={cn(
                                    'ml-auto inline-flex items-center gap-1 font-poppins text-[13px] font-semibold',
                                    toAddShiftTeamId === shiftTeam.shiftTeamId ? 'text-main-1' : 'text-[#7F8AA0]',
                                )}
                            >
                                <PersonIcon
                                    className={cn(
                                        'h-[16px] w-[16px]',
                                        toAddShiftTeamId === shiftTeam.shiftTeamId ? 'text-main-1' : 'text-[#7F8AA0]',
                                    )}
                                />
                                {shiftTeam.nurses.length}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <div className="mt-6 flex items-center gap-3">
                <button
                    type="button"
                    className="h-11 w-[34%] rounded-[10px] bg-[#F3F4F6] px-4 font-apple text-[16px] font-semibold text-gray-3 transition-colors hover:bg-[#EAECEF]"
                    onClick={onBack}
                >
                    이전
                </button>
                <button
                    type="button"
                    disabled={isNextDisabled}
                    className="h-11 w-[66%] rounded-[10px] bg-main-1 px-4 font-apple text-[16px] font-semibold text-white transition-colors hover:bg-main-2 disabled:opacity-40"
                    onClick={onNext}
                >
                    완료
                </button>
            </div>
        </div>
    );
}

export default ConnectionManageTargetStep;
