import { createContext, useContext, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_GRADE_SCALES } from '../utils/constants';

const AppContext = createContext(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}

export function AppProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('settings', {
    gradeScale: DEFAULT_GRADE_SCALES[0],
    totalCreditsRequired: 0,
    darkMode: true,
  });
  const [semesters, setSemesters] = useLocalStorage('semesters', []);
  const [courses, setCourses] = useLocalStorage('courses', []);
  const [attendance, setAttendance] = useLocalStorage('attendance', []);
  const [scheduleNotes, setScheduleNotes] = useLocalStorage('scheduleNotes', []);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      settings.darkMode ? 'dark' : 'light'
    );
  }, [settings.darkMode]);

  // Settings
  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, [setSettings]);

  const toggleDarkMode = useCallback(() => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, [setSettings]);

  // Semesters CRUD
  const addSemester = useCallback((semester) => {
    const newSem = { ...semester, id: semester.id || `sem-${Date.now()}` };
    setSemesters(prev => [...prev, newSem]);
    return newSem;
  }, [setSemesters]);

  const updateSemester = useCallback((id, updates) => {
    setSemesters(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, [setSemesters]);

  const deleteSemester = useCallback((id) => {
    setSemesters(prev => prev.filter(s => s.id !== id));
    setCourses(prev => prev.filter(c => c.semesterId !== id));
  }, [setSemesters, setCourses]);

  // Courses CRUD
  const addCourse = useCallback((course) => {
    const newCourse = { ...course, id: course.id || `course-${Date.now()}` };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  }, [setCourses]);

  const updateCourse = useCallback((id, updates) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, [setCourses]);

  const deleteCourse = useCallback((id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setAttendance(prev => prev.filter(a => a.courseId !== id));
  }, [setCourses, setAttendance]);

  // Attendance CRUD
  const addAttendance = useCallback((record) => {
    const newRecord = { ...record, id: record.id || `att-${Date.now()}` };
    setAttendance(prev => [...prev, newRecord]);
    return newRecord;
  }, [setAttendance]);

  const updateAttendance = useCallback((id, updates) => {
    setAttendance(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, [setAttendance]);

  const deleteAttendance = useCallback((id) => {
    setAttendance(prev => prev.filter(a => a.id !== id));
  }, [setAttendance]);

  // Schedule Notes CRUD
  const addScheduleNote = useCallback((note) => {
    const newNote = { ...note, id: note.id || `note-${Date.now()}` };
    setScheduleNotes(prev => [...prev, newNote]);
    return newNote;
  }, [setScheduleNotes]);

  const updateScheduleNote = useCallback((id, updates) => {
    setScheduleNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  }, [setScheduleNotes]);

  const deleteScheduleNote = useCallback((id) => {
    setScheduleNotes(prev => prev.filter(n => n.id !== id));
  }, [setScheduleNotes]);

  // Reload data from localStorage (used after sync pull)
  const reloadFromStorage = useCallback(() => {
    const prefix = 'gpa-manager-';
    const loadKey = (key, fallback) => {
      try {
        const raw = localStorage.getItem(prefix + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch { return fallback; }
    };
    setSettings(loadKey('settings', settings));
    setSemesters(loadKey('semesters', []));
    setCourses(loadKey('courses', []));
    setAttendance(loadKey('attendance', []));
    setScheduleNotes(loadKey('scheduleNotes', []));
  }, []);

  const sortedSemesters = [...semesters].sort((a, b) => {
    const yearA = a.year || '';
    const yearB = b.year || '';
    if (yearA !== yearB) return yearA.localeCompare(yearB);
    const nameA = a.name || '';
    const nameB = b.name || '';
    return nameA.localeCompare(nameB);
  });

  const value = {
    settings, updateSettings, toggleDarkMode,
    semesters: sortedSemesters, addSemester, updateSemester, deleteSemester,
    courses, addCourse, updateCourse, deleteCourse,
    attendance, addAttendance, updateAttendance, deleteAttendance,
    scheduleNotes, addScheduleNote, updateScheduleNote, deleteScheduleNote,
    reloadFromStorage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
