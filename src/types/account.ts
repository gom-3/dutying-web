/* eslint-disable @typescript-eslint/no-unused-vars */
type Account = {
  accountId: number;
  /** 연동된 간호사 ID */
  nurseId: number | null;
  /** 소속된 병동 ID */
  wardId: number | null;
  shiftTeamId: number | null;
  email: string;
  name: string;
  gender: string;
  phoneNum: string;
  modifiedAt: string;
  /** 계정 삭제 여부 */
  isDeleted: boolean;
  /** 병동 관리자 여부 */
  isManager: boolean;
  /** 온보딩 중 상태 */
  status:
    | 'INITIAL' // 계정 정보 입력 전
    | 'NURSE_INFO_PENDING' // 간호사 정보 입력 전
    | 'WARD_SELECT_PENDING' // 병동 생성 or 입장 선택 전
    | 'WARD_ENTRY_PENDING' // 병동 입장 전
    | 'LINKED'; // 입장 완료
};
