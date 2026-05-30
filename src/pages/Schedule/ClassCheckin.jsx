import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { ClipboardCheck } from 'lucide-react';
import { ATTENDANCE_STATUS } from '../../utils/constants';
import './ClassCheckin.css';

export default function ClassCheckin({ courses }) {
  const { attendance, addAttendance, updateAttendance } = useAppContext();
  const today = new Date().toISOString().split('T')[0];

  const getAttendanceForCourse = (courseId, date) => {
    return attendance.find(a => a.courseId === courseId && a.date === date);
  };

  const handleCheckin = (courseId, status) => {
    const existing = getAttendanceForCourse(courseId, today);
    if (existing) {
      updateAttendance(existing.id, { status });
    } else {
      addAttendance({ courseId, date: today, status, note: '' });
    }
  };

  const getStats = (courseId) => {
    const records = attendance.filter(a => a.courseId === courseId);
    const total = records.length;
    const present = records.filter(a => a.status === 'present' || a.status === 'late').length;
    return { total, present, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
  };

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle icon={ClipboardCheck}>Điểm danh hôm nay ({new Date().toLocaleDateString('vi-VN')})</CardTitle>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <p className="checkin-empty">Chưa có môn học trong kỳ này.</p>
        ) : (
          <div className="checkin-list">
            {courses.map(course => {
              const todayRecord = getAttendanceForCourse(course.id, today);
              const stats = getStats(course.id);

              return (
                <div key={course.id} className="checkin-item">
                  <div className="checkin-item__info">
                    <span className="checkin-item__name">{course.name}</span>
                    <span className="checkin-item__code">{course.code}</span>
                    <div className="checkin-item__stats">
                      Chuyên cần: {stats.present}/{stats.total} ({stats.percentage}%)
                    </div>
                  </div>
                  <div className="checkin-item__actions">
                    {Object.entries(ATTENDANCE_STATUS).map(([key, { label, icon }]) => (
                      <button
                        key={key}
                        className={`checkin-btn ${todayRecord?.status === key ? 'checkin-btn--active' : ''}`}
                        onClick={() => handleCheckin(course.id, key)}
                        title={label}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
