import { getDaysInMonth } from '@libs/util/date';
import './index.scss';
import { shiftKindList, duty } from '@mocks/duty/data';

const DutyCalendar = () => {
  return (
    <div className="calendar">
      <div className="header">
        <div className="name">이름</div>
        <div className="carry">이월</div>
        <div className="title">
          <div className="month">{duty.month - 1}월</div>
          <div className="days">
            {getDaysInMonth(duty.month - 1)
              .slice(getDaysInMonth(duty.month - 1).length - 4)
              .map((date, i) => (
                <div
                  key={i}
                  className={`day${date.getDay() == 0 ? ' holyday' : ''}${
                    date.getDay() == 6 ? ' saturday' : ''
                  }`}
                >
                  {duty.month - 1}/{date.getDate()}
                </div>
              ))}
          </div>
        </div>
        <div className="title">
          <div className="month">{duty.month}월</div>
          <div className="days">
            {getDaysInMonth(duty.month).map((date, i) => (
              <div
                key={i}
                className={`day${date.getDay() == 0 ? ' holyday' : ''}${
                  date.getDay() == 6 ? ' saturday' : ''
                }`}
              >
                {duty.month}/{i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      {duty.schdule.map((item) => (
        <div className="schedule">
          <div className="name">{item.user.name}</div>
          <div className="carry">{item.carry}</div>
          <div className="lastDuty">
            {item.lastShiftList.map((schedule, i) => (
              <div key={i} className={`cell ${shiftKindList[schedule.shiftId].fullname}`}>
                {shiftKindList[schedule.shiftId].name}
              </div>
            ))}
          </div>
          <div className="duty">
            {item.shiftList.map((schedule, i) => (
              <div key={i} className={`cell ${shiftKindList[schedule.shiftId].fullname}`}>
                {shiftKindList[schedule.shiftId].name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MakeDutyPage = () => {
  return (
    <div className="wrapper">
      <div className="toolbar">
        <div className="logo">로고</div>
        <div className="shift">근무수</div>
        <div className="help">
          <p>도움말</p>
        </div>
        <div className="actions">
          <button>Auto Fill</button>
          <button>완료</button>
        </div>
      </div>
      <div className="center">
        <DutyCalendar />
        <div className="countDutyByUser">
          <div className="header">
            <div className="title">D</div>
            <div className="title">E</div>
            <div className="title">N</div>
            <div className="title">O</div>
            <div className="title">WO</div>
          </div>
          {duty.schdule.map((row) => (
            <div className="row">
              <div className="cell">
                {row.shiftList.filter((item) => item.shiftId === 1).length}
              </div>
              <div className="cell">
                {row.shiftList.filter((item) => item.shiftId === 2).length}
              </div>
              <div className="cell">
                {row.shiftList.filter((item) => item.shiftId === 3).length}
              </div>
              <div className="cell">
                {row.shiftList.filter((item) => item.shiftId === 0).length}
              </div>
              <div className="cell">
                {
                  row.shiftList.filter((item) => item.shiftId === 0 && item.dayKind != 'workday')
                    .length
                }
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom">
        <div className="countDutyByDay">
          {shiftKindList
            .filter((shift) => shift.name != '/')
            .map((shift) => (
              <div className="row">
                <div className="title">{shift.fullname}</div>
                <div className="des"></div>
                <div className="lastDuty">
                  {getDaysInMonth(duty.month - 1)
                    .slice(getDaysInMonth(duty.month - 1).length - 4)
                    .map((date, i) => (
                      <div key={i} className="cell">
                        {
                          duty.schdule.filter((item) => item.lastShiftList[i].shiftId === shift.id)
                            .length
                        }
                      </div>
                    ))}
                </div>
                <div className="duty">
                  {getDaysInMonth(duty.month).map((date, i) => (
                    <div key={i} className="cell">
                      {duty.schdule.filter((item) => item.shiftList[i].shiftId === shift.id).length}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MakeDutyPage;
