import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateSemesterGPA, calculateCumulativeGPA, getClassification } from '../utils/gpaCalculator';

export function useGPA() {
  const { courses, semesters, settings } = useAppContext();
  const gradeScale = settings?.gradeScale;

  const semesterGPAs = useMemo(() => {
    return semesters.map(semester => {
      const semCourses = courses.filter(c => c.semesterId === semester.id);
      const result = calculateSemesterGPA(semCourses, gradeScale);
      return {
        ...semester,
        ...result,
        classification: getClassification(result.gpa4),
      };
    });
  }, [semesters, courses, gradeScale]);

  const cumulative = useMemo(() => {
    const allCompleted = courses.filter(c => c.status !== 'withdrawn');
    const result = calculateCumulativeGPA(allCompleted, gradeScale);
    return {
      ...result,
      classification: getClassification(result.gpa4),
    };
  }, [courses, gradeScale]);

  const completedCredits = useMemo(() => {
    return courses
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + (c.credits || 0), 0);
  }, [courses]);

  const totalCreditsRequired = settings?.totalCreditsRequired || 0;

  return {
    semesterGPAs,
    cumulative,
    completedCredits,
    totalCreditsRequired,
    gradeScale,
  };
}
