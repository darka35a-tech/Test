import React, { useState } from "react";
import { type TeacherData, type Student } from "../types";
import { FIXED_ASSIGNMENTS, getLetterGrade } from "../constants";
import { 
  FileText, 
  Download, 
  Search,
  BookOpen,
  Filter,
  CheckCircle2
} from "lucide-react";
import { cn } from "../lib/utils";

interface ComprehensiveReportViewProps {
  teacherData: TeacherData;
}

export default function ComprehensiveReportView({ teacherData }: ComprehensiveReportViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string>("all");

  const SUBJECTS = ["عربي", "انجليزي", "علوم", "رياضيات"];

  const maxPossiblePerSubject = FIXED_ASSIGNMENTS.reduce((acc, a) => acc + (a.maxScore || 0), 0);

  const studentsWithGrades = (teacherData.classes || [])
    .filter(c => selectedClassId === "all" || c.id === selectedClassId)
    .flatMap(c => 
      (c.students || []).map(s => {
        const subjectTotals: Record<string, number> = {};
        let grandTotal = 0;
        
        SUBJECTS.forEach(sub => {
          const subjectGrades = (s.grades || {})[sub] || {};
          const total = FIXED_ASSIGNMENTS.reduce((acc, a) => acc + (subjectGrades[a.id] || 0), 0);
          subjectTotals[sub] = total;
          grandTotal += total;
        });

        const overallPercentage = (grandTotal / (maxPossiblePerSubject * SUBJECTS.length)) * 100;

        return {
          ...s,
          className: c.name,
          classId: c.id,
          subjectTotals,
          grandTotal,
          overallPercentage,
          letterGrade: getLetterGrade(overallPercentage)
        };
      })
    )
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-indigo-950 flex items-center gap-3">
            <FileText className="text-indigo-600" />
            التقرير الشامل لدرجات الطلاب
          </h2>
          <p className="text-indigo-800/60 font-medium">عرض جميع درجات الطلاب في كافة المواد الدراسية</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-200">
          <Download size={20} />
          <span>تصدير التقرير النهائي (Excel)</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="البحث عن طالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-4 bg-white/60 border border-white/40 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full pr-12 pl-4 py-4 bg-white/60 border border-white/40 rounded-2xl appearance-none cursor-pointer outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-indigo-950"
          >
            <option value="all">جميع الفصول</option>
            {(teacherData.classes || []).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-indigo-600 font-bold text-white">
                <th className="p-5 w-64 text-right">اسم الطالب</th>
                <th className="p-5 text-center">الفصل</th>
                {SUBJECTS.map(sub => (
                  <th key={sub} className="p-5 text-center">{sub}</th>
                ))}
                <th className="p-5 text-center bg-indigo-700">المجموع النهائي</th>
                <th className="p-5 text-center bg-indigo-800">التقدير</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {studentsWithGrades.length > 0 ? (
                studentsWithGrades.map(s => (
                  <tr key={s.id} className="hover:bg-white/40 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                          {s.name.charAt(0)}
                        </div>
                        <span className="font-bold text-indigo-950">{s.name}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className="text-sm font-medium text-slate-500">{s.className}</span>
                    </td>
                    {SUBJECTS.map(sub => {
                      const total = s.subjectTotals[sub];
                      const percentage = (total / maxPossiblePerSubject) * 100;
                      return (
                        <td key={sub} className="p-5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={cn(
                              "font-black",
                              percentage >= 90 ? "text-emerald-600" :
                              percentage >= 75 ? "text-indigo-600" :
                              percentage >= 50 ? "text-amber-600" : "text-rose-600"
                            )}>
                              {total}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">{maxPossiblePerSubject}/</span>
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-5 text-center bg-indigo-50/30">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-indigo-700">
                          {s.grandTotal}
                        </span>
                        <span className="text-xs font-bold text-indigo-400">
                          {s.overallPercentage.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-center bg-indigo-50/50">
                      <span className={cn(
                        "w-10 h-10 inline-flex items-center justify-center rounded-xl font-black text-white shadow-sm ring-2 ring-indigo-500/10",
                        s.letterGrade === "A" ? "bg-emerald-500" :
                        s.letterGrade === "B" ? "bg-indigo-500" :
                        s.letterGrade === "C" ? "bg-amber-500" :
                        s.letterGrade === "D" ? "bg-orange-500" :
                        "bg-rose-500"
                      )}>
                        {s.letterGrade}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={SUBJECTS.length + 4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <Search size={48} className="opacity-20" />
                      <p className="text-lg font-bold">لا يوجد طلاب مطابقين للبحث</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/40 p-6 rounded-[2rem] border border-white/60 shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-1">إجمالي الطلاب</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-indigo-950">{studentsWithGrades.length}</h3>
            <CheckCircle2 className="text-indigo-500 opacity-20" size={32} />
          </div>
        </div>
        <div className="bg-white/40 p-6 rounded-[2rem] border border-white/60 shadow-sm border-r-4 border-r-emerald-500">
          <p className="text-sm font-bold text-emerald-600 mb-1">نسبة النجاح العام</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-emerald-700">
              {Math.round((studentsWithGrades.filter(s => s.overallPercentage >= 60).length / (studentsWithGrades.length || 1)) * 100)}%
            </h3>
          </div>
        </div>
        <div className="bg-white/40 p-6 rounded-[2rem] border border-white/60 shadow-sm border-r-4 border-r-indigo-500">
          <p className="text-sm font-bold text-indigo-600 mb-1">متوسط الدرجات</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-indigo-700">
              {(studentsWithGrades.reduce((acc, s) => acc + s.overallPercentage, 0) / (studentsWithGrades.length || 1)).toFixed(1)}%
            </h3>
          </div>
        </div>
        <div className="bg-white/40 p-6 rounded-[2rem] border border-white/60 shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-1">المواد المفعلة</p>
          <div className="flex items-center gap-2 mt-2">
            {SUBJECTS.map(sub => (
              <span key={sub} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black">{sub}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
