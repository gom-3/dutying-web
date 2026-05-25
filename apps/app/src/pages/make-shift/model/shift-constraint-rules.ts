import type {TShiftConstraintRuleCandidatesResponse, TShiftConstraintSeverity} from '@dutying/api/ward';
import {WardAPI} from '@/shared/api';

export type {
    TShiftConstraintOption,
    TShiftConstraintOptions,
    TShiftConstraintRuleCandidatesResponse,
    TShiftConstraintSeverity,
    TShiftConstraintSlot,
    TShiftConstraintTemplate,
} from '@dutying/api/ward';

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

function getMockRules(wardId: number, shiftTeamId: number): TShiftConstraintRulesResponse {
    return {
        schemaVersion: MOCK_SCHEMA_VERSION,
        wardId,
        shiftTeamId,
        rules: [],
    };
}

export const shiftConstraintRuleQueryKeys = {
    all: () => ['shiftConstraintRules'] as const,
    candidates: (wardId: number, shiftTeamId: number) =>
        [...shiftConstraintRuleQueryKeys.all(), 'candidates', wardId, shiftTeamId] as const,
    rules: (wardId: number, shiftTeamId: number) => [...shiftConstraintRuleQueryKeys.all(), 'rules', wardId, shiftTeamId] as const,
};

export const getShiftConstraintRuleCandidates = async (
    wardId: number,
    shiftTeamId: number,
): Promise<TShiftConstraintRuleCandidatesResponse> => WardAPI.getShiftConstraintRuleCandidates(wardId, shiftTeamId);

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
            category: 'CORE',
            severity: rule.severity,
            sortOrder: rule.sortOrder,
            params: rule.params,
            isValid: true,
            invalidReason: null,
        })),
    };
};
