import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

export function useSemester() {
  const { semesters, courses } = useAppContext();

  const currentSemester = useMemo(() => {
    const now = new Date();
    return semesters.find(s => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      return now >= start && now <= end;
    }) || semesters[semesters.length - 1] || null;
  }, [semesters]);

  const getSemesterCourses = (semesterId) => {
    return courses.filter(c => c.semesterId === semesterId);
  };

  const semesterOptions = useMemo(() => {
    return semesters.map(s => ({
      value: s.id,
      label: `${s.name} (${s.year})`,
    }));
  }, [semesters]);

  return {
    currentSemester,
    semesters,
    getSemesterCourses,
    semesterOptions,
  };
}
