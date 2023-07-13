/* eslint-disable @typescript-eslint/no-unused-vars */
type Account = {
  accountId: number;
  /** 연동된 간호사 ID */
  nurseId: number | null;
  /** 소속된 병동 ID */
  wardId: number | null;
  email: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  /** 계정 삭제 여부 */
  isDeleted: boolean;
  /** 교대근무에 참여하는가? */
  isWorker: boolean;
  phoneNum: string;
  gender: string;
  birthday: string;
  /** 입사 날짜 */
  employmentDate: string;
  /** 병동 관리자 여부 */
  isManager: boolean;
  /** 온보딩 중 상태 */
  onboardingStatus: '미입력' | '온보딩' | '가이드' | '완료';
};
