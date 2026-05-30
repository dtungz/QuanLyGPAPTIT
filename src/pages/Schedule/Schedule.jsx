import { useState, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useSemester } from '../../hooks/useSemester';
import { Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import WeeklyTimetable from './WeeklyTimetable';
import ClassCheckin from './ClassCheckin';
import './Schedule.css';

export default function Schedule() {
  const { courses, attendance } = useAppContext();
  const { currentSemester, semesterOptions, getSemesterCourses } = useSemester();
  const [selectedSemId, setSelectedSemId] = useState(currentSemester?.id || '');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [activeTab, setActiveTab] = useState('timetable');

  const semCourses = useMemo(() => 
    selectedSemId ? getSemesterCourses(selectedSemId) : [],
    [selectedSemId, courses]
  );

  const scheduledCourses = semCourses.filter(c => c.schedule?.dayOfWeek != null);

  const getWeekDates = (offset) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + offset * 7);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeekOffset);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>
              <CalendarDays size={28} style={{ verticalAlign: 'middle', marginRight: 10 }} />
              Lịch học
            </h1>
            <p>Thời khoá biểu và điểm danh hàng tuần</p>
          </div>
          <div style={{ width: 200 }}>
            <Select
              options={semesterOptions}
              value={selectedSemId}
              onChange={e => setSelectedSemId(e.target.value)}
              placeholder="Chọn học kỳ"
            />
          </div>
        </div>
      </div>

      <div className="schedule-tabs">
        <button 
          className={`schedule-tab ${activeTab === 'timetable' ? 'schedule-tab--active' : ''}`}
          onClick={() => setActiveTab('timetable')}
        >
          Thời khoá biểu
        </button>
        <button
          className={`schedule-tab ${activeTab === 'checkin' ? 'schedule-tab--active' : ''}`}
          onClick={() => setActiveTab('checkin')}
        >
          Điểm danh
        </button>
      </div>

      {activeTab === 'timetable' && (
        <>
          <div className="week-nav">
            <Button variant="ghost" size="sm" icon={ChevronLeft} onClick={() => setCurrentWeekOffset(prev => prev - 1)} />
            <span className="week-nav__label">
              {weekDates[0].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
              {' - '}
              {weekDates[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
            <Button variant="ghost" size="sm" icon={ChevronRight} onClick={() => setCurrentWeekOffset(prev => prev + 1)} />
            {currentWeekOffset !== 0 && (
              <Button variant="ghost" size="sm" onClick={() => setCurrentWeekOffset(0)}>Hôm nay</Button>
            )}
          </div>
          <WeeklyTimetable courses={scheduledCourses} weekDates={weekDates} />
        </>
      )}

      {activeTab === 'checkin' && (
        <ClassCheckin courses={semCourses} weekDates={weekDates} />
      )}
    </div>
  );
}
