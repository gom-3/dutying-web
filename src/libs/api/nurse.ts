import axiosInstance from './client';

export type CreateNurseDTO = Pick<Nurse, 'name' | 'phoneNum' | 'gender' | 'isWorker'>;

const createAccountNurse = async (accountId: number, createNurse: CreateNurseDTO) =>
  (
    await axiosInstance.post<Nurse>(`/nurses?accountId=${accountId}`, {
      ...createNurse,
      phoneNum: createNurse.phoneNum.replace(/-+/g, ''),
    })
  ).data;

const getNurse = async (nurseId: number) =>
  (await axiosInstance.get<Nurse>(`/nurses/${nurseId}`)).data;

export type UpdateNurseDTO = Pick<
  Nurse,
  | 'name'
  | 'phoneNum'
  | 'gender'
  | 'isWorker'
  | 'employmentDate'
  | 'isDutyManager'
  | 'isWardManager'
  | 'memo'
>;
const updateNurse = async (nurseId: number, updatedNurse: UpdateNurseDTO) =>
  (await axiosInstance.patch<Nurse>(`/nurses/${nurseId}`, updatedNurse)).data;

const updateNurseStatus = async (nurseId: number, status: string) =>
  (await axiosInstance.patch<Nurse>(`/nurses/${nurseId}`, { status })).data;

const connectNurse = async (nurseId: number) =>
  (await axiosInstance.post(`/nurses/${nurseId}/connect`)).data;

const unConnectNurse = async (nurseId: number) =>
  (await axiosInstance.delete(`/nurses/${nurseId}/connect`)).data;

const updateNurseOrder = async (
  nurseId: number,
  shiftTeamId: number,
  nextShiftTeamId: number,
  divisionNum: number,
  prevPriority: number,
  nextPriority: number,
  patchYearMonth: string
) =>
  (
    await axiosInstance.patch(`/nurses/${nurseId}/priority`, {
      shiftTeamId,
      nextShiftTeamId,
      divisionNum,
      prevPriority,
      nextPriority,
      patchYearMonth,
    })
  ).data;

const updateShiftTeamDivision = async (
  shiftTeamId: number,
  prevPriority: number,
  changeValue: number,
  patchYearMonth: string
) =>
  (
    await axiosInstance.patch(`/nurses/division`, {
      shiftTeamId,
      prevPriority,
      changeValue,
      patchYearMonth,
    })
  ).data;

export type updateNurseShiftTypeRequest = {
  isPossible?: boolean;
  isPrefer?: boolean;
};
const updateNurseShiftType = async (
  nurseId: number,
  nurseShiftTypeId: number,
  change: updateNurseShiftTypeRequest
) => (await axiosInstance.patch(`/nurses/${nurseId}/shift-types/${nurseShiftTypeId}`, change)).data;

const updateNurseCarry = async (shiftNurseId: number, value: number) =>
  (
    await axiosInstance.patch<null>(`/shift-nurses/${shiftNurseId}/carried`, {
      value,
    })
  ).data;

export {
  createAccountNurse, // 계정 간호사 등록
  connectNurse, // 간호사 연동 등록
  unConnectNurse, // 간호사 연동 해제
  getNurse, // 간호사 조회
  updateNurse, // 간호사 정보 수정
  updateNurseStatus, // 간호사 상태 수정
  updateNurseOrder, // 간호사 순서 수정
  updateShiftTeamDivision, // 간호사 구분 수정
  updateNurseShiftType, // 간호사 근무유형 수정
  updateNurseCarry, // 간호사 이월 수정
};
