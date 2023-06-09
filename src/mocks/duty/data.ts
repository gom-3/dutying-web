export const ShiftKindList: Shift[] = [
  {
    id: 0,
    fullname: 'Off',
    name: '/',
    startTime: '00:00',
    endTime: '00:00',
  },
  {
    id: 1,
    fullname: 'Day',
    name: 'D',
    startTime: '07:00',
    endTime: '15:00',
  },
  {
    id: 2,
    fullname: 'Evening',
    name: 'E',
    startTime: '15:00',
    endTime: '23:00',
  },
  {
    id: 3,
    fullname: 'Night',
    name: 'N',
    startTime: '23:00',
    endTime: '07:00',
  },
];

export const duty: Duty = {
  month: 6,
  schdule: [
    {
      month: 6,
      user: { id: 1, name: '김주영' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 2, name: '오지현' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 0 },
        { day: 29, dayKind: 'workday', shiftId: 1 },
        { day: 30, dayKind: 'workday', shiftId: 2 },
        { day: 31, dayKind: 'workday', shiftId: 2 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 2 },
        { day: 2, dayKind: 'workday', shiftId: 0 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 3 },
        { day: 5, dayKind: 'workday', shiftId: 3 },
        { day: 6, dayKind: 'holyday', shiftId: 0 },
        { day: 7, dayKind: 'workday', shiftId: 2 },
        { day: 8, dayKind: 'workday', shiftId: 2 },
        { day: 9, dayKind: 'workday', shiftId: 0 },
        { day: 10, dayKind: 'saturday', shiftId: 1 },
        { day: 11, dayKind: 'sunday', shiftId: 1 },
        { day: 12, dayKind: 'workday', shiftId: 1 },
        { day: 13, dayKind: 'workday', shiftId: 2 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 3 },
        { day: 16, dayKind: 'workday', shiftId: 3 },
        { day: 17, dayKind: 'saturday', shiftId: 0 },
        { day: 18, dayKind: 'sunday', shiftId: 0 },
        { day: 19, dayKind: 'workday', shiftId: 1 },
        { day: 20, dayKind: 'workday', shiftId: 1 },
        { day: 21, dayKind: 'workday', shiftId: 2 },
        { day: 22, dayKind: 'workday', shiftId: 2 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 1 },
        { day: 27, dayKind: 'workday', shiftId: 3 },
        { day: 28, dayKind: 'workday', shiftId: 3 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '유가영' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 0 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 1 },
        { day: 31, dayKind: 'workday', shiftId: 1 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 2 },
        { day: 2, dayKind: 'workday', shiftId: 2 },
        { day: 3, dayKind: 'saturday', shiftId: 0 },
        { day: 4, dayKind: 'sunday', shiftId: 2 },
        { day: 5, dayKind: 'workday', shiftId: 2 },
        { day: 6, dayKind: 'holyday', shiftId: 3 },
        { day: 7, dayKind: 'workday', shiftId: 3 },
        { day: 8, dayKind: 'workday', shiftId: 0 },
        { day: 9, dayKind: 'workday', shiftId: 0 },
        { day: 10, dayKind: 'saturday', shiftId: 1 },
        { day: 11, dayKind: 'sunday', shiftId: 1 },
        { day: 12, dayKind: 'workday', shiftId: 0 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 3 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 0 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 1 },
        { day: 19, dayKind: 'workday', shiftId: 1 },
        { day: 20, dayKind: 'workday', shiftId: 2 },
        { day: 21, dayKind: 'workday', shiftId: 0 },
        { day: 22, dayKind: 'workday', shiftId: 0 },
        { day: 23, dayKind: 'workday', shiftId: 3 },
        { day: 24, dayKind: 'saturday', shiftId: 3 },
        { day: 25, dayKind: 'sunday', shiftId: 0 },
        { day: 26, dayKind: 'workday', shiftId: 0 },
        { day: 27, dayKind: 'workday', shiftId: 1 },
        { day: 28, dayKind: 'workday', shiftId: 1 },
        { day: 29, dayKind: 'workday', shiftId: 1 },
        { day: 30, dayKind: 'workday', shiftId: 2 },
      ],
    },
    {
      month: 6,
      user: { id: 3, name: '윤정은' },
      carry: 1,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 2 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '유미현' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '고선미' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '조나현' },
      carry: -1,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '박혜림' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '이수진' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '이지은' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '이성희' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '박보람' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '이지영' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '김현아' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '김예림' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '양가연' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '박초빈' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '유아영' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
    {
      month: 6,
      user: { id: 1, name: '오종욱' },
      carry: 0,
      lastShiftList: [
        { day: 28, dayKind: 'sunday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 2 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
        { day: 31, dayKind: 'workday', shiftId: 0 },
      ],
      shiftList: [
        { day: 1, dayKind: 'workday', shiftId: 3 },
        { day: 2, dayKind: 'workday', shiftId: 3 },
        { day: 3, dayKind: 'saturday', shiftId: 3 },
        { day: 4, dayKind: 'sunday', shiftId: 0 },
        { day: 5, dayKind: 'workday', shiftId: 0 },
        { day: 6, dayKind: 'holyday', shiftId: 1 },
        { day: 7, dayKind: 'workday', shiftId: 1 },
        { day: 8, dayKind: 'workday', shiftId: 1 },
        { day: 9, dayKind: 'workday', shiftId: 2 },
        { day: 10, dayKind: 'saturday', shiftId: 0 },
        { day: 11, dayKind: 'sunday', shiftId: 0 },
        { day: 12, dayKind: 'workday', shiftId: 3 },
        { day: 13, dayKind: 'workday', shiftId: 3 },
        { day: 14, dayKind: 'workday', shiftId: 0 },
        { day: 15, dayKind: 'workday', shiftId: 0 },
        { day: 16, dayKind: 'workday', shiftId: 1 },
        { day: 17, dayKind: 'saturday', shiftId: 1 },
        { day: 18, dayKind: 'sunday', shiftId: 2 },
        { day: 19, dayKind: 'workday', shiftId: 2 },
        { day: 20, dayKind: 'workday', shiftId: 0 },
        { day: 21, dayKind: 'workday', shiftId: 3 },
        { day: 22, dayKind: 'workday', shiftId: 3 },
        { day: 23, dayKind: 'workday', shiftId: 0 },
        { day: 24, dayKind: 'saturday', shiftId: 0 },
        { day: 25, dayKind: 'sunday', shiftId: 1 },
        { day: 26, dayKind: 'workday', shiftId: 2 },
        { day: 27, dayKind: 'workday', shiftId: 2 },
        { day: 28, dayKind: 'workday', shiftId: 2 },
        { day: 29, dayKind: 'workday', shiftId: 0 },
        { day: 30, dayKind: 'workday', shiftId: 0 },
      ],
    },
  ],
};
