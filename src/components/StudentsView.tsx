import React from "react";
import { type TeacherData } from "../types";
import { Users, GraduationCap, Download } from "lucide-react";
import Papa from "papaparse";

interface StudentsViewProps {
  teacherData: TeacherData;
  userRole: 'teacher' | 'admin';
}

export default function StudentsView({ teacherData, userRole }: StudentsViewProps) {
  const allStudents = (teacherData.classes || []).flatMap(c => 
    (c.students || []).map(s => ({ ...s, className: c.name }))
  );

  const handleExportCSV = () => {
    if (allStudents.length === 0) return;

    const exportData = allStudents.map(s => ({
      "اسم الطالب": s.name,
      "الفصل الدراسي": s.className,
      "عدد التقييمات المرصودة": Object.keys(s.grades || {}).length,
      "معرف الطالب": s.id
    }));

    const csv = Papa.unparse(exportData);
    // Add BOM for Excel Arabic support
    const blob = new Blob(["\ufeff", csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `سجل_الطلاب_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-bold text-indigo-950">قائمة جميع الطلاب</h2>
          <p className="text-indigo-800/60">استعراض كافة الطلاب المسجلين في النظام</p>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={allStudents.length === 0}
          className="bg-white/80 border border-white/60 text-indigo-900 px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-white transition-all font-bold shadow-sm backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={20} />
          <span>تصدير القائمة (CSV)</span>
        </button>
      </div>

      <div className="glass-xl rounded-3xl overflow-hidden overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-white/40 backdrop-blur-md border-b border-white/40">
              <th className="p-5 font-bold text-indigo-950">اسم الطالب</th>
              <th className="p-5 font-bold text-indigo-950">الفصل الدراسي</th>
              <th className="p-5 font-bold text-indigo-950 text-center">أحدث التقييمات</th>
              <th className="p-5 font-bold text-indigo-950 text-center">الحالة الأكاديمية</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {allStudents.map(s => (
              <tr key={s.id} className="hover:bg-white/30 transition-colors group">
                <td className="p-5 font-bold text-indigo-950">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/40 flex items-center justify-center text-xs font-bold text-indigo-600 border border-white/60">
                      <GraduationCap size={18} />
                    </div>
                    {s.name || "طالب بدون اسم"}
                  </div>
                </td>
                <td className="p-5">
                   <span className="bg-white/40 px-3 py-1 rounded-full border border-white/60 text-xs font-bold text-indigo-900">
                     {s.className}
                   </span>
                </td>
                <td className="p-5 text-center text-indigo-800/60 font-medium">
                  {Object.keys(s.grades || {}).length} عمليات رصد
                </td>
                <td className="p-5 text-center">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-green-100/80 text-green-700 border border-green-200">
                    نشط
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allStudents.length === 0 && (
          <div className="p-16 text-center">
             <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-200">
                <Users size={40} />
             </div>
             <p className="text-xl font-bold text-indigo-900/40 italic">لا يوجد طلاب مسجلين في أي فصل حتى الآن</p>
          </div>
        )}
      </div>
    </div>
  );
}
