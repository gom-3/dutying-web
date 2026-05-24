import {DragDropContext, Draggable, Droppable, type DraggableProvidedDragHandleProps, type DropResult} from '@hello-pangea/dnd';
import {useQuery} from '@tanstack/react-query';
import {ChevronDown, Loader2, Plus, RotateCcw, X} from 'lucide-react';
import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import toast from 'react-hot-toast';
import {wardQueryOptions} from '@/entities/ward/model/queries';
import useAuthStore from '@/features/auth/model/store';
import {DEFAULT_SKILL_LEVEL_CONFIG, getWardSkillSettings} from '@/features/ward-skill/model/skill-level';
import {SixDotsIcon} from '@/shared/assets/svg';
import {useMakeShiftStore} from '../../model/make-shift-store';
import {
    getShiftConstraintRuleCandidates,
    getShiftConstraintRules,
    shiftConstraintRuleQueryKeys,
    type TShiftConstraintOption,
    type TShiftConstraintOptions,
    type TShiftConstraintRuleDraft,
    type TShiftConstraintSlot,
    type TShiftConstraintTemplate,
} from '../../model/shift-constraint-rules';

type TSelectOption = {value: string; label: string; kind?: 'duty'; shortName?: string; name?: string; color?: string};
type TTemplateCategory = 'STAFFING' | 'FORBIDDEN' | 'WORK_REST' | 'PERSONAL' | 'SKILL' | 'COMBINATION';
type TControlDef = {
    key: string;
    kind: 'select' | 'number';
    optionsKey?: string;
    min?: number;
    max?: number;
    values?: number[];
    prefix?: string;
    suffix?: string;
};
type TModalCategory = TTemplateCategory | 'IMPORTANT';
type TSentencePart =
    | {type: 'text'; text: string}
    | {type: 'duty'; code: string}
    | {type: 'dutyPattern'; codes: string[]}
    | {type: 'control'; key: string}
    | {type: 'particle'; key: string; withBatchim: string; withoutBatchim: string};
type TSoftRuleTemplate = {
    id: string;
    category: TTemplateCategory;
    label: string;
    controls: TControlDef[];
    sentence: TSentencePart[];
    buildText: (params: Record<string, string>) => string;
};

type TShiftTypeLike = {wardShiftTypeId?: number; shortName?: string; name?: string; color?: string; isOff?: boolean; classification?: string};
type TNurseLike = {nurseId?: number; name?: string; isPreceptor?: boolean};

const CATEGORY_LABEL: Record<TTemplateCategory, string> = {
    STAFFING: '인원수',
    FORBIDDEN: '금지 패턴',
    WORK_REST: '연속 근무/휴식',
    PERSONAL: '사람별 제한',
    SKILL: '숙련도',
    COMBINATION: '근무자 조합',
};

const MODAL_CATEGORY_LABEL: Record<TModalCategory, string> = {
    IMPORTANT: '주요',
    ...CATEGORY_LABEL,
};

function resolveDutyStyle(optionOrCode: TSelectOption) {
    const code = optionOrCode.shortName ?? optionOrCode.label.split(' ')[0] ?? '';
    return {
        code,
        name: optionOrCode.name ?? optionOrCode.label,
        color: optionOrCode.color ?? '#8A94A6',
    };
}

function DutyTypeBadge({option}: {option: TSelectOption}) {
    const style = resolveDutyStyle(option);

    return (
        <span
            className="inline-flex h-7 shrink-0 items-center gap-1 rounded-[8px] px-2.5 font-apple text-[13px] font-bold text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)]"
            style={{backgroundColor: style.color}}
        >
            <span className="text-[14px] font-semibold">{style.code}</span>
            <span className="text-[12px] font-medium opacity-90">{style.name}</span>
        </span>
    );
}

function DutyPatternBadge({options}: {options: TSelectOption[]}) {
    if (!options.length) return null;

    return (
        <span className="inline-flex h-8 shrink-0 items-center overflow-hidden rounded-[9px] bg-gray-7 ring-1 ring-gray-6">
            {options.map((option, index) => {
                const style = resolveDutyStyle(option);

                return (
                    <span key={`${option.value}-${index}`} className="inline-flex h-full items-center">
                        {index > 0 ? <span className="px-1 font-apple text-[13px] font-bold text-gray-4">-</span> : null}
                        <span
                            className="inline-flex h-7 items-center gap-1 rounded-[8px] px-2 font-apple text-white"
                            style={{backgroundColor: style.color}}
                        >
                            <span className="text-[14px] font-semibold">{style.code}</span>
                            <span className="text-[12px] font-medium opacity-90">{style.name}</span>
                        </span>
                    </span>
                );
            })}
        </span>
    );
}

const IMPORTANT_DEFAULT_RULE_IDS = new Set([
    'IMPORTANT_MAX_WORK_STREAK',
    'IMPORTANT_MAX_SAME_DUTY_STREAK',
    'IMPORTANT_MIN_NIGHT_INTERVAL',
    'IMPORTANT_MAX_NIGHT_STREAK',
    'IMPORTANT_OFF_AFTER_NIGHT',
    'IMPORTANT_NO_NIGHT_BEFORE_REQUEST_OFF',
    'IMPORTANT_FORBIDDEN_DUTY_PATTERNS',
]);

function hasFinalConsonant(value: string) {
    const trimmed = value.trim();
    const lastChar = trimmed.charAt(trimmed.length - 1);
    if (!lastChar) return false;

    const code = lastChar.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) return false;

    return (code - 0xac00) % 28 !== 0;
}

function withParticle(value: string, withBatchim: string, withoutBatchim: string) {
    return `${value}${hasFinalConsonant(value) ? withBatchim : withoutBatchim}`;
}

