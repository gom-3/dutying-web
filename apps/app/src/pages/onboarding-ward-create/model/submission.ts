import type {TCreateWardDTO} from '@dutying/api/ward';
import {buildCreateWardPayload} from './adapter';
import type {TOnboardingWardDraft} from './draft';

export type TOnboardingWardCreateSubmission = {
    mode: 'created';
    successMessage: string;
};

export type TOnboardingWardCreateAction = (
    createWardDTO: TCreateWardDTO,
    options?: {
        navigateOnLinked?: boolean;
    },
) => Promise<unknown>;

export type TOnboardingWardCreateExecutor = (draft: TOnboardingWardDraft) => Promise<TOnboardingWardCreateSubmission>;

export const createOnboardingWardCreateExecutor =
    (createWard: TOnboardingWardCreateAction): TOnboardingWardCreateExecutor =>
    async (draft) => {
        const wardCreatePayload = buildCreateWardPayload(draft);

        await createWard(wardCreatePayload, {navigateOnLinked: false});

        return {
            mode: 'created',
            successMessage: '병동 생성을 완료했어요.',
        };
    };
