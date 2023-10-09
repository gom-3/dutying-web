export const demo1 = {
  lastDays: [
    {
      day: 28,
      dayType: 'workday',
    },
    {
      day: 29,
      dayType: 'saturday',
    },
    {
      day: 30,
      dayType: 'sunday',
    },
    {
      day: 31,
      dayType: 'workday',
    },
  ],
  days: [
    {
      day: 1,
      dayType: 'workday',
    },
    {
      day: 2,
      dayType: 'workday',
    },
    {
      day: 3,
      dayType: 'workday',
    },
    {
      day: 4,
      dayType: 'workday',
    },
    {
      day: 5,
      dayType: 'saturday',
    },
    {
      day: 6,
      dayType: 'sunday',
    },
    {
      day: 7,
      dayType: 'workday',
    },
    {
      day: 8,
      dayType: 'workday',
    },
    {
      day: 9,
      dayType: 'workday',
    },
    {
      day: 10,
      dayType: 'workday',
    },
    {
      day: 11,
      dayType: 'workday',
    },
    {
      day: 12,
      dayType: 'saturday',
    },
    {
      day: 13,
      dayType: 'sunday',
    },
    {
      day: 14,
      dayType: 'workday',
    },
    {
      day: 15,
      dayType: 'holiday',
    },
    {
      day: 16,
      dayType: 'workday',
    },
    {
      day: 17,
      dayType: 'workday',
    },
    {
      day: 18,
      dayType: 'workday',
    },
    {
      day: 19,
      dayType: 'saturday',
    },
    {
      day: 20,
      dayType: 'sunday',
    },
    {
      day: 21,
      dayType: 'workday',
    },
    {
      day: 22,
      dayType: 'workday',
    },
    {
      day: 23,
      dayType: 'workday',
    },
    {
      day: 24,
      dayType: 'workday',
    },
    {
      day: 25,
      dayType: 'workday',
    },
    {
      day: 26,
      dayType: 'saturday',
    },
    {
      day: 27,
      dayType: 'sunday',
    },
    {
      day: 28,
      dayType: 'workday',
    },
    {
      day: 29,
      dayType: 'workday',
    },
    {
      day: 30,
      dayType: 'workday',
    },
    {
      day: 31,
      dayType: 'workday',
    },
  ],
  wardShiftTypes: [
    {
      wardShiftTypeId: 1,
      name: '데이',
      shortName: 'D',
      startTime: '07:00',
      endTime: '15:00',
      backgroundColor: '#04dcad',
      isOff: false,
      isDefault: true,
    },
    {
      wardShiftTypeId: 2,
      name: '이브닝',
      shortName: 'E',
      startTime: '17:00',
      endTime: '22:00',
      backgroundColor: '#ff8ba5',
      isOff: false,
      isDefault: true,
    },
    {
      wardShiftTypeId: 3,
      name: '나이트',
      shortName: 'N',
      startTime: '22:00',
      endTime: '07:00',
      backgroundColor: '#3580ff',
      isOff: false,
      isDefault: true,
    },
    {
      wardShiftTypeId: 4,
      name: '오프',
      shortName: 'O',
      startTime: null,
      endTime: null,
      backgroundColor: '#465b7a',
      isOff: true,
      isDefault: true,
    },
  ],
  divisionShiftNurses: [
    [
      {
        shiftNurse: {
          shiftNurseId: 90,
          name: '오지현',
          priority: 1024,
          carried: 0,
          divisionNum: 1,
          isWorker: true,
          nurseId: 27,
        },
        lastWardShiftList: [2, 3, 3, 3],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          4, 4, 4, 2, 2, 2, 2, 4, 1, 1, 1, 1, 4, 4, 3, 3, 3, 4, 4, 1, 1, 1, 2, 4, 4, 3, 3, 3, 4, 4,
          2,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 92,
          name: '윤정은',
          priority: 2048,
          carried: 0,
          divisionNum: 1,
          isWorker: true,
          nurseId: 28,
        },
        lastWardShiftList: [1, 2, 3, 3],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          4, 4, 1, 1, 3, 3, 4, 4, 3, 3, 3, 4, 4, 1, 1, 2, 2, 4, 4, 2, 2, 2, 4, 1, 1, 1, 1, 4, 4, 2,
          3,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 94,
          name: '유미현',
          priority: 3072,
          carried: 0,
          divisionNum: 1,
          isWorker: true,
          nurseId: 29,
        },
        lastWardShiftList: [4, 4, 1, 1],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          1, 1, 2, 4, 1, 1, 3, 3, 4, 4, 2, 2, 2, 4, 4, 1, 1, 1, 1, 4, 3, 3, 4, 4, 4, 2, 2, 4, 3, 3,
          4,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
    ],
    [
      {
        shiftNurse: {
          shiftNurseId: 96,
          name: '김주연',
          priority: 4096,
          carried: 0,
          divisionNum: 2,
          isWorker: true,
          nurseId: 30,
        },
        lastWardShiftList: [4, 4, 2, 3],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          3, 3, 3, 4, 4, 4, 1, 1, 1, 2, 4, 4, 1, 2, 2, 2, 4, 3, 3, 3, 4, 4, 1, 2, 2, 4, 4, 2, 2, 4,
          1,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 98,
          name: '유아영',
          priority: 5120,
          carried: 0,
          divisionNum: 2,
          isWorker: true,
          nurseId: 31,
        },
        lastWardShiftList: [4, 1, 2, 2],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          2, 2, 4, 4, 4, 1, 1, 2, 2, 4, 1, 3, 3, 3, 4, 4, 1, 2, 2, 2, 4, 4, 3, 3, 3, 4, 4, 1, 1, 1,
          4,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 100,
          name: '이성희',
          priority: 6144,
          carried: 0,
          divisionNum: 2,
          isWorker: true,
          nurseId: 32,
        },
        lastWardShiftList: [4, 1, 2, 3],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          3, 4, 4, 4, 3, 3, 4, 4, 2, 2, 4, 1, 2, 2, 2, 4, 4, 4, 3, 3, 4, 4, 1, 2, 2, 2, 4, 1, 1, 1,
          1,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 102,
          name: '김지은',
          priority: 7168,
          carried: 0,
          divisionNum: 2,
          isWorker: true,
          nurseId: 33,
        },
        lastWardShiftList: [4, 4, 1, 1],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          1, 1, 4, 2, 2, 2, 2, 4, 4, 1, 1, 4, 4, 1, 3, 3, 3, 4, 4, 1, 2, 2, 2, 4, 4, 3, 3, 3, 4, 4,
          2,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
    ],
    [
      {
        shiftNurse: {
          shiftNurseId: 104,
          name: '양가연',
          priority: 8192,
          carried: 0,
          divisionNum: 3,
          isWorker: true,
          nurseId: 34,
        },
        lastWardShiftList: [1, 2, 2, 2],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          4, 4, 2, 3, 3, 4, 4, 2, 2, 2, 4, 3, 3, 3, 4, 4, 1, 1, 1, 4, 4, 2, 2, 2, 4, 1, 1, 1, 1, 4,
          3,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 106,
          name: '박보람',
          priority: 9216,
          carried: 0,
          divisionNum: 3,
          isWorker: true,
          nurseId: 35,
        },
        lastWardShiftList: [4, 4, 1, 2],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          2, 2, 4, 1, 1, 4, 1, 1, 3, 3, 3, 4, 4, 1, 1, 1, 4, 2, 2, 2, 4, 4, 3, 3, 3, 4, 4, 2, 2, 2,
          4,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 108,
          name: '김현아',
          priority: 10240,
          carried: 0,
          divisionNum: 3,
          isWorker: true,
          nurseId: 36,
        },
        lastWardShiftList: [2, 3, 3, 4],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          4, 2, 2, 2, 2, 4, 3, 3, 4, 4, 2, 2, 2, 4, 1, 3, 3, 3, 4, 4, 1, 1, 1, 3, 3, 4, 4, 4, 1, 1,
          1,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 110,
          name: '김예림',
          priority: 11264,
          carried: 0,
          divisionNum: 3,
          isWorker: true,
          nurseId: 37,
        },
        lastWardShiftList: [2, 2, 2, 4],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          4, 3, 3, 3, 4, 4, 1, 1, 1, 1, 4, 4, 2, 2, 2, 2, 4, 4, 2, 3, 3, 4, 4, 1, 1, 3, 3, 4, 4, 2,
          2,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 112,
          name: '박초빈',
          priority: 12288,
          carried: 0,
          divisionNum: 3,
          isWorker: true,
          nurseId: 38,
        },
        lastWardShiftList: [1, 2, 2, 2],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          2, 4, 1, 1, 1, 4, 3, 3, 3, 4, 4, 4, 1, 4, 4, 2, 2, 2, 4, 1, 2, 3, 3, 4, 4, 4, 2, 2, 3, 3,
          4,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
    ],
    [
      {
        shiftNurse: {
          shiftNurseId: 114,
          name: '오종욱',
          priority: 13312,
          carried: 0,
          divisionNum: 4,
          isWorker: true,
          nurseId: 39,
        },
        lastWardShiftList: [4, 4, 1, 1],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          1, 1, 1, 4, 4, 2, 2, 2, 4, 4, 2, 2, 3, 3, 3, 4, 4, 1, 1, 4, 3, 3, 4, 4, 1, 1, 1, 4, 2, 3,
          3,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 116,
          name: '이지영',
          priority: 14336,
          carried: 0,
          divisionNum: 4,
          isWorker: true,
          nurseId: 40,
        },
        lastWardShiftList: [2, 4, 4, 2],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          3, 3, 3, 4, 4, 1, 2, 2, 4, 3, 3, 4, 4, 1, 4, 1, 2, 2, 4, 4, 1, 1, 1, 1, 4, 2, 2, 3, 3, 4,
          4,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          4,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
    ],
  ],
} as Shift;