const SOFT_RULE_TEMPLATES: TSoftRuleTemplate[] = [
    {
        id: 'IMPORTANT_MAX_WORK_STREAK',
        category: 'WORK_REST',
        label: '중요 기본 조건',
        controls: [{key: 'days', kind: 'number', values: [3, 4, 5, 6], suffix: '일'}],
        sentence: [
            {type: 'text', text: '연속 근무는 '},
            {type: 'control', key: 'days'},
            {type: 'text', text: '일까지 할 수 있어요'},
        ],
        buildText: (p) => `연속 근무는 ${p.days}일까지 할 수 있어요`,
    },
    {
        id: 'IMPORTANT_MAX_SAME_DUTY_STREAK',
        category: 'WORK_REST',
        label: '중요 기본 조건',
        controls: [{key: 'days', kind: 'number', values: [3, 4, 5, 6], suffix: '일'}],
        sentence: [
            {type: 'text', text: '같은 근무를 연속으로 '},
            {type: 'control', key: 'days'},
            {type: 'text', text: '일까지 할 수 있어요'},
        ],
        buildText: (p) => `같은 근무는 연속으로 ${p.days}일까지 할 수 있어요`,
    },
    {
        id: 'IMPORTANT_MIN_NIGHT_INTERVAL',
        category: 'WORK_REST',
        label: '중요 기본 조건',
        controls: [{key: 'days', kind: 'number', min: 3, max: 7, suffix: '일'}],
        sentence: [
            {type: 'duty', code: 'N'},
            {type: 'text', text: ' 근무는 '},
            {type: 'control', key: 'days'},
            {type: 'text', text: '일 이상 간격을 두어야 해요'},
        ],
        buildText: (p) => `N 근무는 ${p.days}일 이상 간격을 두어야 해요`,
    },
    {
        id: 'IMPORTANT_MAX_NIGHT_STREAK',
        category: 'WORK_REST',
        label: '중요 기본 조건',
        controls: [{key: 'days', kind: 'number', values: [2, 3, 4, 5, 7], suffix: '일'}],
        sentence: [
            {type: 'duty', code: 'N'},
            {type: 'text', text: ' 근무를 '},
            {type: 'control', key: 'days'},
            {type: 'text', text: '일까지 연속으로 할 수 있어요'},
        ],
        buildText: (p) => `N 근무는 ${p.days}일까지 연속으로 할 수 있어요`,
    },
    {
        id: 'IMPORTANT_OFF_AFTER_NIGHT',
        category: 'WORK_REST',
        label: '중요 기본 조건',
        controls: [{key: 'days', kind: 'number', min: 1, max: 5, suffix: '일'}],
        sentence: [
            {type: 'duty', code: 'N'},
            {type: 'text', text: ' 근무 후에는 '},
            {type: 'control', key: 'days'},
            {type: 'text', text: '일 이상 쉬어야('},
            {type: 'duty', code: 'OFF'},
            {type: 'text', text: ') 해요'},
        ],
        buildText: (p) => `나이트 근무 후에는 ${p.days}일 이상 쉬어야(OFF) 해요`,
    },
    {
        id: 'IMPORTANT_NO_NIGHT_BEFORE_REQUEST_OFF',
        category: 'FORBIDDEN',
        label: '중요 기본 조건',
        controls: [],
        sentence: [
            {type: 'text', text: '신청 '},
            {type: 'duty', code: 'OFF'},
            {type: 'text', text: ' 전날에는 '},
            {type: 'duty', code: 'N'},
            {type: 'text', text: ' 근무를 피해요'},
        ],
        buildText: () => '신청 오프 전날에는 나이트 근무를 피해요',
    },
    {
        id: 'IMPORTANT_FORBIDDEN_DUTY_PATTERNS',
        category: 'FORBIDDEN',
        label: '중요 기본 조건',
        controls: [],
        sentence: [
            {type: 'dutyPattern', codes: ['N', 'D']},
            {type: 'text', text: ' / '},
            {type: 'dutyPattern', codes: ['E', 'D']},
            {type: 'text', text: ' / '},
            {type: 'dutyPattern', codes: ['N', 'E']},
            {type: 'text', text: ' / '},
            {type: 'dutyPattern', codes: ['N', 'OFF', 'D']},
            {type: 'text', text: ' 근무 패턴은 피해요'},
        ],
        buildText: () => 'ND / ED / NE / NOD 근무 패턴은 피해요',
    },
    {
        id: 'SOFT_MIN_STAFF_BY_DUTY',
        category: 'STAFFING',
        label: '인원수 규칙',
        controls: [
            {key: 'duty', kind: 'select', optionsKey: 'duty'},
            {key: 'count', kind: 'number', min: 1, max: 10, suffix: '명'},
        ],
        sentence: [
            {type: 'control', key: 'duty'},
            {type: 'text', text: ' 근무에는 최소 '},
            {type: 'control', key: 'count'},
            {type: 'text', text: '명이 있어야 해요'},
        ],
        buildText: (p) => `${p.duty} 근무에는 최소 ${p.count}명이 있어야 해요`,
    },
    {
        id: 'SOFT_MAX_STAFF_BY_DUTY',
        category: 'STAFFING',
        label: '인원수 규칙',
        controls: [
            {key: 'duty', kind: 'select', optionsKey: 'duty'},
            {key: 'count', kind: 'number', min: 1, max: 10, suffix: '명'},
        ],
        sentence: [
            {type: 'control', key: 'duty'},
            {type: 'text', text: ' 근무에는 최대 '},
            {type: 'control', key: 'count'},
            {type: 'text', text: '명까지만 배정할 수 있어요'},
        ],
        buildText: (p) => `${p.duty} 근무에는 최대 ${p.count}명까지만 배정할 수 있어요`,
    },
    {
        id: 'SOFT_MIN_STAFF_BY_DATE_DUTY',
        category: 'STAFFING',
        label: '인원수 규칙',
        controls: [
            {key: 'date', kind: 'select', optionsKey: 'date'},
            {key: 'duty', kind: 'select', optionsKey: 'duty'},
            {key: 'count', kind: 'number', min: 1, max: 10, suffix: '명'},
        ],
        sentence: [
            {type: 'control', key: 'date'},
            {type: 'text', text: '에는 '},
            {type: 'control', key: 'duty'},
            {type: 'text', text: ' 근무에 최소 '},
            {type: 'control', key: 'count'},
            {type: 'text', text: '명이 필요해요'},
        ],
        buildText: (p) => `${p.date}에는 ${p.duty} 근무에 최소 ${p.count}명이 필요해요`,
    },
    {
        id: 'SOFT_MIN_STAFF_WEEKEND_HOLIDAY',
        category: 'STAFFING',
        label: '인원수 규칙',
        controls: [
            {key: 'duty', kind: 'select', optionsKey: 'duty'},
            {key: 'count', kind: 'number', min: 1, max: 10, suffix: '명'},
        ],
        sentence: [
            {type: 'text', text: '주말/공휴일에는 '},
            {type: 'control', key: 'duty'},
            {type: 'text', text: ' 근무에 최소 '},
            {type: 'control', key: 'count'},
            {type: 'text', text: '명이 필요해요'},
        ],
        buildText: (p) => `주말/공휴일에는 ${p.duty} 근무에 최소 ${p.count}명이 필요해요`,
    },
    {
        id: 'SOFT_NO_N_TO_D',
        category: 'FORBIDDEN',
        label: '금지 패턴 규칙',
        controls: [{key: 'target', kind: 'select', optionsKey: 'target'}],
        sentence: [
            {type: 'control', key: 'target'},
            {type: 'particle', key: 'target', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' '},
            {type: 'duty', code: 'N'},
            {type: 'text', text: ' 다음날 '},
            {type: 'duty', code: 'D'},
            {type: 'text', text: ' 근무를 피해요'},
        ],
        buildText: (p) => `${withParticle(p.target, '은', '는')} N 다음날 D 근무를 피해요`,
    },
    {
        id: 'SOFT_NO_N_TO_E',
        category: 'FORBIDDEN',
        label: '금지 패턴 규칙',
        controls: [{key: 'target', kind: 'select', optionsKey: 'target'}],
        sentence: [
            {type: 'control', key: 'target'},
            {type: 'particle', key: 'target', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' '},
            {type: 'duty', code: 'N'},
            {type: 'text', text: ' 다음날 '},
            {type: 'duty', code: 'E'},
            {type: 'text', text: ' 근무를 피해요'},
        ],
        buildText: (p) => `${withParticle(p.target, '은', '는')} N 다음날 E 근무를 피해요`,
    },
    {
        id: 'SOFT_NO_E_TO_D',
        category: 'FORBIDDEN',
        label: '금지 패턴 규칙',
        controls: [{key: 'target', kind: 'select', optionsKey: 'target'}],
        sentence: [
            {type: 'control', key: 'target'},
            {type: 'particle', key: 'target', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' '},
            {type: 'duty', code: 'E'},
            {type: 'text', text: ' 다음날 '},
            {type: 'duty', code: 'D'},
            {type: 'text', text: ' 근무를 피해요'},
        ],
        buildText: (p) => `${withParticle(p.target, '은', '는')} E 다음날 D 근무를 피해요`,
    },
    {
        id: 'SOFT_MAX_CONSECUTIVE_N',
        category: 'FORBIDDEN',
        label: '금지 패턴 규칙',
        controls: [
            {key: 'target', kind: 'select', optionsKey: 'target'},
            {key: 'count', kind: 'number', min: 2, max: 7, suffix: '번'},
        ],
        sentence: [
            {type: 'control', key: 'target'},
            {type: 'particle', key: 'target', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' 연속으로 '},
            {type: 'duty', code: 'N'},
            {type: 'text', text: '을 '},
            {type: 'control', key: 'count'},
            {type: 'text', text: '번까지 할 수 있어요'},
        ],
        buildText: (p) => `${withParticle(p.target, '은', '는')} 연속 N은 ${p.count}번까지 할 수 있어요`,
    },
    {
        id: 'SOFT_MAX_CONSECUTIVE_WORK',
        category: 'WORK_REST',
        label: '연속 근무 / 휴식 규칙',
        controls: [
            {key: 'target', kind: 'select', optionsKey: 'target'},
            {key: 'days', kind: 'number', min: 3, max: 15, suffix: '일'},
        ],
        sentence: [
            {type: 'control', key: 'target'},
            {type: 'particle', key: 'target', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' 한 달에 '},
            {type: 'control', key: 'days'},
            {type: 'text', text: '일까지 연속으로 근무할 수 있어요'},
        ],
        buildText: (p) => `${withParticle(p.target, '은', '는')} 한 달에 ${p.days}일까지 연속으로 근무할 수 있어요`,
    },
    {
        id: 'SOFT_NEED_OFF_AFTER_CONSECUTIVE',
        category: 'WORK_REST',
        label: '연속 근무 / 휴식 규칙',
        controls: [
            {key: 'target', kind: 'select', optionsKey: 'target'},
            {key: 'days', kind: 'number', min: 2, max: 15, suffix: '일'},
        ],
        sentence: [
            {type: 'control', key: 'target'},
            {type: 'particle', key: 'target', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' '},
            {type: 'control', key: 'days'},
            {type: 'text', text: '일 연속 근무 후에는 '},
            {type: 'duty', code: 'OFF'},
            {type: 'text', text: '가 필요해요'},
        ],
        buildText: (p) => `${withParticle(p.target, '은', '는')} ${p.days}일 연속 근무 후에는 OFF가 필요해요`,
    },
    {
        id: 'SOFT_NEED_OFF_AFTER_N',
        category: 'WORK_REST',
        label: '연속 근무 / 휴식 규칙',
        controls: [
            {key: 'target', kind: 'select', optionsKey: 'target'},
            {key: 'days', kind: 'number', min: 1, max: 5, suffix: '일'},
        ],
        sentence: [
            {type: 'control', key: 'target'},
            {type: 'particle', key: 'target', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' '},
            {type: 'duty', code: 'N'},
            {type: 'text', text: ' 근무 후 최소 '},
            {type: 'control', key: 'days'},
            {type: 'text', text: '일 '},
            {type: 'duty', code: 'OFF'},
            {type: 'text', text: '가 필요해요'},
        ],
        buildText: (p) => `${withParticle(p.target, '은', '는')} N 근무 후 최소 ${p.days}일 OFF가 필요해요`,
    },
    {
        id: 'SOFT_MIN_MONTHLY_OFF',
        category: 'WORK_REST',
        label: '연속 근무 / 휴식 규칙',
        controls: [
            {key: 'target', kind: 'select', optionsKey: 'target'},
            {key: 'days', kind: 'number', min: 1, max: 15, suffix: '일'},
        ],
        sentence: [
            {type: 'control', key: 'target'},
            {type: 'particle', key: 'target', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' 한 달에 최소 '},
            {type: 'control', key: 'days'},
            {type: 'text', text: '일 '},
            {type: 'duty', code: 'OFF'},
            {type: 'text', text: '가 있어야 해요'},
        ],
        buildText: (p) => `${withParticle(p.target, '은', '는')} 한 달에 최소 ${p.days}일 OFF가 있어야 해요`,
    },
    {
        id: 'SOFT_NO_WEEKEND_FOR_NURSE',
        category: 'PERSONAL',
        label: '사람별 근무 제한',
        controls: [{key: 'nurse', kind: 'select', optionsKey: 'nurse'}],
        sentence: [
            {type: 'control', key: 'nurse'},
            {type: 'particle', key: 'nurse', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' 주말 근무를 피해요'},
        ],
        buildText: (p) => `${withParticle(p.nurse, '은', '는')} 주말 근무를 피해요`,
    },
    {
        id: 'SOFT_NEWBIE_NO_SOLO_N',
        category: 'SKILL',
        label: '신규 / 경력 / 숙련도 규칙',
        controls: [{key: 'nurse', kind: 'select', optionsKey: 'nurse'}],
        sentence: [
            {type: 'control', key: 'nurse'},
            {type: 'particle', key: 'nurse', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' (신규) 혼자 '},
            {type: 'duty', code: 'N'},
            {type: 'text', text: ' 근무를 피해요'},
        ],
        buildText: (p) => `${withParticle(p.nurse, '은', '는')} (신규) 혼자 N 근무를 피해요`,
    },
    {
        id: 'SOFT_MIN_SKILL_IN_DUTY',
        category: 'SKILL',
        label: '신규 / 경력 / 숙련도 규칙',
        controls: [
            {key: 'duty', kind: 'select', optionsKey: 'dutyStrict'},
            {key: 'level', kind: 'select', optionsKey: 'level'},
            {key: 'count', kind: 'number', min: 1, max: 6, suffix: '명'},
        ],
        sentence: [
            {type: 'control', key: 'duty'},
            {type: 'text', text: ' 근무에는 '},
            {type: 'control', key: 'level'},
            {type: 'text', text: ' 이상 간호사가 '},
            {type: 'control', key: 'count'},
            {type: 'text', text: '명 이상 있어야 해요'},
        ],
        buildText: (p) => `${p.duty} 근무에는 ${p.level} 이상 간호사가 ${p.count}명 이상 있어야 해요`,
    },
    {
        id: 'SOFT_NO_SAME_DUTY_PAIR',
        category: 'COMBINATION',
        label: '근무자 조합',
        controls: [
            {key: 'nurseA', kind: 'select', optionsKey: 'nurse'},
            {key: 'nurseB', kind: 'select', optionsKey: 'nurse'},
        ],
        sentence: [
            {type: 'control', key: 'nurseA'},
            {type: 'particle', key: 'nurseA', withBatchim: '과', withoutBatchim: '와'},
            {type: 'text', text: ' '},
            {type: 'control', key: 'nurseB'},
            {type: 'particle', key: 'nurseB', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' 같은 근무를 피해요'},
        ],
        buildText: (p) => `${withParticle(p.nurseA, '과', '와')} ${withParticle(p.nurseB, '은', '는')} 같은 근무를 피해요`,
    },
    {
        id: 'SOFT_PREFER_SAME_DUTY_PAIR',
        category: 'COMBINATION',
        label: '근무자 조합',
        controls: [
            {key: 'nurseA', kind: 'select', optionsKey: 'nurse'},
            {key: 'nurseB', kind: 'select', optionsKey: 'nurse'},
        ],
        sentence: [
            {type: 'control', key: 'nurseA'},
            {type: 'particle', key: 'nurseA', withBatchim: '은', withoutBatchim: '는'},
            {type: 'text', text: ' '},
            {type: 'control', key: 'nurseB'},
            {type: 'particle', key: 'nurseB', withBatchim: '과', withoutBatchim: '와'},
            {type: 'text', text: ' 같은 근무를 하는 것이 좋아요'},
        ],
        buildText: (p) => `${withParticle(p.nurseA, '은', '는')} ${withParticle(p.nurseB, '과', '와')} 같은 근무를 하는 것이 좋아요`,
    },
];

