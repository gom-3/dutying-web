import {describe, expect, it} from 'vitest';
import type {TAccount} from '@/entities/account';
import type {TNurse} from '@/entities/nurse';
import type {TWard} from '@/entities/ward';
import {findProfileNurse, getCurrentProfileImage, getProfileDisplayName, isProfileFormDirty} from '../model';

const baseNurse: TNurse = {
    nurseId: 11,
    accountId: 7,
    shiftTeamId: 3,
    wardId: 1,
    name: '홍길동',
    phoneNum: '01012341234',
    isConnected: true,
    nurseShiftTypes: [],
    isWorker: true,
    isDutyManager: false,
    isWardManager: false,
    gender: '여',
    employmentDate: '2023-03-01',
    memo: '',
    isDeleted: false,
    divisionNum: 1,
    priority: 1,
};

describe('ProfilePage model', () => {
    it('현재 로그인한 accountId로 내 nurse 정보를 찾는다', () => {
        const ward: TWard = {
            wardId: 1,
            name: '중환자실',
            hospitalName: '듀티병원',
            code: 'WARD123',
            nurseCnt: 1,
            wardShiftTypes: [],
            shiftTeams: [{shiftTeamId: 3, name: 'A팀', nurseCnt: 1, nurses: [baseNurse]}],
        };

        expect(findProfileNurse(ward, 7)?.nurseId).toBe(11);
        expect(findProfileNurse(ward, 99)).toBeNull();
    });

    it('성별 변경도 저장 가능 상태로 판단한다', () => {
        const draftNurse = {...baseNurse, gender: '남'};

        expect(
            isProfileFormDirty({
                originalNurse: baseNurse,
                draftNurse,
            }),
        ).toBe(true);
    });

    it('새 프로필 이미지가 있으면 폼 변경으로 판단한다', () => {
        expect(
            isProfileFormDirty({
                originalNurse: baseNurse,
                draftNurse: baseNurse,
                profileImg: {defaultProfileImgId: 2},
            }),
        ).toBe(true);
    });

    it('계정 이미지가 없으면 빈 프로필 이미지 값을 돌려준다', () => {
        expect(getCurrentProfileImage(null)).toEqual({});
    });

    it('표시 이름은 nurse 초안, 계정 이름 순으로 fallback 한다', () => {
        const account = {name: '계정 이름'} as TAccount;

        expect(getProfileDisplayName(baseNurse, account)).toBe('홍길동');
        expect(getProfileDisplayName(null, account)).toBe('계정 이름');
        expect(getProfileDisplayName(null, null)).toBe('이름 미등록');
    });

    it('공백 이름은 비어 있는 값으로 보고 다음 fallback 으로 넘긴다', () => {
        const account = {name: '  계정 이름  '} as TAccount;

        expect(getProfileDisplayName({...baseNurse, name: '   '}, account)).toBe('계정 이름');
        expect(getProfileDisplayName({...baseNurse, name: '   '}, {name: '   '} as TAccount)).toBe('이름 미등록');
    });
});
