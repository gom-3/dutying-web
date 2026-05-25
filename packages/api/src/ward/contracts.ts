import type {
    TDay,
    TDutyRequest,
    TRequestShift,
    TShift,
    TShiftNurse,
    TShiftTeam,
    TWaitingNurse,
    TWard,
    TWardConstraint,
    TWardShiftClassification,
    TWardShiftType,
} from '@dutying/domain';
import type {TNurseResponse, TUpdateNurseDTO} from '../nurse';

export type TWaitingNurseResponse = TWaitingNurse;
export type TWardConstraintResponse = TWardConstraint;
export type TWardShiftTypeResponse = TWardShiftType;
export type TShiftTeamResponse = TShiftTeam;
export type TWardResponse = TWard;
export type TShiftNurseResponse = TShiftNurse;
export type TDayResponse = TDay;
export type TShiftResponse = TShift;
export type TRequestShiftResponse = TRequestShift;
export type TDutyRequestResponse = TDutyRequest;

export type TWardChatMessageResponse = {
    messageId: number;
    moimId: number;
    wardId: number;
    senderAccountId: number;
    senderName: string;
    text: string;
    sentAt: string;
    isDeleted: boolean;
};

export type TWardChatMessagesResponse = {
    messages: TWardChatMessageResponse[];
    nextCursorMessageId: number | null;
    lastReadMessageId: number | null;
    unreadCount: number;
};

export type TWardChatUnreadCountResponse = {
    moimId: number;
    wardId: number;
    unreadCount: number;
};

export type TWardChatMessageListOptions = {
    cursorMessageId?: number;
    size?: number;
};

export type TCreateWardChatMessageDTO = {
    text: string;
    clientMessageId: string;
};

export type TReadWardChatDTO = {
    lastReadMessageId: number;
};

export type TShiftConstraintSeverity = 'HARD' | 'SOFT';

export type TShiftConstraintOption = {
    type: string;
    label?: string;
    nurseId?: number;
    name?: string;
    wardShiftTypeId?: number;
    code?: string;
    day?: number;
    level?: number;
    proficiency?: number;
    isPreceptor?: boolean;
    isPreceptee?: boolean;
};

export type TShiftConstraintOptions = Record<string, TShiftConstraintOption[]>;

