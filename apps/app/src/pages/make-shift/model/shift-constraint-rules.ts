export type TShiftConstraintSeverity = 'HARD' | 'SOFT';

export type TShiftConstraintOption = {
    type: string;
    label?: string;
    nurseId?: number;
    name?: string;
    proficiency?: number;
    isPreceptor?: boolean;
    isPreceptee?: boolean;
    wardShiftTypeId?: number;
    code?: string;
    day?: number;
    level?: number;
};

export type TShiftConstraintOptions = Record<string, TShiftConstraintOption[]>;

export type TShiftConstraintSlot = {
    key: string;
    label: string;
    inputType: string;
    optionGroup?: string;
    required?: boolean;
    min?: number;
    max?: number;
};

export type TShiftConstraintTemplate = {
    templateCode: string;
    category: string;
    displayTemplate: string;
    severity: TShiftConstraintSeverity;
    allowedSeverities: TShiftConstraintSeverity[];
    supportedInGenerator: boolean;
    supportedInValidator: boolean;
    slots: TShiftConstraintSlot[];
};

export type TShiftConstraintRule = {
    shiftConstraintRuleId?: number;
    templateCode: string;
    category: string;
    severity: TShiftConstraintSeverity;
    sortOrder: number;
    params: Record<string, unknown>;
    displayText?: string;
    isValid?: boolean;
    invalidReason?: string | null;
};

export type TShiftConstraintRuleDraft = TShiftConstraintRule & {
    clientId: string;
};

export type TShiftConstraintRuleCandidatesResponse = {
    schemaVersion: number;
    wardId: number;
    shiftTeamId: number;
    options: TShiftConstraintOptions;
    templates: TShiftConstraintTemplate[];
};

export type TShiftConstraintRulesResponse = {
    schemaVersion: number;
    wardId: number;
    shiftTeamId: number;
    rules: TShiftConstraintRule[];
};

export type TShiftConstraintRulesSavePayload = {
    rules: {
        shiftConstraintRuleId?: number;
        templateCode: string;
        severity: TShiftConstraintSeverity;
        sortOrder: number;
        params: Record<string, unknown>;
    }[];
};

const MOCK_SCHEMA_VERSION = 1;

const MOCK_OPTIONS: TShiftConstraintOptions = {
    SHIFT_TYPE: [
        {type: 'SHIFT_TYPE', wardShiftTypeId: 1, label: 'D'},
        {type: 'SHIFT_TYPE', wardShiftTypeId: 2, label: 'E'},
        {type: 'SHIFT_TYPE', wardShiftTypeId: 3, label: 'N'},
    ],
    DAY_OF_WEEK: [
        {type: 'DAY_OF_WEEK', code: 'MON', label: '월'},
        {type: 'DAY_OF_WEEK', code: 'TUE', label: '화'},
        {type: 'DAY_OF_WEEK', code: 'WED', label: '수'},
        {type: 'DAY_OF_WEEK', code: 'THU', label: '목'},
        {type: 'DAY_OF_WEEK', code: 'FRI', label: '금'},
        {type: 'DAY_OF_WEEK', code: 'SAT', label: '토'},
        {type: 'DAY_OF_WEEK', code: 'SUN', label: '일'},
    ],
};

const MOCK_TEMPLATES: TShiftConstraintTemplate[] = [
    {
        templateCode: 'MAX_CONSECUTIVE_WORK_DAYS',
        category: 'WORK_REST',
        displayTemplate: '연속 근무일은 최대 {maxDays}일',
        severity: 'HARD',
        allowedSeverities: ['HARD', 'SOFT'],
        supportedInGenerator: true,
        supportedInValidator: true,
        slots: [{key: 'maxDays', label: '최대', inputType: 'NUMBER', min: 2, max: 10, required: true}],
    },
    {
        templateCode: 'MIN_OFF_AFTER_NIGHT',
        category: 'WORK_REST',
        displayTemplate: '나이트 이후 최소 {minOffDays}일 OFF',
        severity: 'SOFT',
        allowedSeverities: ['HARD', 'SOFT'],
        supportedInGenerator: true,
        supportedInValidator: true,
        slots: [{key: 'minOffDays', label: '최소', inputType: 'NUMBER', min: 1, max: 3, required: true}],
    },
    {
        templateCode: 'NO_SHIFT_ON_WEEKDAY',
        category: 'FORBIDDEN_PATTERN',
        displayTemplate: '{weekday}에는 {shiftType} 배정하지 않기',
        severity: 'SOFT',
        allowedSeverities: ['HARD', 'SOFT'],
        supportedInGenerator: true,
        supportedInValidator: true,
        slots: [
            {key: 'weekday', label: '요일', inputType: 'SELECT', optionGroup: 'DAY_OF_WEEK', required: true},
            {key: 'shiftType', label: '근무', inputType: 'SELECT', optionGroup: 'SHIFT_TYPE', required: true},
        ],
    },
];

function getMockCandidates(wardId: number, shiftTeamId: number): TShiftConstraintRuleCandidatesResponse {
    return {
        schemaVersion: MOCK_SCHEMA_VERSION,
        wardId,
        shiftTeamId,
        options: MOCK_OPTIONS,
        templates: MOCK_TEMPLATES,
    };
}

function getMockRules(wardId: number, shiftTeamId: number): TShiftConstraintRulesResponse {
    return {
        schemaVersion: MOCK_SCHEMA_VERSION,
        wardId,
        shiftTeamId,
        rules: [
            {
                shiftConstraintRuleId: 90001,
                templateCode: 'MAX_CONSECUTIVE_WORK_DAYS',
                category: 'WORK_REST',
                severity: 'HARD',
                sortOrder: 1,
                params: {maxDays: 5},
                displayText: '연속 근무일은 최대 5일',
                isValid: true,
                invalidReason: null,
            },
        ],
    };
}

export const shiftConstraintRuleQueryKeys = {
    all: () => ['shiftConstraintRules'] as const,
    candidates: (wardId: number, shiftTeamId: number) =>
        [...shiftConstraintRuleQueryKeys.all(), 'candidates', wardId, shiftTeamId] as const,
    rules: (wardId: number, shiftTeamId: number) => [...shiftConstraintRuleQueryKeys.all(), 'rules', wardId, shiftTeamId] as const,
};

export const getShiftConstraintRuleCandidates = async (wardId: number, shiftTeamId: number) => {
    return getMockCandidates(wardId, shiftTeamId);
};

export const getShiftConstraintRules = async (wardId: number, shiftTeamId: number) => {
    return getMockRules(wardId, shiftTeamId);
};

export const putShiftConstraintRules = async (wardId: number, shiftTeamId: number, payload: TShiftConstraintRulesSavePayload) => {
    return {
        schemaVersion: MOCK_SCHEMA_VERSION,
        wardId,
        shiftTeamId,
        rules: payload.rules.map((rule, index) => ({
            shiftConstraintRuleId: rule.shiftConstraintRuleId ?? 91000 + index,
            templateCode: rule.templateCode,
            category: MOCK_TEMPLATES.find((template) => template.templateCode === rule.templateCode)?.category ?? 'CORE',
            severity: rule.severity,
            sortOrder: rule.sortOrder,
            params: rule.params,
            isValid: true,
            invalidReason: null,
        })),
    };
};
