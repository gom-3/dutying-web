type Nurse = {
  id: number;
  name: string;
  phone: string;
  proficiency: number; // 숙련도
  isConnected: boolean; // 연동
  workAvailable: Shift[];
  workPrefer: Shift[];
  workRequest: DayDuty[]; // 신청 오프
  trait: string[];
  accWeekendOff: number; // 누적 주말 오프 카운트
};