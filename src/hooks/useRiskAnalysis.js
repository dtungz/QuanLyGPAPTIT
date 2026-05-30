import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { analyzeSemesterRisk } from '../utils/riskAnalyzer';

export function useRiskAnalysis(semesterId) {
  const { courses, settings } = useAppContext();
  const gradeScale = settings?.gradeScale;

  const analysis = useMemo(() => {
    const semCourses = semesterId
      ? courses.filter(c => c.semesterId === semesterId)
      : courses.filter(c => c.status === 'in-progress');
    return analyzeSemesterRisk(semCourses, gradeScale);
  }, [courses, semesterId, gradeScale]);

  return analysis;
}
