import { calculateScore10, score10ToGPA4, calculateSemesterGPA } from './gpaCalculator';

// Simulate GPA with hypothetical grades
export function simulateGrades(courses, simulations, gradeScale) {
  const simulatedCourses = courses.map(course => {
    const sim = simulations[course.id];
    if (!sim) return course;

    return {
      ...course,
      grades: {
        ...course.grades,
        ...sim,
      },
      status: 'completed',
    };
  });

  return calculateSemesterGPA(simulatedCourses, gradeScale);
}

// Calculate what GPA is needed in remaining courses to achieve target cumulative GPA
export function calculateNeededGPA(completedCredits, currentCumulativeGPA4, targetGPA4, remainingCredits) {
  if (remainingCredits <= 0) return null;
  
  const totalCredits = completedCredits + remainingCredits;
  const neededTotal = targetGPA4 * totalCredits;
  const currentTotal = currentCumulativeGPA4 * completedCredits;
  const needed = (neededTotal - currentTotal) / remainingCredits;
  
  return Math.round(needed * 100) / 100;
}

// Generate scenario: best case, worst case, realistic
export function generateScenarios(course) {
  const base = { ...course.grades };
  
  return {
    best: {
      ...base,
      final: base.final ?? 10,
      midterm: base.midterm ?? 9,
      attendance: base.attendance ?? 10,
    },
    realistic: {
      ...base,
      final: base.final ?? 7,
      midterm: base.midterm ?? 7,
      attendance: base.attendance ?? 8,
    },
    worst: {
      ...base,
      final: base.final ?? 4,
      midterm: base.midterm ?? 5,
      attendance: base.attendance ?? 6,
    },
  };
}
