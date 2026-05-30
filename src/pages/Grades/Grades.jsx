import { useState } from 'react';
import { GraduationCap, Plus, Filter } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useSemester } from '../../hooks/useSemester';
import { useGPA } from '../../hooks/useGPA';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SemesterList from './SemesterList';
import CourseTable from './CourseTable';
import CourseForm from './CourseForm';
import EmptyState from '../../components/ui/EmptyState';
import './Grades.css';

export default function Grades() {
  const { semesters, addSemester } = useAppContext();
  const { currentSemester, semesterOptions } = useSemester();
  const { semesterGPAs } = useGPA();
  const [selectedSemId, setSelectedSemId] = useState(currentSemester?.id || '');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleAddSemester = () => {
    const year = new Date().getFullYear();
    const semNum = semesters.length + 1;
    addSemester({
      name: `Học kỳ ${semNum}`,
      year: `${year}-${year + 1}`,
      startDate: '',
      endDate: '',
      targetGPA: 3.0,
    });
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const handleCloseForm = () => {
    setShowCourseForm(false);
    setEditingCourse(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>
              <GraduationCap size={28} style={{ verticalAlign: 'middle', marginRight: 10 }} />
              Bảng điểm
            </h1>
            <p>Quản lý học phần và điểm số chi tiết</p>
          </div>
          <div className="flex gap-sm">
            <Button variant="secondary" icon={Plus} onClick={handleAddSemester}>
              Thêm học kỳ
            </Button>
            {selectedSemId && (
              <Button variant="primary" icon={Plus} onClick={() => setShowCourseForm(true)}>
                Thêm môn học
              </Button>
            )}
          </div>
        </div>
      </div>

      {semesters.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Chưa có học kỳ nào"
          description="Tạo học kỳ đầu tiên để bắt đầu quản lý điểm."
          action={handleAddSemester}
          actionLabel="Tạo học kỳ"
          actionIcon={Plus}
        />
      ) : (
        <>
          <SemesterList
            semesters={semesters}
            semesterGPAs={semesterGPAs}
            selectedId={selectedSemId}
            onSelect={setSelectedSemId}
          />

          {selectedSemId && (
            <CourseTable
              semesterId={selectedSemId}
              onEdit={handleEditCourse}
            />
          )}
        </>
      )}

      {showCourseForm && (
        <CourseForm
          semesterId={selectedSemId}
          course={editingCourse}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