export type TShiftConstraintSlot = {
    key: string;
    label: string;
    inputType: string;
    optionGroup?: string;
    required?: boolean;
    min?: number | null;
    max?: number | null;
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

export type TShiftConstraintRuleCandidatesResponse = {
    schemaVersion: number;
    wardId: number;
    shiftTeamId: number;
    options: TShiftConstraintOptions;
    templates: TShiftConstraintTemplate[];
};

export type TAiConstraintViolationPeriod = {
    start_day: number;
    end_day: number;
    start_date?: string;
    end_date?: string;
    label?: string;
};

/** LLM generate API `validation.*_constraints_violated` 항목 (dev/prod 공통 확장 필드) */
export type TAiConstraintViolation = {
    id: string;
    type?: string;
    severity: 'HARD' | 'SOFT';
    constraint?: string;
    title?: string;
    message: string;
    rule?: string;
    nurse_id?: string | null;
    nurse_name?: string | null;
    shift?: string;
    period?: TAiConstraintViolationPeriod;
    affected_days?: number[];
    detected_day?: number;
};

export type TAiValidation = {
    valid: boolean;
    hard_constraints_violated: TAiConstraintViolation[];
    soft_constraints_violated: TAiConstraintViolation[];
    warnings: string[];
};

export type TAiMetrics = {
    night_shift_counts: Record<string, number>;
    weekend_shift_counts: Record<string, number>;
    fairness_score: number;
    satisfaction_estimate: number;
    constraint_violations: number;
    revision_estimate: number;
};

export type TAiScheduleResponse = {
    generation_id: number;
    schedule: Record<string, string[]>;
    validation: TAiValidation;
    metrics: TAiMetrics;
    explainable_reasons: string[];
    status: string;
    llm_model: string;
    generation_time_ms: number;
    created_at: string;
};

export interface IWardAPI {
    getWard: (wardId: number) => Promise<TWardResponse>;
    getWardConstraint: (wardId: number, shiftTeamId: number) => Promise<TWardConstraintResponse>;
    getShiftConstraintRuleCandidates: (wardId: number, shiftTeamId: number) => Promise<TShiftConstraintRuleCandidatesResponse>;
    getWardByCode: (code: string) => Promise<TWardResponse>;
    getWaitingNurses: (wardId: number) => Promise<TWaitingNurseResponse[]>;
    createWard: (createWardDTO: TCreateWardDTO) => Promise<TWardResponse>;
    addMeToWaitingNurses: (wardId: number) => Promise<void>;
    connectWaitingNurses: (wardId: number, waitingNurseId: number, targetNurseId: number) => Promise<void>;
    approveWaitingNurses: (wardId: number, waitingNurseId: number, shiftTeamId: number) => Promise<void>;
    editWard: (wardId: number, ward: TEditWardDTO) => Promise<TWardResponse>;
    updateWardConstraint: (wardId: number, shiftTeamId: number, constraint: TWardConstraintDTO) => Promise<TWardConstraintResponse>;
    deleteWaitingNurses: (wardId: number, nurseId: number) => Promise<void>;
    quitWard: (wardId: number) => Promise<void>;
    getWardChatMessages: (wardId: number, options?: TWardChatMessageListOptions) => Promise<TWardChatMessagesResponse>;
    createWardChatMessage: (wardId: number, message: TCreateWardChatMessageDTO) => Promise<TWardChatMessageResponse>;
    readWardChat: (wardId: number, read: TReadWardChatDTO) => Promise<void>;
    getWardChatUnreadCount: (wardId: number) => Promise<TWardChatUnreadCountResponse>;
    getMyWardChatUnreadCounts: () => Promise<TWardChatUnreadCountResponse[]>;
    getReqShift: (wardId: number, shiftTeamId: number, year: number, month: number) => Promise<TRequestShiftResponse>;
    getShift: (wardId: number, shiftTeamId: number, year: number, month: number) => Promise<TShiftResponse>;
    getRequestList: (wardId: number, shiftTeamId: number, year: number, month: number) => Promise<TDutyRequestResponse[]>;
    updateShift: (
        wardId: number,
        year: number,
        month: number,
        day: number,
        shiftNurseId: number,
        wardShiftTypeId: number | null,
    ) => Promise<null>;
    updateShifts: (wardId: number, wardShifts: TWardShiftsDTO) => Promise<void>;
    updateReqShift: (
        wardId: number,
        year: number,
        month: number,
        day: number,
        shiftNurseId: number,
        wardShiftTypeId: number | null,
    ) => Promise<void>;
    acceptRequestShift: (wardId: number, reqShiftId: number, isAccepted: boolean | null) => Promise<void>;
    postShift: (wardId: number, shiftTeamId: number, year: number, month: number) => Promise<void>;
    getShiftTeamNurses: (wardId: number, shiftTeamId: number) => Promise<TNurseResponse[]>;
    getShiftTeams: (wardId: number) => Promise<TShiftTeamResponse[]>;
    addNurseIntoShiftTeam: (wardId: number, shiftTeamId: number, addShiftTeamNurseDTO: TUpdateNurseDTO) => Promise<TNurseResponse>;
    createShiftTeam: (wardId: number) => Promise<TShiftTeamResponse>;
    buildShiftTeam: (wardId: number, shiftTeamId: number, year: number, month: number) => Promise<TShiftTeamResponse>;
    updateShiftTeam: (wardId: number, shiftTeamId: number, updateShiftTeamDTO: TUpdateShiftTeamDTO) => Promise<TShiftTeamResponse>;
    removeNurseFromShiftTeam: (wardId: number, shiftTeamId: number, nurseId: number) => Promise<TNurseResponse>;
    deleteShiftTeam: (wardId: number, shiftTeamId: number) => Promise<TShiftTeamResponse>;
    getShiftTypes: (wardId: number) => Promise<TWardShiftTypeResponse[]>;
    createShiftType: (wardId: number, createShiftTypeDTO: TCreateShiftTypeDTO) => Promise<TWardShiftTypeResponse>;
    updateShiftType: (wardId: number, shiftTypeId: number, createShiftTypeDTO: TCreateShiftTypeDTO) => Promise<TWardShiftTypeResponse>;
    deleteShiftType: (wardId: number, shiftTypeId: number) => Promise<void>;

    /** @deprecated use getWaitingNurses */
    getWatingNurses: (wardId: number) => Promise<TWaitingNurseResponse[]>;
    /** @deprecated use addMeToWaitingNurses */
    addMeToWatingNurses: (wardId: number) => Promise<void>;
    /** @deprecated use connectWaitingNurses */
    connectWatingNurses: (wardId: number, waitingNurseId: number, targetNurseId: number) => Promise<void>;
    /** @deprecated use approveWaitingNurses */
    approveWatingNurses: (wardId: number, waitingNurseId: number, shiftTeamId: number) => Promise<void>;
    /** @deprecated use deleteWaitingNurses */
    deleteWatingNurses: (wardId: number, nurseId: number) => Promise<void>;
}

export type TCreateWardShiftTypeDTO = {
    name: string;
    shortName: string;
    color: string;
    startTime: string;
    endTime: string;
    isOff: boolean;
    isDefault: boolean;
    classification: TWardShiftClassification;
};

export type TCreateWardDTO = {
    name: string;
    hospitalName: string;
    wardShiftTypes: TCreateWardShiftTypeDTO[];
    shiftTeams: {nurseNames: string[]}[];
};

export type TEditWardDTO = {
    name: string;
    hospitalName: string;
};

export type TWardConstraintDTO = TWardConstraintResponse;

export type TWardShiftsDTO = {
    shiftNurseId: number;
    date: string;
    wardShiftTypeId: number | null;
}[];

export type TLlmGenerateScheduleStrategy = 'llm_flash' | 'llm_v1' | 'llm_premium';

export type TLlmGenerateScheduleDTO = {
    shift_team_id: number;
    year_month: string;
    strategy?: TLlmGenerateScheduleStrategy;
};

export type TUpdateShiftTeamDTO = {
    name: string;
};

export type TCreateShiftTypeDTO = {
    name: string;
    shortName: string;
    color: string;
    startTime: string;
    endTime: string;
    isOff: boolean;
    isDefault: boolean;
    isCounted: boolean;
    classification: TWardShiftClassification;
};
