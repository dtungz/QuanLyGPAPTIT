import { DEFAULT_GRADE_SCALES, CLASSIFICATION_BY_GPA4 } from './constants';

// Calculate weighted average score (he 10)
export function calculateScore10(grades, weights) {
  if (!grades || !weights) return null;
  
  let totalScore = 0;
  let totalWeight = 0;

  if (grades.attendance != null && weights.attendance) {
    totalScore += grades.attendance * weights.attendance;
    totalWeight += weights.attendance;
  }
  if (grades.midterm != null && weights.midterm) {
    totalScore += grades.midterm * weights.midterm;
    totalWeight += weights.midterm;
  }
  if (grades.final != null && weights.final) {
    totalScore += grades.final * weights.final;
    totalWeight += weights.final;
  }
  if (grades.other != null && !Array.isArray(grades.other) && weights.other) {
    totalScore += grades.other * weights.other;
    totalWeight += weights.other;
  } else if (grades.other && Array.isArray(grades.other)) {
    grades.other.forEach(item => {
      if (item.score != null && item.weight) {
        totalScore += item.score * item.weight;
        totalWeight += item.weight;
      }
    });
  }

  if (totalWeight === 0) return null;
  return Math.round((totalScore / totalWeight) * 100) / 100;
}

// Convert score10 to GPA4 using grade scale
export function score10ToGPA4(score10, gradeScale) {
  if (score10 == null) return null;
  const scale = gradeScale?.scale || DEFAULT_GRADE_SCALES[0].scale;
  
  let bestLevel = scale[scale.length - 1] || { gpa4: 0, letter: 'F', classification: 'Kém' };
  let highestMin = -1;

  for (const level of scale) {
    if (score10 >= level.minScore && level.minScore > highestMin) {
      bestLevel = level;
      highestMin = level.minScore;
    }
  }

  return { gpa4: bestLevel.gpa4, letter: bestLevel.letter, classification: bestLevel.classification };
}

// Calculate semester GPA
export function calculateSemesterGPA(courses, gradeScale) {
  const validCourses = courses.filter(c => {
    const score = calculateScore10(c.grades, c.weights);
    return score != null && c.credits > 0 && c.status !== 'withdrawn';
  });

  if (validCourses.length === 0) return { gpa4: 0, gpa10: 0, totalCredits: 0, courses: [] };

  let totalWeightedGPA4 = 0;
  let totalWeightedScore10 = 0;
  let totalCredits = 0;
  const processedCourses = [];

  validCourses.forEach(course => {
    const score10 = calculateScore10(course.grades, course.weights);
    const result = score10ToGPA4(score10, gradeScale);
    
    totalWeightedGPA4 += result.gpa4 * course.credits;
    totalWeightedScore10 += score10 * course.credits;
    totalCredits += course.credits;

    processedCourses.push({
      ...course,
      calculatedScore10: score10,
      calculatedGPA4: result.gpa4,
      letterGrade: result.letter,
      classification: result.classification,
    });
  });

  return {
    gpa4: Math.round((totalWeightedGPA4 / totalCredits) * 100) / 100,
    gpa10: Math.round((totalWeightedScore10 / totalCredits) * 100) / 100,
    totalCredits,
    courses: processedCourses,
  };
}

// Calculate cumulative GPA across all semesters
export function calculateCumulativeGPA(allCourses, gradeScale) {
  return calculateSemesterGPA(allCourses, gradeScale);
}

// Get classification label from GPA4
export function getClassification(gpa4) {
  if (gpa4 == null) return { label: '—', color: 'var(--text-muted)' };
  for (const c of CLASSIFICATION_BY_GPA4) {
    if (gpa4 >= c.min && gpa4 <= c.max) return c;
  }
  return { label: 'Kém', color: 'var(--color-danger)' };
}

// Calculate minimum final exam score needed to reach target GPA
export function calculateMinFinalScore(course, targetScore10, gradeScale) {
  if (!course.weights?.final) return null;
  
  let currentScore = 0;
  let currentWeight = 0;

  if (course.grades?.attendance != null && course.weights.attendance) {
    currentScore += course.grades.attendance * course.weights.attendance;
    currentWeight += course.weights.attendance;
  }
  if (course.grades?.midterm != null && course.weights.midterm) {
    currentScore += course.grades.midterm * course.weights.midterm;
    currentWeight += course.weights.midterm;
  }
  if (course.grades?.other != null && !Array.isArray(course.grades?.other) && course.weights?.other) {
    currentScore += course.grades.other * course.weights.other;
    currentWeight += course.weights.other;
  } else if (course.grades?.other && Array.isArray(course.grades?.other)) {
    course.grades.other.forEach(item => {
      if (item.score != null && item.weight) {
        currentScore += item.score * item.weight;
        currentWeight += item.weight;
      }
    });
  }

  const remainingWeight = 100 - currentWeight;
  if (remainingWeight <= 0) return null;

  const neededScore = ((targetScore10 * 100) - currentScore) / remainingWeight;
  return Math.round(neededScore * 100) / 100;
}
