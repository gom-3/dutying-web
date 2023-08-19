export default {
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
      color: '#04dcad',
      isOff: false,
      isDefault: true,
    },
    {
      wardShiftTypeId: 2,
      name: '이브닝',
      shortName: 'E',
      startTime: '17:00',
      endTime: '22:00',
      color: '#ff8ba5',
      isOff: false,
      isDefault: true,
    },
    {
      wardShiftTypeId: 3,
      name: '나이트',
      shortName: 'N',
      startTime: '22:00',
      endTime: '07:00',
      color: '#3580ff',
      isOff: false,
      isDefault: true,
    },
    {
      wardShiftTypeId: 4,
      name: '오프',
      shortName: 'O',
      startTime: null,
      endTime: null,
      color: '#465b7a',
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
          nurseInfo: {
            nurseId: 27,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 67,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 68,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 69,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 70,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
          nurseInfo: {
            nurseId: 28,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 71,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 72,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 73,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 74,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
          nurseInfo: {
            nurseId: 29,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 75,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 76,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 77,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 78,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
          nurseInfo: {
            nurseId: 30,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 79,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 80,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 81,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 82,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
        },
        lastWardShiftList: [4, 4, 2, 3],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          3,
          3,
          3,
          4,
          4,
          4,
          1,
          1,
          1,
          2,
          null,
          4,
          1,
          2,
          2,
          2,
          4,
          3,
          3,
          3,
          4,
          4,
          1,
          2,
          2,
          4,
          4,
          2,
          2,
          4,
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
          nurseInfo: {
            nurseId: 31,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 83,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 84,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 85,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 86,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
          nurseInfo: {
            nurseId: 32,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 87,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 88,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 89,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 90,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
        },
        lastWardShiftList: [4, 1, 2, 3],
        lastWardReqShiftList: [null, null, null, null],
        wardShiftList: [
          3,
          4,
          4,
          4,
          3,
          3,
          4,
          4,
          2,
          2,
          4,
          1,
          null,
          2,
          2,
          4,
          4,
          4,
          3,
          3,
          4,
          4,
          1,
          2,
          2,
          2,
          4,
          1,
          1,
          1,
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
          nurseInfo: {
            nurseId: 33,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 91,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 92,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 93,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 94,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
          null,
          null,
          null,
          null,
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
          nurseInfo: {
            nurseId: 34,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 95,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 96,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 97,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 98,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
          nurseInfo: {
            nurseId: 35,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 99,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 100,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 101,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 102,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
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
          nurseInfo: {
            nurseId: 36,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 103,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 104,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 105,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 106,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
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
          nurseInfo: {
            nurseId: 37,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 107,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 108,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 109,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 110,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
          shiftNurseId: 112,
          name: '박초빈',
          priority: 12288,
          carried: 0,
          divisionNum: 3,
          isWorker: true,
          nurseInfo: {
            nurseId: 38,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 111,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 112,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 113,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 114,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
          null,
          null,
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
          nurseInfo: {
            nurseId: 39,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 115,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 116,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 117,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 118,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
          nurseInfo: {
            nurseId: 40,
            accountId: null,
            isConnected: false,
            phoneNum: '01012345678',
            nurseShiftTypes: [
              {
                nurseShiftTypeId: 119,
                name: '데이',
                shortName: 'D',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 120,
                name: '이브닝',
                shortName: 'E',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 121,
                name: '나이트',
                shortName: 'N',
                isPossible: true,
                isPreferred: false,
              },
              {
                nurseShiftTypeId: 122,
                name: '오프',
                shortName: 'O',
                isPossible: true,
                isPreferred: false,
              },
            ],
            isDutyManager: false,
            isWardManager: false,
            gender: '여',
            employmentDate: '2021-08-01',
            isDeleted: false,
          },
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
