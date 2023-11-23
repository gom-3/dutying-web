import axiosInstance from './client';
import qs from 'qs';

/** GET    `/wards/${wardId}/shift-teams/${shiftTeamId}/req-duty` */
const getReqShift = async (wardId: number, shiftTeamId: number, year: number, month: number) =>
  (
    await axiosInstance.get<RequestShift>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/req-duty?${qs.stringify({ year, month })}`
    )
  ).data;

/** GET    `/wards/${wardId}/shift-teams/${shiftTeamId}/duty` */
const getShift = async (wardId: number, shiftTeamId: number, year: number, month: number) =>
  (
    await axiosInstance.get<Shift>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/duty?${qs.stringify({ year, month })}`
    )
  ).data;

/** GET    `wards/%{wardId}/shift-teams/${shiftTeamId}/req-duty/req-list?year&month` */
const getRequestList = async (wardId: number, shiftTeamId: number, year: number, month: number) =>
  (
    await axiosInstance.get<DutyRequest[]>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/req-duty/req-list?${qs.stringify({
        year,
        month,
      })}`
    )
  ).data;

/**
 * PATCH  `/wards/${wardId}/shifts/list`
 * 근무 변경
 * */
const updateShift = async (
  wardId: number,
  year: number,
  month: number,
  day: number,
  shiftNurseId: number,
  wardShiftTypeId: number | null
) =>
  (
    await axiosInstance.patch<null>(`/wards/${wardId}/shifts`, {
      shiftNurseId,
      date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      wardShiftTypeId,
    })
  ).data;

/**
 * PATCH  `/wards/${wardId}/shifts/list`
 * 여러 근무 변경
 * */
export type WardShiftsDTO = {
  shiftNurseId: number;
  date: string;
  wardShiftTypeId: number | null;
}[];
const updateShifts = async (wardId: number, wardShifts: WardShiftsDTO) =>
  (
    await axiosInstance.patch(`/wards/${wardId}/shifts/list`, {
      wardShifts,
    })
  ).data;

/**
 * PATCH  `/wards/${wardId}/shifts/list`
 * 신청 근무 변경
 * */
const updateReqShift = async (
  wardId: number,
  year: number,
  month: number,
  day: number,
  shiftNurseId: number,
  wardShiftTypeId: number | null
) =>
  (
    await axiosInstance.patch(`/wards/${wardId}/req-shifts`, {
      shiftNurseId,
      date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      wardShiftTypeId,
    })
  ).data;

const acceptRequestShift = async (wardId: number, reqShiftId: number, isAccepted: boolean | null) =>
  (
    await axiosInstance.patch(`/wards/${wardId}/req-shifts/${reqShiftId}/accept`, {
      isAccepted,
    })
  ).data;

const postShift = async (wardId: number, shiftTeamId: number, year: number, month: number) =>
  (
    await axiosInstance.post(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/post?year=${year}&month=${month
        .toString()
        .padStart(2, '0')}`
    )
  ).data;

export {
  getReqShift,
  getShift,
  getRequestList,
  updateShift,
  updateShifts,
  updateReqShift,
  acceptRequestShift,
  postShift,
};
