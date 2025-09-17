export type DutyRequest = {
  wardReqShiftId: number;
  nurseId: number;
  nurseName: string;
  /**신청근무 날짜 */
  date: number;
  /**신청근무를 신청한 날짜 */
  requestDate: string;
  wardShiftTypeId: number;
  wardShiftTypeShortName: string;
  wardShiftTypeColor: string;
  isRead: boolean;
  isAccepted: boolean | null;
};
