import {groupBy} from 'lodash-es';
import type {TNurse, TWaitingNurse} from '@/entities/nurse';
import type {TShiftTeam} from '@/entities/ward';

export type TConnectionManageStep = 0 | 1 | 2 | 3;
export type TConnectMode = 'link' | 'add';
export type TConnectionManageSubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export const getFormattedPhoneNumber = (phoneNumber: string) =>
    `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;

export const getWaitingNurseSummary = (waitingNurse: TWaitingNurse) => ({
    ...waitingNurse,
    formattedPhoneNumber: getFormattedPhoneNumber(waitingNurse.phoneNum),
});

export const getGroupedDivisionNurses = (nurses: TNurse[]) =>
    Object.entries(groupBy(nurses, 'divisionNum')).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

interface IGetConnectionManageTargetLabelParams {
    connectMode: TConnectMode;
    shiftTeams: TShiftTeam[] | undefined;
    toLinkNurseId: number | null;
    toAddShiftTeamId: number | null;
}

export function getConnectionManageTargetLabel({
    connectMode,
    shiftTeams,
    toLinkNurseId,
    toAddShiftTeamId,
}: IGetConnectionManageTargetLabelParams) {
    if (!shiftTeams) return null;

    if (connectMode === 'link') {
        const targetShiftTeam = shiftTeams.find((shiftTeam) => shiftTeam.nurses.some((nurse) => nurse.nurseId === toLinkNurseId));
        const targetNurse = targetShiftTeam?.nurses.find((nurse) => nurse.nurseId === toLinkNurseId);

        if (!targetShiftTeam || !targetNurse) return null;

        return `${targetNurse.name} · ${targetShiftTeam.name}`;
    }

    return shiftTeams.find((shiftTeam) => shiftTeam.shiftTeamId === toAddShiftTeamId)?.name ?? null;
}

interface IGetConnectionManageResultCopyParams {
    submitStatus: Exclude<TConnectionManageSubmitStatus, 'idle'>;
    connectMode: TConnectMode;
    waitingNurseName?: string;
    targetLabel?: string | null;
}

function getObjectParticle(word: string) {
    const trimmed = word.trim();
    const lastChar = trimmed.charAt(trimmed.length - 1);

    if (!lastChar) return '을';

    const code = lastChar.charCodeAt(0);
    const isHangulSyllable = code >= 0xac00 && code <= 0xd7a3;

    if (!isHangulSyllable) return '을';

    const hasBatchim = (code - 0xac00) % 28 !== 0;

    return hasBatchim ? '을' : '를';
}

function getLinkFailureDescription(targetLabel?: string | null) {
    if (!targetLabel) {
        return '선택한 간호사 계정에 연결하지 못했어요. 다시 시도해 주세요.';
    }

    const [targetNurseName, targetTeamName] = targetLabel.split('·').map((text) => text.trim());

    if (targetNurseName && targetTeamName) {
        return `${targetTeamName}의 ${targetNurseName} 계정에 연결하지 못했어요. 다시 시도해 주세요.`;
    }

    return `${targetLabel} 계정에 연결하지 못했어요. 다시 시도해 주세요.`;
}

export function getConnectionManageResultCopy({
    submitStatus,
    connectMode,
    waitingNurseName,
    targetLabel,
}: IGetConnectionManageResultCopyParams) {
    const safeWaitingNurseName = waitingNurseName ?? '선택한 간호사';
    const safeTargetLabel = targetLabel ?? (connectMode === 'link' ? '선택한 간호사' : '선택한 팀');

    if (submitStatus === 'loading') {
        return {
            title: connectMode === 'link' ? '기존 계정에 연결하고 있어요' : '선택한 팀으로 추가하고 있어요',
            description:
                connectMode === 'link'
                    ? `${safeWaitingNurseName} 신청 정보를 ${safeTargetLabel} 계정에 연결하고 있어요. 잠시만 기다려 주세요.`
                    : `${safeWaitingNurseName}님을 ${safeTargetLabel} 팀으로 추가하고 있어요. 잠시만 기다려 주세요.`,
        };
    }

    if (submitStatus === 'success') {
        return {
            title: connectMode === 'link' ? '기존 계정과 연결했어요' : '팀 추가를 완료했어요',
            description:
                connectMode === 'link'
                    ? `${safeWaitingNurseName} 신청을 ${safeTargetLabel} 계정에 연결했어요.`
                    : `${safeWaitingNurseName}님을 ${safeTargetLabel} 팀에 추가했어요.`,
        };
    }

    return {
        title: connectMode === 'link' ? '기존 계정에 연결하지 못했어요' : '팀에 추가하지 못했어요',
        description:
            connectMode === 'link'
                ? getLinkFailureDescription(targetLabel)
                : `${safeWaitingNurseName}${getObjectParticle(safeWaitingNurseName)} ${safeTargetLabel}에 추가하지 못했어요. 다시 시도해 주세요.`,
    };
}
