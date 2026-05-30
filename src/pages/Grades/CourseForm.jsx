import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Modal from '../../components/ui/Modal';
import Input, { Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { DEFAULT_WEIGHTS, COURSE_STATUS, DAYS_OF_WEEK } from '../../utils/constants';
import { calculateScore10, score10ToGPA4 } from '../../utils/gpaCalculator';
import { Save, X } from 'lucide-react';
import './CourseForm.css';

const statusOptions = Object.entries(COURSE_STATUS).map(([value, { label }]) => ({ value, label }));
const dayOptions = DAYS_OF_WEEK.map(d => ({ value: String(d.value), label: d.label }));

const PTIT_WEIGHT_PRESETS = [
  { label: 'Chọn mẫu tỉ lệ PTIT...', value: '' },
  { label: '10-20-20-50 (CC-BT-GK-CK)', value: '10,20,20,50' },
  { label: '10-10-30-50 (CC-BT-GK-CK)', value: '10,10,30,50' },
  { label: '10-10-10-70 (CC-BT-GK-CK)', value: '10,10,10,70' },
  { label: '10-10-20-60 (CC-BT-GK-CK)', value: '10,10,20,60' },
  { label: '10-30-60 (CC-GK-CK)', value: '10,0,30,60' },
  { label: '10-20-70 (CC-GK-CK)', value: '10,0,20,70' },
  { label: '10-10-80 (CC-GK-CK)', value: '10,0,10,80' },
];

export default function CourseForm({ semesterId, course, onClose }) {
  const { addCourse, updateCourse, settings } = useAppContext();
  const isEditing = !!course;

  const [form, setForm] = useState({
    code: course?.code || '',
    name: course?.name || '',
    credits: course?.credits || 3,
    status: course?.status || 'in-progress',
    grades: {
      attendance: course?.grades?.attendance ?? '',
      midterm: course?.grades?.midterm ?? '',
      final: course?.grades?.final ?? '',
      other: course?.grades?.other || [],
    },
    weights: course?.weights || { ...DEFAULT_WEIGHTS },
    schedule: {
      dayOfWeek: course?.schedule?.dayOfWeek ?? '',
      startTime: course?.schedule?.startTime || '',
      endTime: course?.schedule?.endTime || '',
      room: course?.schedule?.room || '',
      teacher: course?.schedule?.teacher || '',
    },
  });

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateGrade = (field, value) => setForm(prev => ({
    ...prev, grades: { ...prev.grades, [field]: value === '' ? '' : parseFloat(value) || 0 }
  }));
  const updateWeight = (field, value) => setForm(prev => ({
    ...prev, weights: { ...prev.weights, [field]: parseInt(value) || 0 }
  }));
  const updateSchedule = (field, value) => setForm(prev => ({
    ...prev, schedule: { ...prev.schedule, [field]: value }
  }));

  const handlePresetChange = (value) => {
    if (!value) return;
    const [att, oth, mid, fin] = value.split(',').map(Number);
    setForm(prev => ({
      ...prev,
      weights: {
        attendance: att,
        other: oth,
        midterm: mid,
        final: fin
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseData = {
      ...form,
      semesterId,
      credits: parseInt(form.credits) || 0,
      grades: {
        ...form.grades,
        attendance: form.grades.attendance === '' ? null : form.grades.attendance,
        other: form.grades.other === '' ? null : (typeof form.grades.other === 'number' ? form.grades.other : []),
        midterm: form.grades.midterm === '' ? null : form.grades.midterm,
        final: form.grades.final === '' ? null : form.grades.final,
      },
      schedule: {
        ...form.schedule,
        dayOfWeek: form.schedule.dayOfWeek === '' ? null : parseInt(form.schedule.dayOfWeek),
      },
    };

    if (isEditing) {
      updateCourse(course.id, courseData);
    } else {
      addCourse(courseData);
    }
    onClose();
  };

  const calculatedScore = calculateScore10(form.grades, form.weights);
  const calculatedGPA = score10ToGPA4(calculatedScore, settings?.gradeScale);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Sửa môn học' : 'Thêm môn học mới'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button variant="primary" icon={Save} onClick={handleSubmit}>
            {isEditing ? 'Cập nhật' : 'Thêm'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-section">
          <h3 className="form-section__title">Thông tin học phần</h3>
          <div className="form-row">
            <Input label="Mã học phần" value={form.code} onChange={e => updateField('code', e.target.value)} placeholder="VD: CS101" required />
            <Input label="Tên học phần" value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="VD: Nhập môn lập trình" required />
          </div>
          <div className="form-row form-row--3">
            <Input label="Số tín chỉ" type="number" min="1" max="10" value={form.credits} onChange={e => updateField('credits', e.target.value)} />
            <Select label="Trạng thái" options={statusOptions} value={form.status} onChange={e => updateField('status', e.target.value)} />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section__title">Điểm số</h3>
          <div className="form-row form-row--4">
            <Input label="Chuyên cần" type="number" min="0" max="10" step="0.1" value={form.grades.attendance} onChange={e => updateGrade('attendance', e.target.value)} placeholder="0-10" />
            <Input label="Bài tập/Thực hành" type="number" min="0" max="10" step="0.1" value={typeof form.grades.other === 'number' ? form.grades.other : ''} onChange={e => updateGrade('other', e.target.value)} placeholder="0-10" />
            <Input label="Giữa kỳ" type="number" min="0" max="10" step="0.1" value={form.grades.midterm} onChange={e => updateGrade('midterm', e.target.value)} placeholder="0-10" />
            <Input label="Cuối kỳ" type="number" min="0" max="10" step="0.1" value={form.grades.final} onChange={e => updateGrade('final', e.target.value)} placeholder="0-10" />
          </div>
          <div className="form-preview" style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--background-alt)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Điểm tổng kết dự kiến</span>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {calculatedScore != null ? calculatedScore.toFixed(2) : '--'}
              </div>
            </div>
            {calculatedScore != null && calculatedGPA && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Hệ 4: {calculatedGPA.gpa4.toFixed(1)}</span>
                <div>
                  <span className="badge badge--primary" style={{ marginRight: 4 }}>{calculatedGPA.letter}</span>
                  <span className="badge badge--secondary">{calculatedGPA.classification}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 className="form-section__title" style={{ paddingBottom: 0, borderBottom: 'none' }}>Trọng số (%)</h3>
            <div style={{ width: 220 }}>
              <Select 
                options={PTIT_WEIGHT_PRESETS}
                onChange={e => handlePresetChange(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row form-row--4">
            <Input label="Chuyên cần" type="number" min="0" max="100" value={form.weights.attendance} onChange={e => updateWeight('attendance', e.target.value)} suffix="%" />
            <Input label="Bài tập/Thực hành" type="number" min="0" max="100" value={form.weights.other} onChange={e => updateWeight('other', e.target.value)} suffix="%" />
            <Input label="Giữa kỳ" type="number" min="0" max="100" value={form.weights.midterm} onChange={e => updateWeight('midterm', e.target.value)} suffix="%" />
            <Input label="Cuối kỳ" type="number" min="0" max="100" value={form.weights.final} onChange={e => updateWeight('final', e.target.value)} suffix="%" />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section__title">Lịch học</h3>
          <div className="form-row form-row--3">
            <Select label="Thứ" options={dayOptions} placeholder="Chọn thứ" value={String(form.schedule.dayOfWeek)} onChange={e => updateSchedule('dayOfWeek', e.target.value)} />
            <Input label="Giờ bắt đầu" type="time" value={form.schedule.startTime} onChange={e => updateSchedule('startTime', e.target.value)} />
            <Input label="Giờ kết thúc" type="time" value={form.schedule.endTime} onChange={e => updateSchedule('endTime', e.target.value)} />
          </div>
          <div className="form-row">
            <Input label="Phòng học" value={form.schedule.room} onChange={e => updateSchedule('room', e.target.value)} placeholder="VD: A301" />
            <Input label="Giảng viên" value={form.schedule.teacher} onChange={e => updateSchedule('teacher', e.target.value)} placeholder="VD: Nguyễn Văn A" />
          </div>
        </div>
      </form>
    </Modal>
  );
}
