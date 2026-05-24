export type TAiAutofillStatus = 'idle' | 'loading' | 'success' | 'error';
export type TAiAutofillDescriptionKey =
    | 'page.makeShift.aiRefill.description.idle'
    | 'page.makeShift.aiRefill.description.loading'
    | 'page.makeShift.aiRefill.description.success'
    | 'page.makeShift.aiRefill.description.error';
export type TAiAutofillDraftKey = 'page.makeShift.aiRefill.draft.saved' | 'page.makeShift.aiRefill.draft.none';
export type TAiAutofillStatusDescription = {
    primaryKey: TAiAutofillDescriptionKey;
    draftKey: TAiAutofillDraftKey;
};

export function canConfirmAiAutofill(status: TAiAutofillStatus): boolean {
    return status !== 'loading';
}

export function getAiAutofillStatusTone(status: TAiAutofillStatus): 'neutral' | 'progress' | 'success' | 'danger' {
    switch (status) {
        case 'loading':
            return 'progress';
        case 'success':
            return 'success';
        case 'error':
            return 'danger';
        default:
            return 'neutral';
    }
}

export function getAiAutofillActionLabel(
    status: TAiAutofillStatus,
    hasCompletedAiFill: boolean,
): 'action' | 'retry' | 'generating' | 'firstFill' {
    switch (status) {
        case 'loading':
            return 'generating';
        case 'error':
            return 'retry';
        default:
            return hasCompletedAiFill ? 'action' : 'firstFill';
    }
}

export function getAiAutofillStatusDescription(status: TAiAutofillStatus, hasDraftChanges: boolean): TAiAutofillStatusDescription {
    const draftKey: TAiAutofillDraftKey = hasDraftChanges ? 'page.makeShift.aiRefill.draft.saved' : 'page.makeShift.aiRefill.draft.none';

    switch (status) {
        case 'loading':
            return {primaryKey: 'page.makeShift.aiRefill.description.loading', draftKey};
        case 'success':
            return {primaryKey: 'page.makeShift.aiRefill.description.success', draftKey};
        case 'error':
            return {primaryKey: 'page.makeShift.aiRefill.description.error', draftKey};
        default:
            return {primaryKey: 'page.makeShift.aiRefill.description.idle', draftKey};
    }
}
