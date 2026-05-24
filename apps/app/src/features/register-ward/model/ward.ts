import {type TCreateWardDTO} from '@dutying/api/ward';

export const DEFAULT_WARD_SHIFT_TYPES: TCreateWardDTO['wardShiftTypes'] = [
    {
        name: '데이',
        shortName: 'D',
        startTime: '07:00',
        endTime: '15:00',
        color: '#4DC2AD',
        isDefault: true,
        isOff: false,
        classification: 'DAY',
    },
    {
        name: '이브닝',
        shortName: 'E',
        startTime: '15:00',
        endTime: '23:00',
        color: '#FF8BA5',
        isDefault: true,
        isOff: false,
        classification: 'EVENING',
    },
    {
        name: '나이트',
        shortName: 'N',
        startTime: '23:00',
        endTime: '07:00',
        color: '#3580FF',
        isDefault: true,
        isOff: false,
        classification: 'NIGHT',
    },
    {
        name: '오프',
        shortName: 'O',
        startTime: '',
        endTime: '',
        color: '#465B7A',
        isDefault: true,
        isOff: true,
        classification: 'OFF',
    },
];

export function getWardShiftValidationMessage(wardShiftTypes: TCreateWardDTO['wardShiftTypes']) {
    const invalidShiftType = wardShiftTypes.find((shiftType) => {
        if (shiftType.name === '') return true;

        if (!shiftType.isOff && (shiftType.startTime === '' || shiftType.endTime === '')) {
            return true;
        }

        return shiftType.shortName === '';
    });

    if (!invalidShiftType) return null;

    if (invalidShiftType.name === '') {
        return '근무 이름을 입력해주세요.';
    }

    if (!invalidShiftType.isOff && (invalidShiftType.startTime === '' || invalidShiftType.endTime === '')) {
        return `${invalidShiftType.name}근무의 근무 시간을 입력해주세요.`;
    }

    return `${invalidShiftType.name}근무의 근무 약자를 입력해주세요.`;
}