export const blank = {
  lastDays: [
    {
      day: 28,
      dayType: 'workday',
    },
    {
      day: 29,
      dayType: 'saturday',
    },
    {
      day: 30,
      dayType: 'sunday',
    },
    {
      day: 31,
      dayType: 'workday',
    },
  ],
  days: [
    {
      day: 1,
      dayType: 'workday',
    },
    {
      day: 2,
      dayType: 'workday',
    },
    {
      day: 3,
      dayType: 'workday',
    },
    {
      day: 4,
      dayType: 'workday',
    },
    {
      day: 5,
      dayType: 'saturday',
    },
    {
      day: 6,
      dayType: 'sunday',
    },
    {
      day: 7,
      dayType: 'workday',
    },
    {
      day: 8,
      dayType: 'workday',
    },
    {
      day: 9,
      dayType: 'workday',
    },
    {
      day: 10,
      dayType: 'workday',
    },
    {
      day: 11,
      dayType: 'workday',
    },
    {
      day: 12,
      dayType: 'saturday',
    },
    {
      day: 13,
      dayType: 'sunday',
    },
    {
      day: 14,
      dayType: 'workday',
    },
    {
      day: 15,
      dayType: 'holiday',
    },
    {
      day: 16,
      dayType: 'workday',
    },
    {
      day: 17,
      dayType: 'workday',
    },
    {
      day: 18,
      dayType: 'workday',
    },
    {
      day: 19,
      dayType: 'saturday',
    },
    {
      day: 20,
      dayType: 'sunday',
    },
    {
      day: 21,
      dayType: 'workday',
    },
    {
      day: 22,
      dayType: 'workday',
    },
    {
      day: 23,
      dayType: 'workday',
    },
    {
      day: 24,
      dayType: 'workday',
    },
    {
      day: 25,
      dayType: 'workday',
    },
    {
      day: 26,
      dayType: 'saturday',
    },
    {
      day: 27,
      dayType: 'sunday',
    },
    {
      day: 28,
      dayType: 'workday',
    },
    {
      day: 29,
      dayType: 'workday',
    },
    {
      day: 30,
      dayType: 'workday',
    },
    {
      day: 31,
      dayType: 'workday',
    },
  ],
  wardShiftTypes: [
    {
      wardShiftTypeId: 1,
      name: '데이',
      shortName: 'D',
      startTime: '07:00',
      endTime: '15:00',
      backgroundColor: '#04dcad',
      isOff: false,
      isDefault: true,
    },
    {
      wardShiftTypeId: 2,
      name: '이브닝',
      shortName: 'E',
      startTime: '17:00',
      endTime: '22:00',
      backgroundColor: '#ff8ba5',
      isOff: false,
      isDefault: true,
    },
    {
      wardShiftTypeId: 3,
      name: '나이트',
      shortName: 'N',
      startTime: '22:00',
      endTime: '07:00',
      backgroundColor: '#3580ff',
      isOff: false,
      isDefault: true,
    },
    {
      wardShiftTypeId: 4,
      name: '오프',
      shortName: 'O',
      startTime: null,
      endTime: null,
      backgroundColor: '#465b7a',
      isOff: true,
      isDefault: true,
    },
  ],
  divisionShiftNurses: [
    [
      {
        shiftNurse: {
          shiftNurseId: 90,
          name: '오지현',
          priority: 1024,
          carried: 0,
          divisionNum: 1,
          isWorker: true,
          nurseId: 27,
        },
        lastWardShiftList: [2, 3, 3, 3],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 92,
          name: '윤정은',
          priority: 2048,
          carried: 0,
          divisionNum: 1,
          isWorker: true,
          nurseId: 28,
        },
        lastWardShiftList: [1, 2, 3, 3],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 94,
          name: '유미현',
          priority: 3072,
          carried: 0,
          divisionNum: 1,
          isWorker: true,
          nurseId: 29,
        },
        lastWardShiftList: [4, 4, 1, 1],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
    ],
    [
      {
        shiftNurse: {
          shiftNurseId: 96,
          name: '김주연',
          priority: 4096,
          carried: 0,
          divisionNum: 2,
          isWorker: true,
          nurseId: 30,
        },
        lastWardShiftList: [4, 4, 2, 3],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 98,
          name: '유아영',
          priority: 5120,
          carried: 0,
          divisionNum: 2,
          isWorker: true,
          nurseId: 31,
        },
        lastWardShiftList: [4, 1, 2, 2],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 100,
          name: '이성희',
          priority: 6144,
          carried: 0,
          divisionNum: 2,
          isWorker: true,
          nurseId: 32,
        },
        lastWardShiftList: [4, 1, 2, 3],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 102,
          name: '김지은',
          priority: 7168,
          carried: 0,
          divisionNum: 2,
          isWorker: true,
          nurseId: 33,
        },
        lastWardShiftList: [4, 4, 1, 1],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
    ],
    [
      {
        shiftNurse: {
          shiftNurseId: 104,
          name: '양가연',
          priority: 8192,
          carried: 0,
          divisionNum: 3,
          isWorker: true,
          nurseId: 34,
        },
        lastWardShiftList: [1, 2, 2, 2],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 106,
          name: '박보람',
          priority: 9216,
          carried: 0,
          divisionNum: 3,
          isWorker: true,
          nurseId: 35,
        },
        lastWardShiftList: [4, 4, 1, 2],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 108,
          name: '김현아',
          priority: 10240,
          carried: 0,
          divisionNum: 3,
          isWorker: true,
          nurseId: 36,
        },
        lastWardShiftList: [2, 3, 3, 4],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 110,
          name: '김예림',
          priority: 11264,
          carried: 0,
          divisionNum: 3,
          isWorker: true,
          nurseId: 37,
        },
        lastWardShiftList: [2, 2, 2, 4],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 112,
          name: '박초빈',
          priority: 12288,
          carried: 0,
          divisionNum: 3,
          isWorker: true,
          nurseId: 38,
        },
        lastWardShiftList: [1, 2, 2, 2],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
    ],
    [
      {
        shiftNurse: {
          shiftNurseId: 114,
          name: '오종욱',
          priority: 13312,
          carried: 0,
          divisionNum: 4,
          isWorker: true,
          nurseId: 39,
        },
        lastWardShiftList: [4, 4, 1, 1],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      {
        shiftNurse: {
          shiftNurseId: 116,
          name: '이지영',
          priority: 14336,
          carried: 0,
          divisionNum: 4,
          isWorker: true,
          nurseId: 40,
        },
        lastWardShiftList: [2, 4, 4, 2],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        wardReqShiftList: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
    ],
  ],
} as Shift;
