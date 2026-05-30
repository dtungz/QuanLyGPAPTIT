import Card from '../../components/ui/Card';
import './WeeklyTimetable.css';

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

const DAY_LABELS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
const DAY_MAP = [1, 2, 3, 4, 5, 6, 0]; // Mon=1, Tue=2, ..., Sun=0

export default function WeeklyTimetable({ courses, weekDates }) {
  const today = new Date();
  const todayStr = today.toDateString();

  const getCourseForSlot = (dayIndex, timeSlot) => {
    const dayOfWeek = DAY_MAP[dayIndex];
    return courses.find(c => {
      if (c.schedule?.dayOfWeek !== dayOfWeek) return false;
      const start = c.schedule.startTime;
      const end = c.schedule.endTime;
      if (!start || !end) return false;
      return timeSlot >= start && timeSlot < end;
    });
  };

  const isStartSlot = (course, timeSlot) => {
    return course?.schedule?.startTime === timeSlot;
  };

  const getSlotSpan = (course) => {
    if (!course?.schedule?.startTime || !course?.schedule?.endTime) return 1;
    const start = parseInt(course.schedule.startTime.replace(':', ''));
    const end = parseInt(course.schedule.endTime.replace(':', ''));
    return Math.max(1, Math.floor((end - start) / 100));
  };

  // Track which cells are covered by a span
  const spannedCells = new Set();

  return (
    <Card padding="none">
      <div className="timetable-wrapper">
        <table className="timetable">
          <thead>
            <tr>
              <th className="timetable__time-header">Giờ</th>
              {DAY_LABELS.map((label, i) => {
                const isToday = weekDates[i]?.toDateString() === todayStr;
                return (
                  <th key={i} className={`timetable__day-header ${isToday ? 'timetable__day-header--today' : ''}`}>
                    <span className="timetable__day-name">{label}</span>
                    <span className="timetable__day-date">
                      {weekDates[i]?.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot}>
                <td className="timetable__time">{slot}</td>
                {DAY_LABELS.map((_, dayIndex) => {
                  const cellKey = `${dayIndex}-${slot}`;
                  if (spannedCells.has(cellKey)) return null;

                  const course = getCourseForSlot(dayIndex, slot);
                  
                  if (course && isStartSlot(course, slot)) {
                    const span = getSlotSpan(course);
                    // Mark subsequent cells as spanned
                    for (let s = 1; s < span; s++) {
                      const idx = TIME_SLOTS.indexOf(slot) + s;
                      if (idx < TIME_SLOTS.length) {
                        spannedCells.add(`${dayIndex}-${TIME_SLOTS[idx]}`);
                      }
                    }

                    const isToday = weekDates[dayIndex]?.toDateString() === todayStr;

                    return (
                      <td key={dayIndex} rowSpan={span} className={`timetable__cell timetable__cell--has-course ${isToday ? 'timetable__cell--today' : ''}`}>
                        <div className="timetable__course">
                          <span className="timetable__course-name">{course.name}</span>
                          <span className="timetable__course-info">
                            {course.schedule.room && `📍 ${course.schedule.room}`}
                          </span>
                          <span className="timetable__course-time">
                            {course.schedule.startTime} - {course.schedule.endTime}
                          </span>
                        </div>
                      </td>
                    );
                  }

                  if (!course) {
                    const isToday = weekDates[dayIndex]?.toDateString() === todayStr;
                    return <td key={dayIndex} className={`timetable__cell ${isToday ? 'timetable__cell--today' : ''}`} />;
                  }

                  return null;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
