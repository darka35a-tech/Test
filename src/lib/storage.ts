import { type Class, type TeacherData } from "../types";

const STORAGE_KEY = "nibras_teacher_data";

const DEFAULT_DATA: TeacherData = {
  classes: [
    {
      id: "1",
      name: "الصف الأول - أ",
      students: [
        { id: "s1", name: "أحمد محمد", grades: { "عربي": { "hw1": 9, "test1": 18 } }, attendance: [] },
        { id: "s2", name: "سارة خالد", grades: { "عربي": { "hw1": 10, "test1": 20 } }, attendance: [] },
        { id: "s3", name: "عبدالله عمر", grades: { "عربي": { "hw1": 8, "test1": 15 } }, attendance: ["2024-05-01"] },
      ],
      assignments: [
        { id: "a1", title: "اختبار دوري 1", maxScore: 100, weight: 20 },
        { id: "a2", title: "مشاركة صفية", maxScore: 100, weight: 10 },
      ],
    },
    {
      id: "2",
      name: "الصف الثاني - ب",
      students: [],
      assignments: [],
    }
  ],
  teachers: [],
};

export const loadData = (): TeacherData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      
      // Migration: Ensure teachers array exists
      if (!data.teachers) {
        data.teachers = [];
      }
      
      // Migration: Ensure classes array exists
      if (!data.classes) {
        data.classes = [];
      }

      // Migration: ensure each teacher has the new fields (subject, assignedClassIds)
      data.teachers = data.teachers.map((t: any) => ({
        ...t,
        subject: t.subject || "عام",
        assignedClassIds: t.assignedClassIds || []
      }));

      return data;
    } catch (e) {
      console.error("Failed to parse local storage", e);
    }
  }
  return DEFAULT_DATA;
};

export const saveData = (data: TeacherData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
