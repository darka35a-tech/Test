import React, { useState } from "react";
import { type TeacherData } from "../types";
import { FIXED_ASSIGNMENTS, getLetterGrade } from "../constants";
import { 
  FileText, 
  Search,
  Filter,
  CheckCircle2,
  FileDown,
  Printer,
  ChevronLeft
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

  const handlePrint = () => {
    window.print();
  };

  const exportStandAloneHTML = () => {
    const reportStyles = `
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
      :root { --primary: #4f46e5; --bg: #f8fafc; }
      * { box-sizing: border-box; }
      body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 40px; background: var(--bg); color: #1e1b4b; line-height: 1.6; }
      .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
      .header h1 { margin: 0; color: var(--primary); font-size: 24px; }
      .header p { margin: 5px 0 0 0; color: #64748b; font-weight: bold; }
      table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 20px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
      th { background: #f1f5f9; color: #475569; padding: 15px; font-weight: 900; text-align: center; border-bottom: 2px solid #e2e8f0; }
      td { padding: 15px; border-bottom: 1px solid #f1f5f9; text-align: center; font-weight: bold; }
      tr:nth-child(even) { background: #f8fafc; }
      .student-name { text-align: right; color: #1e1b4b; min-width: 200px; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 8px; font-size: 14px; font-weight: 900; }
      .badge-a { background: #dcfce7; color: #166534; }
      .badge-b { background: #e0e7ff; color: #3730a3; }
      .badge-c { background: #fef3c7; color: #92400e; }
      .badge-f { background: #fee2e2; color: #991b1b; }
      .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; }
      .stat-card { background: #f1f5f9; padding: 20px; border-radius: 16px; text-align: center; }
      .stat-card .label { font-size: 14px; color: #64748b; margin-bottom: 5px; }
      .stat-card .value { font-size: 24px; font-weight: 900; color: var(--primary); }
      .no-print-btn { background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-family: inherit; font-weight: bold; transition: opacity 0.2s; }
      .no-print-btn:hover { opacity: 0.9; }
      @media print { .no-print { display: none !important; } body { padding: 0; background: white; } .container { box-shadow: none; padding: 0; max-width: 100%; } }
    `;

    const tableRows = studentsWithGrades.map(s => `
      <tr>
        <td class="student-name">${s.name}</td>
        <td>${s.className}</td>
        ${SUBJECTS.map(sub => `<td>${s.subjectTotals[sub]}</td>`).join('')}
        <td style="color: var(--primary); font-size: 18px;">${s.grandTotal}</td>
        <td><span class="badge badge-${s.letterGrade.toLowerCase()}">${s.letterGrade}</span></td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تقرير درجات الطلاب - ${new Date().toLocaleDateString('ar-SA')}</title>
        <style>${reportStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>تقرير درجات الطلاب الشامل</h1>
              <p>تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            <div class="no-print">
              <button class="no-print-btn" onclick="window.print()">طباعة كـ PDF</button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="text-align: right;">اسم الطالب</th>
                <th>الفصل</th>
                ${SUBJECTS.map(sub => `<th>${sub}</th>`).join('')}
                <th>المجموع</th>
                <th>التقدير</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="label">إجمالي الطلاب</div>
              <div class="value">${studentsWithGrades.length}</div>
            </div>
            <div class="stat-card">
              <div class="label">نسبة النجاح</div>
              <div class="value">${Math.round((studentsWithGrades.filter(s => s.overallPercentage >= 60).length / (studentsWithGrades.length || 1)) * 100)}%</div>
            </div>
            <div class="stat-card">
              <div class="label">متوسط الدرجات</div>
              <div class="value">${(studentsWithGrades.reduce((acc, s) => acc + s.overallPercentage, 0) / (studentsWithGrades.length || 1)).toFixed(1)}%</div>
            </div>
          </div>
          
          <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px;" class="no-print">
            تم استخراج هذا الملف من نظام "أسرار" المدرسي. لضمان سلامة الأرقام، استخدم خيار الطباعة المدمج في المتصفح.
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) {
      // Fallback if popup blocked
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير_الطلاب_${new Date().toLocaleDateString('ar-SA')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-indigo-950 flex items-center gap-3">
            <FileText className="text-indigo-600" />
            التقرير الشامل لدرجات الطلاب
          </h2>
          <p className="text-indigo-800/60 font-medium">عرض جميع درجات الطلاب في كافة المواد الدراسية</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="bg-white text-indigo-600 border-2 border-indigo-100 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-indigo-50 transition-all font-bold shadow-sm"
          >
            <Printer size={20} />
            <span>طباعة سريعة</span>
          </button>
          <button 
            onClick={exportStandAloneHTML}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-200"
          >
            <FileDown size={20} />
            <span>تصدير تقرير احترافي (HTML)</span>
          </button>
        </div>
      </div>

      <div className="space-y-6 bg-white p-4 rounded-[2rem] print:p-0 print:m-0 print:shadow-none print:bg-white overflow-hidden">
        {/* Only visible in print */}
        <div className="hidden print:block text-right mb-6 border-b-2 border-indigo-600 pb-4">
          <h1 className="text-3xl font-black text-indigo-900">تقرير درجات الطلاب الشامل</h1>
          <p className="text-slate-500 font-bold mt-2 font-sans" dir="rtl">تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}</p>
        </div>

        {/* Filters - hidden in print */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="البحث عن طالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-4 bg-white/60 border border-indigo-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full pr-12 pl-4 py-4 bg-white/60 border border-indigo-100 rounded-2xl appearance-none cursor-pointer outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-indigo-950"
            >
              <option value="all">جميع الفصول</option>
              {(teacherData.classes || []).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Report Table */}
        <div className="bg-white border border-indigo-50 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-indigo-600 font-bold text-white">
                  <th className="p-5 w-64 text-right">اسم الطالب</th>
                  <th className="p-5 text-center">الفصل</th>
                  {SUBJECTS.map(sub => (
                    <th key={sub} className="p-5 text-center">{sub}</th>
                  ))}
                  <th className="p-5 text-center bg-indigo-700">المجموع</th>
                  <th className="p-5 text-center bg-indigo-800">التقدير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentsWithGrades.length > 0 ? (
                  studentsWithGrades.map(s => (
                    <tr key={s.id} className="group transition-colors print:hover:bg-transparent">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold print:hidden">
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-bold text-indigo-950">{s.name}</span>
                        </div>
                      </td>
                      <td className="p-5 text-center text-sm font-medium text-slate-500">
                        {s.className}
                      </td>
                      {SUBJECTS.map(sub => {
                        const total = s.subjectTotals[sub];
                        return (
                          <td key={sub} className="p-5 text-center">
                            <span className="font-black text-lg text-slate-700">
                              {total}
                            </span>
                          </td>
                        );
                      })}
                      <td className="p-5 text-center bg-indigo-50/30">
                        <span className="text-xl font-black text-indigo-700">
                          {s.grandTotal}
                        </span>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-500 mb-1">إجمالي الطلاب</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-indigo-950">{studentsWithGrades.length}</h3>
              <CheckCircle2 className="text-indigo-500 opacity-20" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm border-r-4 border-r-emerald-500">
            <p className="text-sm font-bold text-emerald-600 mb-1">نسبة النجاح العام</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-emerald-700">
                {Math.round((studentsWithGrades.filter(s => s.overallPercentage >= 60).length / (studentsWithGrades.length || 1)) * 100)}%
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm border-r-4 border-r-indigo-500">
            <p className="text-sm font-bold text-indigo-600 mb-1">متوسط الدرجات</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-indigo-700">
                {(studentsWithGrades.reduce((acc, s) => acc + s.overallPercentage, 0) / (studentsWithGrades.length || 1)).toFixed(1)}%
              </h3>
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-500 mb-1">المواد المفعلة</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {SUBJECTS.map(sub => (
                <span key={sub} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black">{sub}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
