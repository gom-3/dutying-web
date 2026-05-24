interface IShouldAutoSelectVisibleNurseParams {
    activeShiftTeamId: number | null | undefined;
    isDetailPanelDismissed: boolean;
    selectedShiftTeamId: number | null | undefined;
    visibleNurseCount: number;
}

export function shouldAutoSelectVisibleNurse({
    activeShiftTeamId,
    isDetailPanelDismissed,
    selectedShiftTeamId,
    visibleNurseCount,
}: IShouldAutoSelectVisibleNurseParams) {
    if (isDetailPanelDismissed || !activeShiftTeamId || visibleNurseCount === 0) {
        return false;
    }

    return !selectedShiftTeamId || selectedShiftTeamId !== activeShiftTeamId;
}
