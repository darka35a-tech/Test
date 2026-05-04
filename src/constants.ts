import { Assignment } from "./types";

export const FIXED_ASSIGNMENTS: Assignment[] = [
  { id: 'hw1', title: 'الواجب ١', maxScore: 10, weight: 1 },
  { id: 'hw2', title: 'الواجب ٢', maxScore: 10, weight: 1 },
  { id: 'test1', title: 'الاختبار الاول', maxScore: 20, weight: 1 },
  { id: 'test2', title: 'الاختبار الثاني', maxScore: 20, weight: 1 },
  { id: 'behavior', title: 'السلوك', maxScore: 10, weight: 1 },
  { id: 'participation1', title: 'المشاركة الصفية ١', maxScore: 15, weight: 1 },
  { id: 'participation2', title: 'المشاركة الصفية ٢', maxScore: 15, weight: 1 },
];

export const getLetterGrade = (percentage: number) => {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
};