function createClientId(rule: {shiftConstraintRuleId?: number; templateCode: string}) {
    if (rule.shiftConstraintRuleId) return `saved-${rule.shiftConstraintRuleId}`;
    return `draft-${rule.templateCode}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function fromServerRules(rules: Omit<TShiftConstraintRuleDraft, 'clientId'>[]) {
    return rules.map((rule) => ({...rule, clientId: createClientId(rule)}));
}

function createImportantDefaultRules() {
    const defaultParamsById: Record<string, Record<string, string>> = {
        IMPORTANT_MAX_WORK_STREAK: {days: '3'},
        IMPORTANT_MAX_SAME_DUTY_STREAK: {days: '3'},
        IMPORTANT_MIN_NIGHT_INTERVAL: {days: '3'},
        IMPORTANT_MAX_NIGHT_STREAK: {days: '2'},
        IMPORTANT_OFF_AFTER_NIGHT: {days: '1'},
        IMPORTANT_NO_NIGHT_BEFORE_REQUEST_OFF: {},
        IMPORTANT_FORBIDDEN_DUTY_PATTERNS: {},
    };

    return SOFT_RULE_TEMPLATES.filter((template) => IMPORTANT_DEFAULT_RULE_IDS.has(template.id)).map<TShiftConstraintRuleDraft>((template, index) => {
        const params = defaultParamsById[template.id] ?? {};

        return {
            clientId: `important-${template.id}`,
            templateCode: template.id,
            category: template.category,
            severity: 'SOFT',
            sortOrder: index + 1,
            params,
            displayText: template.buildText(params),
            isValid: true,
            invalidReason: null,
        };
    });
}

function getOptionKey(option: TShiftConstraintOption) {
    if (option.nurseId != null) return `nurse-${option.nurseId}`;
    if (option.wardShiftTypeId != null) return `shift-${option.wardShiftTypeId}`;
    if (option.day != null) return `day-${option.day}`;
    if (option.level != null) return `level-${option.level}`;
    return `${option.type}-${option.label ?? option.name ?? option.code ?? ''}`;
}

function isConstraintOption(value: unknown): value is TShiftConstraintOption {
    return typeof value === 'object' && value !== null && 'type' in value;
}

function getValueLabel(value: unknown) {
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return value;
    if (!isConstraintOption(value)) return '-';
    return value.label ?? value.name ?? value.code ?? value.type;
}

function getRuleTitle(rule: TShiftConstraintRuleDraft, template?: TShiftConstraintTemplate) {
    if (rule.displayText) return rule.displayText;
    if (!template) return rule.templateCode;
    return template.displayTemplate.split('{')[0].trim() || template.templateCode;
}

function daysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
}

function uniqueByValue(options: TSelectOption[]) {
    const map = new Map<string, TSelectOption>();
    options.forEach((option) => {
        if (!map.has(option.value)) map.set(option.value, option);
    });
    return Array.from(map.values());
}

function reorderRules(items: TShiftConstraintRuleDraft[], sourceIndex: number, destinationIndex: number) {
    const next = [...items];
    const [moved] = next.splice(sourceIndex, 1);
    if (!moved) return items;

    next.splice(destinationIndex, 0, moved);
    return next.map((rule, index) => ({...rule, sortOrder: index + 1}));
}

function normalizeShiftTypes(input: unknown): TShiftTypeLike[] {
    if (Array.isArray(input)) return input as TShiftTypeLike[];

    if (input && typeof input === 'object') {
        const maybe = input as {shiftTypes?: unknown; wardShiftTypes?: unknown};

        if (Array.isArray(maybe.shiftTypes)) return maybe.shiftTypes as TShiftTypeLike[];
        if (Array.isArray(maybe.wardShiftTypes)) return maybe.wardShiftTypes as TShiftTypeLike[];
    }

    return [];
}

function findDutyOptionByCode(options: TSelectOption[], code: string) {
    const normalizedCode = code.trim().toUpperCase();
    if (normalizedCode === 'OFF') {
        return (
            options.find((option) => option.shortName?.toUpperCase() === 'OFF') ??
            options.find((option) => option.shortName?.toUpperCase() === 'O') ??
            options.find((option) => option.name?.includes('오프') || option.name?.toUpperCase() === 'OFF')
        );
    }

    return options.find((option) => option.shortName?.toUpperCase() === normalizedCode);
}

function getOptionsForControl(control: TControlDef, template: TSoftRuleTemplate, params: Record<string, string>, optionMap: Record<string, TSelectOption[]>) {
    const options = optionMap[control.optionsKey ?? ''] ?? [];
    if (template.category !== 'COMBINATION' || control.optionsKey !== 'nurse') return options;

    const pairedKey = control.key === 'nurseA' ? 'nurseB' : control.key === 'nurseB' ? 'nurseA' : null;
    if (!pairedKey) return options;

    const pairedValue = params[pairedKey];
    return options.filter((option) => option.label !== pairedValue);
}

function normalizeCombinationParams(template: TSoftRuleTemplate, params: Record<string, string>, optionMap: Record<string, TSelectOption[]>) {
    if (template.category !== 'COMBINATION' || params.nurseA !== params.nurseB) return params;

    const nurseOptions = optionMap.nurse ?? [];
    const nextNurseB = nurseOptions.find((option) => option.label !== params.nurseA)?.label;
    if (!nextNurseB) return params;

    return {...params, nurseB: nextNurseB};
}

type TInlineDropdownProps = {
    value: string;
    options: TSelectOption[];
    minWidth?: number;
    onChange: (value: string) => void;
};

function InlineDropdown({value, options, minWidth = 72, onChange}: TInlineDropdownProps) {
    const [open, setOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = options.find((option) => option.label === value || option.value === value) ?? options[0];

    const toggleOpen = () => {
        if (!open && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const estimatedMenuHeight = Math.min(220, Math.max(44, options.length * 38 + 8));
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            setOpenUpward(spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow);
        }

        setOpen((prev) => !prev);
    };

    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (ref.current?.contains(event.target as Node)) return;
            setOpen(false);
        };

        document.addEventListener('mousedown', handlePointerDown);

        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [open]);

    return (
        <div ref={ref} className="relative inline-flex">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={toggleOpen}
                className={`inline-flex h-8 items-center justify-between gap-1.5 rounded-[8px] bg-white px-2.5 font-apple text-[14px] font-semibold text-main-1 ring-1 ring-main-4 transition-[box-shadow,background-color] hover:bg-[#FBFAFF] focus-visible:ring-2 focus-visible:ring-main-1/25 focus-visible:outline-none`}
                style={{minWidth}}
            >
                {selected?.kind === 'duty' ? <DutyTypeBadge option={selected} /> : <span className="max-w-[120px] truncate">{selected?.label ?? value}</span>}
                <ChevronDown className={`size-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open ? (
                <div
                    role="listbox"
                    className={`absolute left-0 z-30 max-h-[220px] min-w-full animate-in overflow-y-auto rounded-[10px] border border-gray-6 bg-white py-1 shadow-[0px_10px_28px_rgba(95,100,135,0.16)] duration-150 fade-in-0 zoom-in-95 ${
                        openUpward ? 'bottom-full mb-1 slide-in-from-bottom-1' : 'top-full mt-1 slide-in-from-top-1'
                    }`}
                >
                    {options.map((option) => {
                        const isSelected = option.label === selected?.label;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                className={`flex w-full items-center justify-center whitespace-nowrap px-3 py-2 text-center font-apple text-[14px] transition-colors hover:bg-gray-7 focus-visible:outline-2 focus-visible:outline-main-1 ${
                                    isSelected ? 'bg-main-light font-semibold text-main-1' : 'text-sub-1'
                                }`}
                                onClick={() => {
                                    onChange(option.label);
                                    setOpen(false);
                                }}
                            >
                                {option.kind === 'duty' ? <DutyTypeBadge option={option} /> : option.label}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

type TSoftSentenceProps = {
    template: TSoftRuleTemplate;
    params: Record<string, string>;
    optionMap: Record<string, TSelectOption[]>;
    onParamChange: (key: string, value: string) => void;
};

function SoftSentence({template, params, optionMap, onParamChange}: TSoftSentenceProps) {
    return (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-7">
            {template.sentence.map((part, idx) => {
                if (part.type === 'text') {
                    return (
                        <span key={`${template.id}-text-${idx}`} className="font-apple text-[14px] font-medium text-sub-1">
                            {part.text}
                        </span>
                    );
                }

                if (part.type === 'duty') {
                    const option = findDutyOptionByCode([...(optionMap.duty ?? []), ...(optionMap.dutyStrict ?? [])], part.code);

                    if (!option) return null;

                    return <DutyTypeBadge key={`${template.id}-duty-${part.code}-${idx}`} option={option} />;
                }

                if (part.type === 'dutyPattern') {
                    const options = part.codes
                        .map((code) => findDutyOptionByCode([...(optionMap.duty ?? []), ...(optionMap.dutyStrict ?? [])], code))
                        .filter((option): option is TSelectOption => Boolean(option));

                    return <DutyPatternBadge key={`${template.id}-pattern-${idx}`} options={options} />;
                }

                if (part.type === 'particle') {
                    return (
                        <span key={`${template.id}-particle-${idx}`} className="font-apple text-[14px] font-medium text-sub-1">
                            {hasFinalConsonant(params[part.key] ?? '') ? part.withBatchim : part.withoutBatchim}
                        </span>
                    );
                }

                const control = template.controls.find((item) => item.key === part.key);

                if (!control) return null;

                if (control.kind === 'number') {
                    const min = control.min ?? 1;
                    const max = control.max ?? min;
                    const values = control.values ?? Array.from({length: max - min + 1}, (_, i) => min + i);
                    const current = Number(params[control.key] ?? values[0] ?? min);

                    return (
                        <InlineDropdown
                            key={`${template.id}-${control.key}-${idx}`}
                            value={String(current)}
                            options={values.map((v) => ({value: String(v), label: String(v)}))}
                            minWidth={58}
                            onChange={(nextValue) => onParamChange(control.key, String(Number(nextValue)))}
                        />
                    );
                }

                const options = getOptionsForControl(control, template, params, optionMap);
                const selected = params[control.key] ?? options[0]?.label ?? '';

                return (
                    <InlineDropdown
                        key={`${template.id}-${control.key}-${idx}`}
                        value={selected}
                        options={options}
                        minWidth={control.optionsKey === 'date' ? 88 : control.optionsKey === 'target' ? 104 : 72}
                        onChange={(nextValue) => onParamChange(control.key, nextValue)}
                    />
                );
            })}
        </div>
    );
}

type TSlotControlProps = {
    slot: TShiftConstraintSlot;
    value: unknown;
    options: TShiftConstraintOptions;
    onChange: (value: unknown) => void;
};

function SlotControl({slot, value, options, onChange}: TSlotControlProps) {
    if (slot.inputType === 'NUMBER') {
        const numberValue = typeof value === 'number' ? value : (slot.min ?? 1);
        const values = Array.from({length: (slot.max ?? 10) - (slot.min ?? 1) + 1}, (_, i) => (slot.min ?? 1) + i);

        return (
            <select
                value={numberValue}
                onChange={(e) => onChange(Number(e.target.value))}
                className="h-8 rounded-[8px] border border-main-4 bg-white px-2.5 font-apple text-[15px] text-main-1 outline-none"
            >
                {values.map((v) => (
                    <option key={v} value={v}>
                        {v}
                    </option>
                ))}
            </select>
        );
    }

    if (!slot.optionGroup) return null;

    const optionList = options[slot.optionGroup] ?? [];
    const selected = isConstraintOption(value) ? getOptionKey(value) : '';

    return (
        <select
            value={selected}
            onChange={(e) => {
                const next = optionList.find((option) => getOptionKey(option) === e.target.value);
                if (next) onChange(next);
            }}
            className="h-8 max-w-[130px] rounded-[8px] border border-main-4 bg-white px-2.5 font-apple text-[14px] text-main-1 outline-none"
        >
            {optionList.map((option) => (
                <option key={getOptionKey(option)} value={getOptionKey(option)}>
                    {getValueLabel(option)}
                </option>
            ))}
        </select>
    );
}

type TRuleRowProps = {
    rule: TShiftConstraintRuleDraft;
    template?: TShiftConstraintTemplate;
    options: TShiftConstraintOptions;
    optionMap: Record<string, TSelectOption[]>;
    highlighted?: boolean;
    isImportant?: boolean;
    dragHandleProps?: DraggableProvidedDragHandleProps | null;
    onDelete: () => void;
    onParamChange: (key: string, value: unknown) => void;
    onSoftParamChange: (template: TSoftRuleTemplate, key: string, value: string) => void;
};

const RuleRow = memo(function RuleRow({
    rule,
    template,
    options,
    optionMap,
    highlighted = false,
    isImportant = false,
    dragHandleProps,
    onDelete,
    onParamChange,
    onSoftParamChange,
}: TRuleRowProps) {
    const slots = template?.slots ?? [];
    const softTemplate = SOFT_RULE_TEMPLATES.find((item) => item.id === rule.templateCode);

    return (
        <div
            className={`grid min-h-[52px] grid-cols-[minmax(0,1fr)_34px] items-center gap-3 rounded-[10px] bg-white px-3 py-2.5 transition-colors ${
                highlighted ? 'ring-2 ring-main-1/55 shadow-[0_0_0_2px_rgba(127,93,255,0.10)]' : ''
            }`}
        >
            <div className="flex min-w-0 items-center gap-2">
                <button
                    type="button"
                    aria-label="드래그하여 우선순위 변경"
                    className="grid size-7 shrink-0 cursor-grab place-items-center rounded-[8px] text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-2 active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-main-1/25 focus-visible:outline-none"
                    {...dragHandleProps}
                >
                    <SixDotsIcon className="size-3.5" />
                </button>
                <div className="min-w-0">
                    {softTemplate ? (
                        <div className="flex flex-wrap items-center gap-y-2">
                            {isImportant ? (
                                <span className="mr-9 inline-flex h-6 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF3D6] px-2 font-apple text-[12px] font-bold text-[#B86E00]">
                                    중요
                                </span>
                            ) : (
                                <span className="mr-9 h-6 w-10 shrink-0" aria-hidden />
                            )}
                            <SoftSentence
                                template={softTemplate}
                                params={rule.params as Record<string, string>}
                                optionMap={optionMap}
                                onParamChange={(key, value) => onSoftParamChange(softTemplate, key, value)}
                            />
                        </div>
                    ) : (
                        <p className="truncate font-apple text-[15px] font-medium text-sub-1">{getRuleTitle(rule, template)}</p>
                    )}
                </div>
            </div>

            {!softTemplate ? (
                <div className="col-start-2 flex flex-wrap items-center gap-2">
                    {slots.map((slot) => (
                        <SlotControl
                            key={`${rule.clientId}-${slot.key}`}
                            slot={slot}
                            value={rule.params[slot.key]}
                            options={options}
                            onChange={(next) => onParamChange(slot.key, next)}
                        />
                    ))}
                </div>
            ) : null}

            <div className="flex items-center justify-end">
                <button
                    type="button"
                    onClick={onDelete}
                    className="grid size-7 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                    aria-label="제약 조건 삭제"
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>
    );
});

type TDraggableRuleRowProps = {
    rule: TShiftConstraintRuleDraft;
    index: number;
    template?: TShiftConstraintTemplate;
    options: TShiftConstraintOptions;
    optionMap: Record<string, TSelectOption[]>;
    highlighted: boolean;
    isImportant: boolean;
    onDelete: (rule: TShiftConstraintRuleDraft) => void;
    onParamChange: (clientId: string, key: string, value: unknown) => void;
    onSoftParamChange: (clientId: string, template: TSoftRuleTemplate, key: string, value: string) => void;
};

const DraggableRuleRow = memo(function DraggableRuleRow({
    rule,
    index,
    template,
    options,
    optionMap,
    highlighted,
    isImportant,
    onDelete,
    onParamChange,
    onSoftParamChange,
}: TDraggableRuleRowProps) {
    return (
        <Draggable draggableId={rule.clientId} index={index}>
            {(dragProvided, dragSnapshot) => (
                <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={`grid grid-cols-[64px_minmax(0,1fr)] items-stretch gap-2 ${dragSnapshot.isDragging ? 'opacity-95' : ''}`}
                    style={dragProvided.draggableProps.style}
                >
                    <span className="flex h-full min-h-[52px] items-center justify-center font-apple text-[14px] font-bold text-gray-4">{index + 1}</span>
                    <div className="min-w-0">
                        <RuleRow
                            rule={rule}
                            template={template}
                            options={options}
                            optionMap={optionMap}
                            highlighted={highlighted}
                            isImportant={isImportant}
                            dragHandleProps={dragProvided.dragHandleProps}
                            onDelete={() => onDelete(rule)}
                            onParamChange={(key, value) => onParamChange(rule.clientId, key, value)}
                            onSoftParamChange={(softTemplate, key, value) => onSoftParamChange(rule.clientId, softTemplate, key, value)}
                        />
                    </div>
                </div>
            )}
        </Draggable>
    );
});

type TSectionProps = {
    action?: React.ReactNode;
    children: React.ReactNode;
};

function Section({action, children}: TSectionProps) {
    return (
        <section className="mb-4">
            <div className="mb-2.5 flex justify-end">
                <div className="flex items-center gap-2">{action}</div>
            </div>
            <div className="rounded-[14px] bg-[#F1F3F6] px-3 pt-6 pb-8">
                <div className="mb-5 grid grid-cols-[64px_minmax(0,1fr)] items-center gap-2">
                    <span className="text-center font-apple text-[13px] font-bold text-gray-4">우선순위</span>
                    <span className="text-center font-apple text-[13px] font-bold text-gray-4">제약조건</span>
                </div>
                <div className="space-y-2.5">{children}</div>
            </div>
        </section>
    );
}

type TConstraintsProps = {
    wardId?: number | null;
    shiftTeamId?: number | null;
    year?: number;
    month?: number;
    variant?: 'flow' | 'settings';
};

type TSoftModalProps = {
    open: boolean;
    optionMap: Record<string, TSelectOption[]>;
    existingTemplateCodes: Set<string>;
    onClose: () => void;
    onAdd: (template: TSoftRuleTemplate, params: Record<string, string>) => void;
};

function SoftRuleModal({open, optionMap, existingTemplateCodes, onClose, onAdd}: TSoftModalProps) {
    const visibleImportantTemplates = useMemo(
        () => SOFT_RULE_TEMPLATES.filter((template) => IMPORTANT_DEFAULT_RULE_IDS.has(template.id) && !existingTemplateCodes.has(template.id)),
        [existingTemplateCodes],
    );
    const categories = useMemo<TModalCategory[]>(() => {
        const normalCategories = Array.from(
            new Set(SOFT_RULE_TEMPLATES.filter((template) => !IMPORTANT_DEFAULT_RULE_IDS.has(template.id)).map((t) => t.category)),
        );

        return visibleImportantTemplates.length ? ['IMPORTANT', ...normalCategories] : normalCategories;
    }, [visibleImportantTemplates]);
    const [selectedCategory, setSelectedCategory] = useState<TModalCategory>('IMPORTANT');
    const [draftParams, setDraftParams] = useState<Record<string, Record<string, string>>>({});

    useEffect(() => {
        if (!open) return;

        const next: Record<string, Record<string, string>> = {};
        SOFT_RULE_TEMPLATES.forEach((template) => {
            const params: Record<string, string> = {};
            template.controls.forEach((control) => {
                if (control.kind === 'number') params[control.key] = String(control.values?.[0] ?? control.min ?? 1);
                else params[control.key] = optionMap[control.optionsKey ?? '']?.[0]?.label ?? '';
            });
            next[template.id] = normalizeCombinationParams(template, params, optionMap);
        });
        setDraftParams(next);
        setSelectedCategory(categories[0] ?? 'STAFFING');
    }, [categories, open, optionMap]);

    if (!open) return null;

    const templates = SOFT_RULE_TEMPLATES.filter((template) =>
        selectedCategory === 'IMPORTANT'
            ? IMPORTANT_DEFAULT_RULE_IDS.has(template.id) && !existingTemplateCodes.has(template.id)
            : !IMPORTANT_DEFAULT_RULE_IDS.has(template.id) && template.category === selectedCategory,
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="flex min-h-[640px] w-full max-w-[820px] flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.22)]">
                <div className="flex items-start justify-between px-6 pt-6 pb-4">
                    <div>
                        <p className="font-apple text-[28px] font-bold text-sub-1">제약조건 추가</p>
                        <p className="mt-1 font-apple text-[13px] font-medium text-gray-4">
                            근무표 상황에 따라 일부 조건은 반영되지 않을 수 있어요.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid size-8 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                        aria-label="닫기"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="mx-6 flex flex-wrap gap-2 border-b border-gray-6 pb-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            className={`h-8 shrink-0 rounded-full px-3 font-apple text-[13px] font-semibold transition-colors ${
                                selectedCategory === category ? 'bg-main-light text-main-1' : 'bg-gray-7 text-gray-4 hover:bg-gray-6/60 hover:text-sub-1'
                            }`}
                        >
                            {MODAL_CATEGORY_LABEL[category]}
                        </button>
                    ))}
                </div>

                <div className="mt-4 min-h-[430px] flex-1 space-y-2 overflow-y-auto px-6 pb-6">
                    {templates.map((template) => {
                        const templateParams = draftParams[template.id] ?? {};

                        return (
                            <div
                                key={template.id}
                                className="flex items-center gap-3 rounded-[12px] bg-gray-7 px-4 py-3 transition-colors hover:bg-gray-6/70"
                            >
                                <div className="min-w-0 flex-1">
                                    <SoftSentence
                                        template={template}
                                        params={templateParams}
                                        optionMap={optionMap}
                                        onParamChange={(key, value) =>
                                            setDraftParams((prev) => ({
                                                ...prev,
                                                [template.id]: {...(prev[template.id] ?? {}), [key]: value},
                                            }))
                                        }
                                    />
                                </div>
                                <div className="shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => onAdd(template, templateParams)}
                                        className="grid size-8 place-items-center rounded-full bg-main-1 text-white transition-colors hover:bg-main-2 focus-visible:ring-2 focus-visible:ring-main-1/25 focus-visible:outline-none"
                                        aria-label="제약 조건 추가"
                                        title="추가"
                                    >
                                        <Plus className="size-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

type TDeleteImportantRuleModalProps = {
    rule: TShiftConstraintRuleDraft | null;
    onClose: () => void;
    onConfirm: () => void;
};

function DeleteImportantRuleModal({rule, onClose, onConfirm}: TDeleteImportantRuleModalProps) {
    if (!rule) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="w-full max-w-[420px] rounded-[18px] bg-white p-5 shadow-[0_24px_56px_rgba(15,23,42,0.22)]">
                <p className="font-apple text-[20px] font-bold text-sub-1">중요 조건을 삭제할까요?</p>
                <p className="mt-2 font-apple text-[14px] leading-6 text-gray-4">
                    이 조건은 주로 사용되는 조건이며, 법적 요건과 관련될 수 있어요. 삭제할까요?
                </p>
                <div className="mt-5 flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-11 flex-1 rounded-[10px] bg-[#F3F4F6] px-6 font-apple text-[16px] font-semibold text-gray-3 transition-colors hover:bg-[#EAECEF]"
                    >
                        닫기
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="h-11 flex-1 rounded-[10px] bg-[#D14343] px-6 font-apple text-[16px] font-semibold text-white transition-colors hover:bg-[#BD3434]"
                    >
                        삭제하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export function Constraints({wardId: wardIdProp, shiftTeamId, year: yearProp, month: monthProp, variant = 'flow'}: TConstraintsProps = {}) {
    const authWardId = useAuthStore((s) => s.wardId);
    const storeShiftTeamId = useMakeShiftStore((s) => s.currentShiftTeamId);
    const storeYear = useMakeShiftStore((s) => s.year);
    const storeMonth = useMakeShiftStore((s) => s.month);
    const wardId = wardIdProp ?? authWardId;
    const currentShiftTeamId = shiftTeamId ?? storeShiftTeamId;
    const year = yearProp ?? storeYear;
    const month = monthProp ?? storeMonth;
    const enabled = wardId !== null && wardId !== undefined && currentShiftTeamId !== null && currentShiftTeamId !== undefined;
    const frameClassName = variant === 'settings' ? 'flex min-w-0 flex-col' : 'flex min-w-0 flex-col items-end';
    const surfaceWidthClassName = variant === 'settings' ? 'w-full' : 'w-[90%]';

    const [rules, setRules] = useState<TShiftConstraintRuleDraft[]>([]);
    const [softModalOpen, setSoftModalOpen] = useState(false);
    const [highlightedRuleId, setHighlightedRuleId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<TShiftConstraintRuleDraft | null>(null);

    const candidatesQuery = useQuery({
        queryKey: shiftConstraintRuleQueryKeys.candidates(wardId ?? -1, currentShiftTeamId ?? -1),
        queryFn: () => getShiftConstraintRuleCandidates(wardId ?? -1, currentShiftTeamId ?? -1),
        enabled,
        refetchOnWindowFocus: false,
    });
    const rulesQuery = useQuery({
        queryKey: shiftConstraintRuleQueryKeys.rules(wardId ?? -1, currentShiftTeamId ?? -1),
        queryFn: () => getShiftConstraintRules(wardId ?? -1, currentShiftTeamId ?? -1),
        enabled,
        refetchOnWindowFocus: false,
    });
    const nurseQuery = useQuery({
        ...wardQueryOptions.shiftTeamNurses(wardId ?? -1, currentShiftTeamId ?? -1),
        enabled,
    });
    const shiftTypeQuery = useQuery({
        ...wardQueryOptions.shiftTypes(wardId ?? -1),
        enabled: wardId !== null && wardId !== undefined,
    });

    useEffect(() => {
        if (!rulesQuery.data) return;
        const defaults = createImportantDefaultRules();
        const defaultTemplateCodes = new Set(defaults.map((rule) => rule.templateCode));
        const loadedRules = fromServerRules(rulesQuery.data.rules);
        const next = [
            ...defaults,
            ...loadedRules.filter((rule) => rule.severity === 'SOFT' && !defaultTemplateCodes.has(rule.templateCode)),
        ].map((rule, index) => ({...rule, sortOrder: index + 1}));

        setRules(next);
    }, [rulesQuery.data]);

    const templates = candidatesQuery.data?.templates ?? [];
    const templateByCode = useMemo(() => new Map(templates.map((template) => [template.templateCode, template] as const)), [templates]);
    const options = candidatesQuery.data?.options ?? {};
    const nurses: TNurseLike[] = Array.isArray(nurseQuery.data) ? nurseQuery.data : [];
    const shiftTypes = normalizeShiftTypes(shiftTypeQuery.data);
    const skillConfig = useMemo(() => getWardSkillSettings(wardId)?.config ?? DEFAULT_SKILL_LEVEL_CONFIG, [wardId]);

    const optionMap = useMemo(() => {
        const dutyOptions = uniqueByValue([
            {value: 'ALL_DUTY', label: '모든'},
            ...shiftTypes
                .filter((shiftType) => shiftType.wardShiftTypeId != null && (shiftType.shortName || shiftType.name))
                .map((shiftType) => ({
                    value: String(shiftType.wardShiftTypeId),
                    label: `${shiftType.shortName || shiftType.name} ${shiftType.name ?? shiftType.shortName ?? ''}`.trim(),
                    kind: 'duty' as const,
                    shortName: shiftType.shortName || shiftType.name,
                    name: shiftType.name,
                    color: shiftType.color,
                })),
        ]);
        const dateOptions = [{value: 'ALL_DATE', label: '모든날'}].concat(
            Array.from({length: daysInMonth(year, month)}, (_, idx) => ({value: String(idx + 1), label: `${idx + 1}일`})),
        );
        const nurseOptions = nurses
            .filter((nurse) => nurse.nurseId != null && nurse.name)
            .map((nurse) => ({value: String(nurse.nurseId), label: String(nurse.name)}));
        const preceptorOptions = nurses
            .filter((nurse) => nurse.nurseId != null && nurse.name && nurse.isPreceptor)
            .map((nurse) => ({value: String(nurse.nurseId), label: String(nurse.name)}));

        return {
            target: [{value: 'ALL', label: '모든사람'}, ...nurseOptions],
            duty: dutyOptions,
            date: dateOptions,
            nurse: nurseOptions,
            preceptor: preceptorOptions.length ? preceptorOptions : nurseOptions,
            level: Array.from({length: skillConfig.levelCount}, (_, index) => {
                const level = skillConfig.levelCount - index;
                const label = skillConfig.levelLabels?.[level] ?? `LV. ${level}`;

                return {value: String(level), label};
            }),
            dutyStrict: dutyOptions.filter((option) => option.value !== 'ALL_DUTY'),
        } as Record<string, TSelectOption[]>;
    }, [nurses, shiftTypes, skillConfig, year, month]);

    const softRules = rules.filter((rule) => rule.severity === 'SOFT');
    const existingTemplateCodes = useMemo(() => new Set(rules.map((rule) => rule.templateCode)), [rules]);
    const isLoading = candidatesQuery.isPending || rulesQuery.isPending;
    const softRuleViewModels = useMemo(
        () =>
            softRules.map((rule, index) => ({
                rule,
                index,
                template: templateByCode.get(rule.templateCode),
                highlighted: highlightedRuleId === rule.clientId,
                isImportant: IMPORTANT_DEFAULT_RULE_IDS.has(rule.templateCode),
            })),
        [highlightedRuleId, softRules, templateByCode],
    );

    const addSoftRule = (template: TSoftRuleTemplate, params: Record<string, string>) => {
        if (IMPORTANT_DEFAULT_RULE_IDS.has(template.id) && existingTemplateCodes.has(template.id)) {
            toast('이미 추가된 주요 조건이에요.');
            return;
        }

        const nextRule: TShiftConstraintRuleDraft = {
            clientId: createClientId({templateCode: template.id}),
            templateCode: template.id,
            category: template.category,
            severity: 'SOFT',
            sortOrder: softRules.length + 1,
            params,
            displayText: template.buildText(params),
            isValid: true,
            invalidReason: null,
        };

        setRules((prev) => {
            const hard = prev.filter((r) => r.severity === 'HARD');
            const soft = prev.filter((r) => r.severity === 'SOFT');
            const reorderedSoft = [...soft, nextRule].map((r, idx) => ({...r, sortOrder: idx + 1}));
            return [...hard, ...reorderedSoft];
        });
        setHighlightedRuleId(nextRule.clientId);
        setSoftModalOpen(false);
        toast.success('약 제약조건을 추가했어요.');

        window.setTimeout(() => {
            setHighlightedRuleId((current) => (current === nextRule.clientId ? null : current));
        }, 1800);
    };

    const resetRulesToImportantDefaults = useCallback(() => {
        const defaults = createImportantDefaultRules();
        setRules(defaults);
        setHighlightedRuleId(null);
        toast.success('주요 조건 7개로 초기화했어요.');
    }, []);

    const handleDragEnd = useCallback(({source, destination}: DropResult) => {
        if (!destination || destination.index === source.index) return;

        setRules((prev) => {
            const hard = prev.filter((rule) => rule.severity === 'HARD');
            const soft = prev.filter((rule) => rule.severity === 'SOFT');
            const reorderedSoft = reorderRules(soft, source.index, destination.index);
            return [...hard, ...reorderedSoft];
        });
    }, []);

    const updateRuleParam = useCallback((clientId: string, key: string, value: unknown) => {
        setRules((prev) => prev.map((item) => (item.clientId === clientId ? {...item, params: {...item.params, [key]: value}} : item)));
    }, []);

    const updateSoftRuleParamByClientId = useCallback((clientId: string, template: TSoftRuleTemplate, key: string, value: string) => {
        setRules((prev) =>
            prev.map((item) => {
                if (item.clientId !== clientId) return item;

                const nextParams = {...item.params, [key]: value} as Record<string, string>;

                return {
                    ...item,
                    params: nextParams,
                    displayText: template.buildText(nextParams),
                };
            }),
        );
    }, []);

    const removeRule = useCallback((rule: TShiftConstraintRuleDraft) => {
        if (IMPORTANT_DEFAULT_RULE_IDS.has(rule.templateCode)) {
            setDeleteTarget(rule);
            return;
        }

        setRules((prev) => prev.filter((item) => item.clientId !== rule.clientId));
    }, []);

    const confirmDeleteImportantRule = () => {
        if (!deleteTarget) return;

        setRules((prev) => prev.filter((item) => item.clientId !== deleteTarget.clientId));
        setDeleteTarget(null);
        toast.success('중요 제약조건을 삭제했어요.');
    };

    if (!enabled) {
        return (
            <div className={frameClassName}>
                <div className={`${surfaceWidthClassName} rounded-[18px] bg-white px-5 py-5 font-apple text-[14px] text-gray-4`}>
                    근무팀을 먼저 선택해 주세요.
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={frameClassName}>
                <div className={`flex min-h-[180px] ${surfaceWidthClassName} items-center justify-center rounded-[18px] bg-white`}>
                    <div className="flex items-center gap-2 font-apple text-[13px] text-gray-4">
                        <Loader2 className="size-4 animate-spin" />
                        제약조건 불러오는 중
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={frameClassName}>
                <div
                    className={`${surfaceWidthClassName} min-w-0 rounded-[18px] bg-white px-[clamp(14px,1.5vw,22px)] py-[clamp(10px,1.1vw,16px)]`}
                >
                    <Section
                        action={
                            <>
                                <button
                                    type="button"
                                    onClick={() => setSoftModalOpen(true)}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#6C5CFF] px-3.5 font-apple text-[12px] font-bold text-white transition-colors hover:bg-[#5948F5] focus-visible:ring-2 focus-visible:ring-main-1/25 focus-visible:outline-none"
                                >
                                    <Plus className="size-3.5" />
                                    제약 조건 추가
                                </button>
                                <button
                                    type="button"
                                    onClick={resetRulesToImportantDefaults}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#E8EBF1] px-3.5 font-apple text-[12px] font-bold text-gray-4 transition-colors hover:bg-[#DFE4EC] hover:text-sub-1 focus-visible:ring-2 focus-visible:ring-main-1/25 focus-visible:outline-none"
                                >
                                    <RotateCcw className="size-3.5" />
                                    초기화
                                </button>
                            </>
                        }
                    >
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="soft-constraint-rules">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2.5">
                                        {softRuleViewModels.map(({rule, index, template, highlighted, isImportant}) => (
                                            <DraggableRuleRow
                                                key={rule.clientId}
                                                rule={rule}
                                                index={index}
                                                template={template}
                                                options={options}
                                                optionMap={optionMap}
                                                highlighted={highlighted}
                                                isImportant={isImportant}
                                                onDelete={removeRule}
                                                onParamChange={updateRuleParam}
                                                onSoftParamChange={updateSoftRuleParamByClientId}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Section>
                </div>
            </div>

            <SoftRuleModal
                open={softModalOpen}
                optionMap={optionMap}
                existingTemplateCodes={existingTemplateCodes}
                onClose={() => setSoftModalOpen(false)}
                onAdd={addSoftRule}
            />
            <DeleteImportantRuleModal rule={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDeleteImportantRule} />
        </>
    );
}
