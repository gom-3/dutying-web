export const dutyConstraint: DutyConstraint = {
  rotation: 3,
  nightInterval: 7,
  dutyStandard: {
    workday: [7, 3, 3, 3],
    weekend: [7, 3, 3, 3],
  },
  straight: [3, 4, 4, 3],
  requestDutyType: 'off',
};

export const shiftList: ShiftList = [
  {
    fullname: '오프',
    name: '/',
    startTime: '00:00',
    endTime: '00:00',
    hotKey: '/',
    color: '#5534E0',
  },
  {
    fullname: '데이',
    name: 'D',
    startTime: '07:00',
    endTime: '15:00',
    hotKey: 'D',
    color: '#D7EB2A',
  },
  {
    fullname: '이브닝',
    name: 'E',
    startTime: '15:00',
    endTime: '23:00',
    hotKey: 'E',
    color: '#EB39E8',
  },
  {
    fullname: '나이트',
    name: 'N',
    startTime: '23:00',
    endTime: '07:00',
    hotKey: 'N',
    color: '#271F3E',
  },
];

export const duty: Duty = {
  month: 6,
  lastDays: [
    { day: 28, dayKind: 'sunday' },
    { day: 29, dayKind: 'workday' },
    { day: 30, dayKind: 'workday' },
    { day: 31, dayKind: 'workday' },
  ],
  days: [
    { day: 1, dayKind: 'workday' },
    { day: 2, dayKind: 'workday' },
    { day: 3, dayKind: 'saturday' },
    { day: 4, dayKind: 'sunday' },
    { day: 5, dayKind: 'workday' },
    { day: 6, dayKind: 'holyday' },
    { day: 7, dayKind: 'workday' },
    { day: 8, dayKind: 'workday' },
    { day: 9, dayKind: 'workday' },
    { day: 10, dayKind: 'saturday' },
    { day: 11, dayKind: 'sunday' },
    { day: 12, dayKind: 'workday' },
    { day: 13, dayKind: 'workday' },
    { day: 14, dayKind: 'workday' },
    { day: 15, dayKind: 'workday' },
    { day: 16, dayKind: 'workday' },
    { day: 17, dayKind: 'saturday' },
    { day: 18, dayKind: 'sunday' },
    { day: 19, dayKind: 'workday' },
    { day: 20, dayKind: 'workday' },
    { day: 21, dayKind: 'workday' },
    { day: 22, dayKind: 'workday' },
    { day: 23, dayKind: 'workday' },
    { day: 24, dayKind: 'saturday' },
    { day: 25, dayKind: 'sunday' },
    { day: 26, dayKind: 'workday' },
    { day: 27, dayKind: 'workday' },
    { day: 28, dayKind: 'workday' },
    { day: 29, dayKind: 'workday' },
    { day: 30, dayKind: 'workday' },
  ],
  dutyRows: [
    {
      user: {
        id: 1,
        name: '노주영',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [2, 2, 0, 0],
      shiftIndexList: [
        3, 3, 3, 0, 0, 1, 1, 1, 2, 0, 0, 3, 3, 0, 0, 1, 1, 2, 2, 0, 3, 3, 0, 0, 1, 2, 2, 2, 0, 0,
      ],
    },
    {
      user: {
        id: 2,
        name: '오지현',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [0, 1, 2, 2],
      shiftIndexList: [
        2, 0, 3, 3, 3, 0, 0, 0, 2, 2, 2, 2, 0, 2, 3, 3, 0, 0, 1, 1, 2, 2, 0, 0, 1, 1, 3, 3, 0, 0,
      ],
    },
    {
      user: {
        id: 3,
        name: '유가영',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [0, 0, 1, 1],
      shiftIndexList: [
        2, 2, 0, 2, 2, 3, 3, 0, 0, 1, 1, 0, 3, 3, 0, 0, 1, 1, 1, 2, 0, 0, 3, 3, 0, 0, 1, 1, 1, 2,
      ],
    },
    {
      user: {
        id: 4,
        name: '윤정은',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [3, 3, 0, 0],
      shiftIndexList: [
        1, 2, 2, 2, 0, 0, 2, 3, 3, 0, 0, 1, 1, 1, 2, 0, 3, 3, 0, 0, 1, 1, 2, 2, 0, 3, 3, 3, 0, 0,
      ],
    },
    {
      user: {
        id: 5,
        name: '유미현',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [1, 0, 0, 0],
      shiftIndexList: [
        3, 3, 0, 0, 1, 1, 2, 2, 0, 0, 1, 3, 3, 0, 0, 1, 1, 2, 2, 0, 0, 3, 3, 0, 0, 1, 1, 1, 2, 0,
      ],
    },
    {
      user: {
        id: 6,
        name: '고선미',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [0, 1, 3, 3],
      shiftIndexList: [
        3, 0, 0, 1, 1, 2, 2, 0, 0, 3, 3, 0, 0, 1, 1, 2, 2, 0, 2, 3, 3, 0, 0, 1, 1, 2, 3, 3, 0, 0,
      ],
    },
    {
      user: {
        id: 7,
        name: '조나현',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [1, 1, 1, 0],
      shiftIndexList: [
        0, 3, 3, 0, 0, 1, 2, 2, 3, 3, 0, 0, 1, 2, 2, 2, 0, 2, 3, 3, 0, 0, 1, 1, 2, 2, 0, 0, 2, 2,
      ],
    },
    {
      user: {
        id: 8,
        name: '박혜림',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [2, 2, 0, 0],
      shiftIndexList: [
        3, 0, 0, 1, 1, 2, 0, 3, 3, 0, 0, 1, 1, 2, 2, 0, 2, 3, 3, 0, 0, 1, 1, 2, 3, 3, 0, 0, 1, 1,
      ],
    },
    {
      user: {
        id: 9,
        name: '이수진',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [3, 0, 0, 1],
      shiftIndexList: [
        1, 1, 1, 0, 1, 3, 3, 0, 0, 1, 1, 2, 2, 0, 0, 3, 3, 0, 0, 1, 1, 2, 2, 0, 3, 3, 0, 0, 1, 1,
      ],
    },
    {
      user: {
        id: 10,
        name: '이지은',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [2, 2, 0, 0],
      shiftIndexList: [
        2, 3, 3, 0, 0, 1, 1, 2, 2, 0, 0, 3, 3, 0, 0, 1, 1, 0, 3, 3, 0, 0, 1, 1, 2, 2, 0, 0, 1, 1,
      ],
    },
    {
      user: {
        id: 11,
        name: '이성희',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [1, 3, 3, 3],
      shiftIndexList: [
        0, 0, 1, 1, 2, 2, 0, 3, 3, 0, 0, 1, 2, 0, 2, 3, 3, 0, 0, 1, 1, 2, 3, 3, 0, 0, 2, 2, 2, 0,
      ],
    },
    {
      user: {
        id: 12,
        name: '박보람',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [2, 2, 0, 0],
      shiftIndexList: [
        0, 1, 1, 3, 3, 0, 0, 1, 1, 2, 2, 0, 2, 3, 3, 0, 0, 1, 1, 2, 2, 0, 2, 3, 3, 0, 0, 1, 1, 1,
      ],
    },
    {
      user: {
        id: 13,
        name: '이지영',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [0, 3, 3, 0],
      shiftIndexList: [
        0, 1, 2, 2, 2, 0, 1, 1, 1, 3, 3, 0, 0, 1, 1, 2, 3, 3, 0, 0, 1, 1, 1, 0, 0, 3, 3, 0, 0, 2,
      ],
    },
    {
      user: {
        id: 14,
        name: '김현아',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [2, 2, 0, 0],
      shiftIndexList: [
        2, 2, 0, 0, 0, 2, 3, 3, 0, 0, 1, 1, 1, 2, 0, 3, 3, 0, 0, 1, 2, 2, 0, 3, 3, 0, 0, 1, 2, 2,
      ],
    },
    {
      user: {
        id: 15,
        name: '김예림',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [3, 0, 0, 2],
      shiftIndexList: [
        2, 2, 2, 0, 0, 1, 1, 2, 0, 3, 3, 0, 0, 1, 1, 2, 2, 0, 2, 3, 3, 0, 0, 1, 1, 1, 1, 0, 3, 3,
      ],
    },

    {
      user: {
        id: 16,
        name: '양가연',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [2, 2, 2, 0],
      shiftIndexList: [
        0, 0, 1, 1, 2, 2, 0, 0, 1, 2, 3, 3, 0, 0, 1, 1, 2, 2, 0, 0, 1, 3, 3, 0, 0, 0, 2, 3, 3, 3,
      ],
    },

    {
      user: {
        id: 17,
        name: '박초빈',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [2, 2, 0, 0],
      shiftIndexList: [
        0, 0, 1, 2, 2, 3, 3, 0, 0, 1, 1, 2, 0, 3, 3, 0, 0, 1, 1, 2, 2, 0, 2, 2, 2, 2, 0, 0, 3, 3,
      ],
    },

    {
      user: {
        id: 18,
        name: '유아영',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [2, 2, 0, 0],
      shiftIndexList: [
        1, 1, 2, 3, 3, 0, 0, 1, 2, 2, 2, 0, 2, 2, 0, 0, 0, 3, 3, 0, 0, 1, 1, 2, 2, 0, 2, 2, 3, 3,
      ],
    },

    {
      user: {
        id: 19,
        name: '오종욱',
        proficiency: 3,
        phone: '01012341234',
        isConnected: false,
        shiftOption: [
          { shift: shiftList[0], prefer: true, avail: true },
          { shift: shiftList[1], prefer: false, avail: true },
          { shift: shiftList[2], prefer: true, avail: true },
        ],
        workAvailable: [shiftList[0], shiftList[1], shiftList[2], shiftList[3]],
        workPrefer: [shiftList[1]],
        workRequest: [],
        trait: [],
        accWeekendOff: 0,
      },
      carry: 0,
      lastShiftIndexList: [0, 1, 1, 1],
      shiftIndexList: [
        1, 0, 0, 3, 3, 3, 0, 0, 1, 1, 2, 2, 0, 3, 3, 0, 0, 1, 2, 2, 3, 3, 0, 0, 0, 1, 1, 2, 2, 0,
      ],
    },
  ],
};

/**날짜 별 주요 근무(3교대) */
type DutyDate = {
  day: string[];
  evening: string[];
  night: string[];
};

const dutyByDate: DutyDate[] = [];
const temp = [
  ['오종욱', '김찬규', '조성연', '황영희'],
  ['황인서', '김범진', '류원경', '김은숙'],
  ['강명구', '안재홍', '김범진', '정경화'],
];

for (let i = 0; i < 31; i++) {
  dutyByDate.push({
    day: temp[i % 3],
    evening: temp[(i + 1) % 3],
    night: temp[(i + 2) % 3],
  });
}

type DutyMonth = {
  month: number;
  duty: DutyDate[];
};

const dutyByMonth: DutyMonth[] = [];
for (let i = 1; i <= 12; i++) dutyByMonth.push({ month: i, duty: dutyByDate });
export { dutyByDate, dutyByMonth };
