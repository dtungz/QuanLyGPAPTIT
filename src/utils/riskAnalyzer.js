import { calculateMinFinalScore } from './gpaCalculator';

// Analyze risk for a single course
export function analyzeCourseRisk(course, gradeScale) {
  // Only analyze in-progress courses
  if (course.status !== 'in-progress') {
    return { level: 'none', message: '' };
  }

  // Check if we have enough data to analyze
  const hasPartialGrades = 
    course.grades?.attendance != null || 
    course.grades?.midterm != null ||
    (course.grades?.other && course.grades.other.some(o => o.score != null));

  if (!hasPartialGrades) {
    return { level: 'unknown', message: 'Chưa có dữ liệu điểm' };
  }

  // Calculate min final score needed to pass (5.0 = D)
  const minToPass = calculateMinFinalScore(course, 5.0, gradeScale);
  // Min final score for C (5.5)
  const minForC = calculateMinFinalScore(course, 5.5, gradeScale);
  // Min final score for B (7.0)
  const minForB = calculateMinFinalScore(course, 7.0, gradeScale);

  if (minToPass === null) {
    return { level: 'unknown', message: 'Không đủ dữ liệu tính toán' };
  }

  if (minToPass > 10) {
    return {
      level: 'danger',
      message: `Không thể đạt điểm qua môn. Cần tối thiểu ${minToPass.toFixed(1)} điểm cuối kỳ.`,
      minToPass,
      minForC,
      minForB,
    };
  }

  if (minToPass > 7) {
    return {
      level: 'danger',
      message: `Cần tối thiểu ${minToPass.toFixed(1)} điểm cuối kỳ để qua môn.`,
      minToPass,
      minForC,
      minForB,
    };
  }

  if (minToPass > 5) {
    return {
      level: 'warning',
      message: `Cần ${minToPass.toFixed(1)} điểm cuối kỳ để qua môn. Nên cố gắng!`,
      minToPass,
      minForC,
      minForB,
    };
  }

  return {
    level: 'safe',
    message: `Chỉ cần ${minToPass.toFixed(1)} điểm cuối kỳ để qua.${minForB && minForB <= 10 ? ` Cần ${minForB.toFixed(1)} để đạt loại Khá.` : ''}`,
    minToPass,
    minForC,
    minForB,
  };
}

// Analyze risk for all courses in a semester
export function analyzeSemesterRisk(courses, gradeScale) {
  const results = courses
    .filter(c => c.status === 'in-progress')
    .map(course => ({
      course,
      risk: analyzeCourseRisk(course, gradeScale),
    }));

  const dangerCount = results.filter(r => r.risk.level === 'danger').length;
  const warningCount = results.filter(r => r.risk.level === 'warning').length;
  const safeCount = results.filter(r => r.risk.level === 'safe').length;

  return {
    courses: results,
    summary: { dangerCount, warningCount, safeCount, total: results.length },
  };
}
