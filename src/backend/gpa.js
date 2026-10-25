/*
 * GPA math, following Texas A&M's "How to Calculate GPA" guide:
 * https://aggie.tamu.edu/my-courses-and-registration/final-exams-and-grades/how-to-calculate-gpa.html
 *
 *   1. Each letter grade is worth a number of grade points per credit hour.
 *   2. Grade points for a class = points per hour x credit hours.
 *   3. GPA = total grade points / total hours attempted.
 */
export const GRADE_POINTS = { A: 4, B: 3, C: 2, D: 1, F: 0 };

/* classes: [{ subject, grade, hours }] -> { gpa, totalPoints, totalHours } */
export function calculateGpa(classes) {
  if (!Array.isArray(classes)) throw new Error("classes must be a list");

  let totalPoints = 0;
  let totalHours = 0;

  classes.forEach((c, i) => {
    const grade = String(c?.grade ?? "").trim().toUpperCase();
    const hours = Number(c?.hours);

    if (!(grade in GRADE_POINTS)) {
      throw new Error(`Class ${i + 1}: grade must be one of ${Object.keys(GRADE_POINTS).join(", ")}`);
    }
    if (!Number.isFinite(hours) || hours <= 0) {
      throw new Error(`Class ${i + 1}: credit hours must be a positive number`);
    }

    totalPoints += GRADE_POINTS[grade] * hours;
    totalHours += hours;
  });

  // Reported to three decimals, like the worked example (26 points / 13 hours = 2.000).
  const gpa = totalHours === 0 ? null : (totalPoints / totalHours).toFixed(3);
  return { gpa, totalPoints, totalHours };
}
