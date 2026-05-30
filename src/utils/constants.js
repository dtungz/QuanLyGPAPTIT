// Thang điểm mặc định - Học viện Công nghệ Bưu chính Viễn thông (PTIT)
export const DEFAULT_GRADE_SCALES = [
  {
    id: 'ptit-default',
    name: 'PTIT - Mặc định',
    type: 'preset',
    scale: [
      { letter: 'A+', minScore: 8.95, maxScore: 10.0, gpa4: 4.0, classification: 'Xuất sắc' },
      { letter: 'A', minScore: 8.45, maxScore: 8.94, gpa4: 3.7, classification: 'Giỏi' },
      { letter: 'B+', minScore: 7.95, maxScore: 8.44, gpa4: 3.5, classification: 'Giỏi' },
      { letter: 'B', minScore: 6.95, maxScore: 7.94, gpa4: 3.0, classification: 'Khá' },
      { letter: 'C+', minScore: 6.45, maxScore: 6.94, gpa4: 2.5, classification: 'Khá' },
      { letter: 'C', minScore: 5.45, maxScore: 6.44, gpa4: 2.0, classification: 'Trung bình' },
      { letter: 'D+', minScore: 4.95, maxScore: 5.44, gpa4: 1.5, classification: 'Trung bình' },
      { letter: 'D', minScore: 3.95, maxScore: 4.94, gpa4: 1.0, classification: 'Yếu' },
      { letter: 'F', minScore: 0.0, maxScore: 3.94, gpa4: 0.0, classification: 'Kém' },
    ],
  },
  {
    id: 'standard-4',
    name: 'Hệ 4 - Chuẩn Bộ GD&ĐT',
    type: 'preset',
    scale: [
      { letter: 'A', minScore: 8.5, maxScore: 10.0, gpa4: 4.0, classification: 'Giỏi' },
      { letter: 'B+', minScore: 7.7, maxScore: 8.49, gpa4: 3.5, classification: 'Khá giỏi' },
      { letter: 'B', minScore: 7.0, maxScore: 7.69, gpa4: 3.0, classification: 'Khá' },
      { letter: 'C+', minScore: 6.3, maxScore: 6.99, gpa4: 2.5, classification: 'Trung bình khá' },
      { letter: 'C', minScore: 5.5, maxScore: 6.29, gpa4: 2.0, classification: 'Trung bình' },
      { letter: 'D+', minScore: 4.7, maxScore: 5.49, gpa4: 1.5, classification: 'Trung bình yếu' },
      { letter: 'D', minScore: 4.0, maxScore: 4.69, gpa4: 1.0, classification: 'Yếu' },
      { letter: 'F', minScore: 0.0, maxScore: 3.99, gpa4: 0.0, classification: 'Kém' },
    ],
  },
];

export const CLASSIFICATION_BY_GPA4 = [
  { min: 3.6, max: 4.0, label: 'Xuất sắc', color: 'var(--color-primary)' },
  { min: 3.2, max: 3.59, label: 'Giỏi', color: 'var(--color-success)' },
  { min: 2.5, max: 3.19, label: 'Khá', color: 'var(--color-secondary)' },
  { min: 2.0, max: 2.49, label: 'Trung bình', color: 'var(--color-warning)' },
  { min: 1.0, max: 1.99, label: 'Yếu', color: 'var(--color-danger)' },
  { min: 0.0, max: 0.99, label: 'Kém', color: 'var(--color-danger)' },
];

export const DEFAULT_WEIGHTS = {
  attendance: 10,
  midterm: 30,
  final: 50,
  other: 10,
};

export const DAYS_OF_WEEK = [
  { value: 1, label: 'Thứ 2' },
  { value: 2, label: 'Thứ 3' },
  { value: 3, label: 'Thứ 4' },
  { value: 4, label: 'Thứ 5' },
  { value: 5, label: 'Thứ 6' },
  { value: 6, label: 'Thứ 7' },
  { value: 0, label: 'Chủ nhật' },
];

export const ATTENDANCE_STATUS = {
  present: { label: 'Có mặt', icon: '✅', color: 'var(--color-success)' },
  absent: { label: 'Vắng', icon: '❌', color: 'var(--color-danger)' },
  excused: { label: 'Có phép', icon: '📝', color: 'var(--color-warning)' },
  late: { label: 'Muộn', icon: '⏰', color: 'var(--color-warning)' },
};

export const COURSE_STATUS = {
  'in-progress': { label: 'Đang học', color: 'var(--color-secondary)' },
  completed: { label: 'Hoàn thành', color: 'var(--color-success)' },
  failed: { label: 'Rớt', color: 'var(--color-danger)' },
  withdrawn: { label: 'Rút môn', color: 'var(--text-muted)' },
};

export const RISK_LEVELS = {
  safe: { label: 'An toàn', icon: '🟢', color: 'var(--color-success)', bgColor: 'var(--color-success-bg)' },
  warning: { label: 'Cảnh báo', icon: '🟡', color: 'var(--color-warning)', bgColor: 'var(--color-warning-bg)' },
  danger: { label: 'Nguy hiểm', icon: '🔴', color: 'var(--color-danger)', bgColor: 'var(--color-danger-bg)' },
};

export const SYNC_STATUS = {
  synced: { label: 'Đã đồng bộ', color: 'var(--color-success)' },
  syncing: { label: 'Đang đồng bộ...', color: 'var(--color-secondary)' },
  pending: { label: 'Chưa đồng bộ', color: 'var(--color-warning)' },
  offline: { label: 'Ngoại tuyến', color: 'var(--text-muted)' },
  error: { label: 'Lỗi đồng bộ', color: 'var(--color-danger)' },
  disconnected: { label: 'Chưa kết nối', color: 'var(--text-muted)' },
};

export const APP_NAME = 'GPA Manager';
export const APP_VERSION = '1.0.0';
export const GIST_FILENAME = 'gpa-manager-data.json';
export const DATA_VERSION = 2;
export const SYNC_DEBOUNCE_MS = 3000;
