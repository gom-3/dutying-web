/** 근무표·근무자 목록 등에서 표시용 이름 (4자 초과 시 말줄임). */
export function formatNurseDisplayName(name: string, maxChars = 4): string {
    const trimmed = name.trim();

    if (trimmed.length <= maxChars) return trimmed;

    return `${trimmed.slice(0, maxChars)}…`;
}
