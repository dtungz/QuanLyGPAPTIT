import { useState } from 'react';
import { Pencil, Trash2, BookOpen } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { calculateScore10, score10ToGPA4 } from '../../utils/gpaCalculator';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { COURSE_STATUS } from '../../utils/constants';
import './CourseTable.css';

export default function CourseTable({ semesterId, onEdit }) {
  const { courses, deleteCourse, settings } = useAppContext();
  const [predictedGrades, setPredictedGrades] = useState({});
  const semCourses = courses.filter(c => c.semesterId === semesterId);

  if (semCourses.length === 0) {
    return (
      <Card padding="lg">
        <EmptyState
          icon={BookOpen}
          title="Chưa có môn học"
          description="Thêm môn học vào học kỳ này."
        />
      </Card>
    );
  }

  return (
    <Card padding="none">
      <div className="course-table-wrapper">
        <table className="course-table">
          <thead>
            <tr>
              <th>Mã HP</th>
              <th>Tên học phần</th>
              <th>TC</th>
              <th>QT</th>
              <th>GK</th>
              <th>CK</th>
              <th title="Dự đoán điểm Cuối Kỳ">Dự đoán CK</th>
              <th>TB (10)</th>
              <th>GPA (4)</th>
              <th>Xếp loại</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {semCourses.map(course => {
              const isPredicting = course.status === 'in-progress';
              const predictedFinal = predictedGrades[course.id];
              
              const gradesToUse = { ...course.grades };
              if (isPredicting && predictedFinal != null) {
                 gradesToUse.final = predictedFinal;
              }

              const score10 = calculateScore10(gradesToUse, course.weights);
              const result = score10 != null ? score10ToGPA4(score10, settings.gradeScale) : null;
              const statusInfo = COURSE_STATUS[course.status] || {};

              return (
                <tr key={course.id} className={isPredicting && predictedFinal != null ? 'is-predicting' : ''}>
                  <td className="course-code">{course.code}</td>
                  <td className="course-name">{course.name}</td>
                  <td className="text-center">{course.credits}</td>
                  <td className="text-center">{course.grades?.attendance ?? '—'}</td>
                  <td className="text-center">{course.grades?.midterm ?? '—'}</td>
                  <td className="text-center">{course.grades?.final ?? '—'}</td>
                  <td className="text-center">
                    {isPredicting ? (
                      <input 
                        type="number" 
                        min="0" max="10" step="0.1" 
                        className="input" 
                        style={{ width: 60, padding: '4px', textAlign: 'center', height: 28 }}
                        placeholder="Nháp"
                        value={predictedFinal != null ? predictedFinal : ''}
                        onChange={e => setPredictedGrades(prev => ({
                           ...prev,
                           [course.id]: e.target.value === '' ? null : parseFloat(e.target.value)
                        }))}
                      />
                    ) : '—'}
                  </td>
                  <td className="text-center score-col" style={{ fontWeight: isPredicting && predictedFinal != null ? 'bold' : 'normal' }}>
                    {score10 != null ? score10.toFixed(2) : '—'}
                  </td>
                  <td className="text-center gpa-col" style={{ fontWeight: isPredicting && predictedFinal != null ? 'bold' : 'normal', color: result ? (result.gpa4 >= 3.0 ? 'var(--color-success)' : result.gpa4 >= 2.0 ? 'var(--color-warning)' : 'var(--color-danger)') : 'inherit' }}>
                    {result ? result.gpa4.toFixed(1) : '—'}
                  </td>
                  <td className="text-center">
                    {result ? (
                      <Badge variant={result.gpa4 >= 3.0 ? 'success' : result.gpa4 >= 2.0 ? 'warning' : 'danger'} size="sm">
                        {result.letter}
                      </Badge>
                    ) : '—'}
                  </td>
                  <td>
                    <Badge variant="default" size="sm" color={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                  </td>
                  <td>
                    <div className="course-actions">
                      <button className="action-btn" onClick={() => onEdit(course)} title="Sửa">
                        <Pencil size={14} />
                      </button>
                      <button className="action-btn action-btn--danger" onClick={() => {
                        if (confirm('Xóa môn học này?')) deleteCourse(course.id);
                      }} title="Xóa">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
