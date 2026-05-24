import {groupBy} from 'lodash-es';
import type {TNurse} from '@/entities/nurse';
import type {TShiftTeam} from '@/entities/ward';

export type TGroupedDivisionNurses = [string, TNurse[]][];

export type TEditShiftTeamState = {
    shiftTeamId: number;
    updateShiftTeamDTO: {
        name: string;
    };
} | null;

type TKeyboardDirection = 'ArrowUp' | 'ArrowDown';

type TMoveNurseOrderPayload = {
    nurseId: number;
    sourceShiftTeamId: number;
    destinationShiftTeamId: number;
    divisionNum: number;
    prevPriority: number;
    nextPriority: number;
};

const DIVISION_PRIORITY_GAP = 2024;

export const getGroupedDivisionNurses = (nurses: TNurse[]): TGroupedDivisionNurses =>
    Object.entries(groupBy(nurses, 'divisionNum')).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

const getPreviousShiftTeamNurseId = (shiftTeams: TShiftTeam[], selectedShiftTeamIndex: number) => {
    for (let teamIndex = selectedShiftTeamIndex - 1; teamIndex >= 0; teamIndex -= 1) {
        const previousNurseId = shiftTeams[teamIndex].nurses[shiftTeams[teamIndex].nurses.length - 1]?.nurseId;

        if (previousNurseId != null) return previousNurseId;
    }

    return null;
};
const getNextShiftTeamNurseId = (shiftTeams: TShiftTeam[], selectedShiftTeamIndex: number) => {
    for (let teamIndex = selectedShiftTeamIndex + 1; teamIndex < shiftTeams.length; teamIndex += 1) {
        const nextNurseId = shiftTeams[teamIndex].nurses[0]?.nurseId;

        if (nextNurseId != null) return nextNurseId;
    }

    return null;
};

export const getNextSelectedNurseId = (shiftTeams: TShiftTeam[], selectedNurse: TNurse, direction: TKeyboardDirection): number | null => {
    const selectedShiftTeamIndex = shiftTeams.findIndex((shiftTeam) =>
        shiftTeam.nurses.some((nurse) => nurse.nurseId === selectedNurse.nurseId),
    );

    if (selectedShiftTeamIndex === -1) return null;

    const groupedNurses = getGroupedDivisionNurses(shiftTeams[selectedShiftTeamIndex].nurses);
    const selectedGroupIndex = groupedNurses.findIndex(([, nurses]) => nurses.some((nurse) => nurse.nurseId === selectedNurse.nurseId));

    if (selectedGroupIndex === -1) return null;

    const selectedGroup = groupedNurses[selectedGroupIndex][1];
    const selectedNurseIndex = selectedGroup.findIndex((nurse) => nurse.nurseId === selectedNurse.nurseId);

    if (selectedNurseIndex === -1) return null;

    if (direction === 'ArrowUp') {
        if (selectedNurseIndex > 0) {
            return selectedGroup[selectedNurseIndex - 1].nurseId;
        }

        if (selectedGroupIndex > 0) {
            const previousGroup = groupedNurses[selectedGroupIndex - 1][1];

            return previousGroup[previousGroup.length - 1].nurseId;
        }

        return getPreviousShiftTeamNurseId(shiftTeams, selectedShiftTeamIndex);
    }

    if (selectedNurseIndex < selectedGroup.length - 1) {
        return selectedGroup[selectedNurseIndex + 1].nurseId;
    }

    if (selectedGroupIndex < groupedNurses.length - 1) {
        return groupedNurses[selectedGroupIndex + 1][1][0]?.nurseId ?? null;
    }

    return getNextShiftTeamNurseId(shiftTeams, selectedShiftTeamIndex);
};

export const createMoveNurseOrderPayload = ({
    shiftTeams,
    sourceDroppableId,
    destinationDroppableId,
    destinationIndex,
    sourceIndex,
    draggableId,
}: {
    shiftTeams: TShiftTeam[];
    sourceDroppableId: string;
    destinationDroppableId: string;
    destinationIndex: number;
    sourceIndex: number;
    draggableId: string;
}): TMoveNurseOrderPayload | null => {
    if (sourceDroppableId === destinationDroppableId && destinationIndex === sourceIndex) return null;

    const [sourceShiftTeamIdText] = sourceDroppableId.split(',');
    const [destinationShiftTeamIdText, destinationDivisionText] = destinationDroppableId.split(',');
    const sourceShiftTeamId = parseInt(sourceShiftTeamIdText);
    const destinationShiftTeamId = parseInt(destinationShiftTeamIdText);
    const destinationDivision = parseInt(destinationDivisionText);
    const destinationShiftTeam = shiftTeams.find((shiftTeam) => shiftTeam.shiftTeamId === destinationShiftTeamId);
    const sourceShiftTeam = shiftTeams.find((shiftTeam) => shiftTeam.shiftTeamId === sourceShiftTeamId);

    if (!destinationShiftTeam || !sourceShiftTeam) return null;

    const destinationDivisionNurses = groupBy(destinationShiftTeam.nurses, 'divisionNum')[destinationDivisionText] ?? [];
    const draggedNurse = sourceShiftTeam.nurses.find((nurse) => nurse.nurseId === parseInt(draggableId));

    if (!draggedNurse) return null;

    if (
        destinationDroppableId === sourceDroppableId &&
        destinationDivisionNurses.findIndex((nurse) => nurse.nurseId === draggedNurse.nurseId) < destinationIndex
    ) {
        return {
            nurseId: draggedNurse.nurseId,
            sourceShiftTeamId,
            destinationShiftTeamId,
            divisionNum: destinationDivision,
            prevPriority: destinationIndex === 0 ? 0 : destinationDivisionNurses[destinationIndex].priority,
            nextPriority:
                destinationIndex === destinationDivisionNurses.length - 1
                    ? destinationDivisionNurses[destinationIndex].priority + DIVISION_PRIORITY_GAP
                    : destinationDivisionNurses[destinationIndex + 1].priority,
        };
    }

    if (destinationDivision === 0) {
        return {
            nurseId: draggedNurse.nurseId,
            sourceShiftTeamId,
            destinationShiftTeamId,
            divisionNum: 1,
            prevPriority: 0,
            nextPriority: DIVISION_PRIORITY_GAP,
        };
    }

    return {
        nurseId: draggedNurse.nurseId,
        sourceShiftTeamId,
        destinationShiftTeamId,
        divisionNum: destinationDivision,
        prevPriority: destinationIndex === 0 ? 0 : destinationDivisionNurses[destinationIndex - 1].priority,
        nextPriority:
            destinationIndex === destinationDivisionNurses.length
                ? destinationDivisionNurses[destinationIndex - 1].priority + DIVISION_PRIORITY_GAP
                : destinationDivisionNurses[destinationIndex].priority,
    };
};
