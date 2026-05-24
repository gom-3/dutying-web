import {beforeEach, describe, expect, it} from 'vitest';
import {
    createAutoAssignedSkillLevels,
    createWardSkillSettings,
    DEFAULT_SKILL_LEVEL_CONFIG,
    getWardSkillSettings,
    getWardSkillSettingsStorageKey,
    resolveWardSkillLevels,
    saveWardSkillSettings,
} from '../skill-level';

const nurses = [
    {nurseId: 10, employmentDate: '2019-03-01'},
    {nurseId: 11, employmentDate: '2021-08-01'},
    {nurseId: 12, employmentDate: '2023-01-15'},
];

describe('skill-level', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('근속 순으로 숙련도를 자동 배정해야 한다', () => {
        const levels = createAutoAssignedSkillLevels(nurses, DEFAULT_SKILL_LEVEL_CONFIG);

        expect(levels).toEqual({
            10: 5,
            11: 3,
            12: 1,
        });
    });

    it('자동 배정이 꺼지면 현재 숙련도 결과를 고정 저장해야 한다', () => {
        const settings = createWardSkillSettings(
            nurses,
            {
                levelCount: 4,
                paletteId: 'cool',
                autoAssign: false,
            },
            {
                config: DEFAULT_SKILL_LEVEL_CONFIG,
                frozenLevelsByNurseId: {},
            },
        );

        expect(settings).toEqual({
            config: {
                levelCount: 4,
                paletteId: 'cool',
                autoAssign: false,
            },
            frozenLevelsByNurseId: {
                10: 4,
                11: 3,
                12: 1,
            },
        });
    });

    it('고정 저장된 숙련도를 다시 읽어야 한다', () => {
        const settings = {
            config: {
                levelCount: 3,
                paletteId: 'violet',
                autoAssign: false,
            },
            frozenLevelsByNurseId: {
                10: 3,
                11: 2,
                12: 1,
            },
        };

        expect(resolveWardSkillLevels(nurses, settings)).toEqual({
            config: settings.config,
            levelsByNurseId: settings.frozenLevelsByNurseId,
        });
    });

    it('고정 저장에 없는 간호사는 최저 숙련도로 처리해야 한다', () => {
        const settings = {
            config: {
                levelCount: 4,
                paletteId: 'cool',
                autoAssign: false,
            },
            frozenLevelsByNurseId: {
                10: 4,
                11: 2,
            },
        };

        expect(resolveWardSkillLevels(nurses, settings)).toEqual({
            config: settings.config,
            levelsByNurseId: {
                10: 4,
                11: 2,
                12: 1,
            },
        });
    });

    it('브라우저 저장소에 병동별 숙련도 설정을 저장하고 읽어야 한다', () => {
        const settings = {
            config: {
                levelCount: 4,
                paletteId: 'cool',
                autoAssign: false,
            },
            frozenLevelsByNurseId: {
                10: 4,
                11: 2,
            },
        };

        saveWardSkillSettings(7, settings);

        expect(getWardSkillSettings(7)).toEqual(settings);
        expect(window.localStorage.getItem(getWardSkillSettingsStorageKey())).not.toBeNull();
    });
});
