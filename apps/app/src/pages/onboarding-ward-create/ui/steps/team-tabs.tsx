import {cn} from '@dutying/utils/style';
import {Plus} from 'lucide-react';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {PersonIcon} from '@/shared/assets/svg';
import type {TOnboardingNurseDraft, TOnboardingTeamDraft} from '../../model';

interface ITeamTabsProps {
    teams: TOnboardingTeamDraft[];
    nurses: TOnboardingNurseDraft[];
    currentTeamId: string;
    onSelect: (teamId: string) => void;
    onAdd: () => void;
    onRename: (teamId: string, teamName: string) => void;
    canAdd: boolean;
}

const TEAM_NAME_MAX_LENGTH = 12;

function TeamTabs({teams, nurses, currentTeamId, onSelect, onAdd, onRename, canAdd}: ITeamTabsProps) {
    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
    const [editingTeamName, setEditingTeamName] = useState('');
    const [activeIndicatorStyle, setActiveIndicatorStyle] = useState<{left: number; width: number} | null>(null);
    const tabListRef = useRef<HTMLDivElement | null>(null);
    const teamNameInputRef = useRef<HTMLInputElement | null>(null);
    const tabButtonRefByTeamId = useRef<Record<string, HTMLButtonElement | null>>({});

    useEffect(() => {
        if (!editingTeamId) {
            return;
        }

        const timer = setTimeout(() => {
            teamNameInputRef.current?.focus();
            teamNameInputRef.current?.select();
        }, 0);

        return () => clearTimeout(timer);
    }, [editingTeamId]);

    useLayoutEffect(() => {
        const containerElement = tabListRef.current;
        const activeButtonElement = tabButtonRefByTeamId.current[currentTeamId];

        if (!containerElement || !activeButtonElement) {
            setActiveIndicatorStyle(null);

            return;
        }

        const containerRect = containerElement.getBoundingClientRect();
        const activeRect = activeButtonElement.getBoundingClientRect();

        setActiveIndicatorStyle({
            left: activeRect.left - containerRect.left,
            width: activeRect.width,
        });
    }, [currentTeamId, teams, nurses, editingTeamId, editingTeamName]);

    return (
        <div className="flex h-[44px] items-center rounded-[12px] border border-[#4F5A71] bg-[#3D4658] px-2 py-1">
            <div ref={tabListRef} className="relative flex flex-1 items-center justify-start gap-1">
                {activeIndicatorStyle ? (
                    <span
                        className="pointer-events-none absolute top-1/2 z-0 h-[33px] rounded-[10px] bg-white transition-all duration-250 ease-out"
                        style={{
                            width: activeIndicatorStyle.width,
                            transform: `translate(${activeIndicatorStyle.left}px, -50%)`,
                        }}
                    />
                ) : null}
                {teams.map((team) => {
                    const count = nurses.filter((nurse) => nurse.teamId === team.id).length;
                    const isActive = team.id === currentTeamId;
                    const isEditing = editingTeamId === team.id;

                    return (
                        <button
                            key={team.id}
                            type="button"
                            ref={(element) => {
                                tabButtonRefByTeamId.current[team.id] = element;
                            }}
                            aria-pressed={isActive}
                            className={cn(
                                'relative z-10 flex h-[33px] shrink-0 items-center justify-center gap-1 rounded-[10px] px-3.5 font-apple text-[14px] leading-none font-semibold transition-[color,opacity] duration-200',
                                isActive ? 'text-[#111827]' : 'text-[#AEB7C7] hover:text-[#D2D9E5]',
                            )}
                            onClick={() => {
                                if (!isActive) {
                                    setEditingTeamId(null);
                                    onSelect(team.id);

                                    return;
                                }

                                if (isEditing) {
                                    return;
                                }

                                setEditingTeamId(team.id);
                                setEditingTeamName(team.name);
                            }}
                        >
                            {isEditing ? (
                                <input
                                    ref={teamNameInputRef}
                                    value={editingTeamName}
                                    maxLength={TEAM_NAME_MAX_LENGTH}
                                    className="border-0 bg-transparent text-center font-apple text-[14px] font-semibold text-[#111827] outline-none"
                                    style={{width: `${Math.max(6, Math.min(18, editingTeamName.length + 1))}ch`}}
                                    onChange={(event) => setEditingTeamName(event.target.value)}
                                    onClick={(event) => event.stopPropagation()}
                                    onBlur={() => {
                                        const nextName = editingTeamName.trim();
                                        const isDuplicate = teams.some(
                                            (candidate) => candidate.id !== team.id && candidate.name.trim() === nextName,
                                        );

                                        if (nextName && !isDuplicate) {
                                            onRename(team.id, nextName);
                                        }

                                        setEditingTeamId(null);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Escape') {
                                            setEditingTeamId(null);
                                        }

                                        if (event.key === 'Enter') {
                                            const nextName = editingTeamName.trim();
                                            const isDuplicate = teams.some(
                                                (candidate) => candidate.id !== team.id && candidate.name.trim() === nextName,
                                            );

                                            if (nextName && !isDuplicate) {
                                                onRename(team.id, nextName);
                                            }

                                            setEditingTeamId(null);
                                        }
                                    }}
                                />
                            ) : (
                                <span>{team.name}</span>
                            )}
                            {isActive && !isEditing ? (
                                <span className="flex items-center gap-1 font-poppins text-[14px] font-semibold">
                                    <PersonIcon className="h-[18px] w-[18px] text-[#37404F]" />
                                    {count}
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </div>
            <button
                type="button"
                className={cn(
                    'group ml-2 shrink-0 rounded-[8px] px-2 py-1 font-apple text-[14px] font-medium text-[#D2D9E5] transition-colors hover:text-white',
                    !canAdd && 'opacity-70',
                )}
                onClick={onAdd}
            >
                <span className="inline-flex items-center gap-2">
                    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#CFD6DF] transition-colors group-hover:bg-[#EEF2F6]">
                        <Plus className="h-[12px] w-[12px] text-[#4F5A71]" strokeWidth={3} />
                    </span>
                    팀 추가하기
                </span>
            </button>
        </div>
    );
}

export default TeamTabs;



