/* eslint-disable @typescript-eslint/no-unused-vars */
type User = {
  accountId: number;
  nurseId: number;
  wardId: number;
  email: string;
  name: string;
  status: string;
  /**근무표 제작 권한 */
  isDutyManager: boolean;
  /**병동 관리 권한 */
  isWardManager: boolean;
};
