import React, { useState } from "react";
import { type Class, type Student } from "../types";
import { 
  UserPlus, 
  Search, 
  Trash2, 
  Edit2, 
  Users, 
  GraduationCap, 
  Check, 
  X 
} from "lucide-react";

interface ManageStudentsViewProps {
  classes: Class[];
  onAddStudent: (classNameId: string, student: Student) => void;
  onUpdateStudent: (oldClassId: string, newClassId: string, student: Student) => void;
  onRemoveStudent: (classId: string, studentId: string) => void;
}

export default function ManageStudentsView({ classes, onAddStudent, onUpdateStudent, onRemoveStudent }: ManageStudentsViewProps) {
  const [editingStudent, setEditingStudent] = useState<{ student: Student, classId: string } | null>(null);
  const [name, setName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const allStudents = classes.flatMap(c => 
    (c.students || []).map(s => ({ ...s, classId: c.id, className: c.name }))
  );

  const filteredStudents = allStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingStudent(null);
    setName("");
    setSelectedClassId("");
    setConfirmDeleteId(null);
  };

  const handleEdit = (student: Student, classId: string) => {
    setEditingStudent({ student, classId });
    setName(student.name);
    setSelectedClassId(classId);
    setConfirmDeleteId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedClassId) {
      if (editingStudent) {
        onUpdateStudent(
          editingStudent.classId,
          selectedClassId,
          { ...editingStudent.student, name: name.trim() }
        );
      } else {
        const student: Student = {
          id: Math.random().toString(36).substr(2, 9),
          name: name.trim(),
          grades: {},
          attendance: []
        };
        onAddStudent(selectedClassId, student);
      }
      resetForm();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="px-2">
        <h2 className="text-3xl font-black text-indigo-950">إدارة الطلاب</h2>
        <p className="text-indigo-800/60 mt-1">إضافة وتعديل بيانات الطلاب وتخصيص الفصول</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="lg:col-span-1 glass-xl p-8 rounded-[2.5rem] border border-white/40 shadow-2xl shadow-indigo-100/50">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl transition-all ${editingStudent ? "bg-amber-500 shadow-amber-200" : "bg-indigo-600 shadow-indigo-200"}`}>
            {editingStudent ? <Edit2 size={32} /> : <UserPlus size={32} />}
          </div>
          <h3 className="text-xl font-bold text-indigo-950 mb-6">
            {editingStudent ? "تعديل بيانات الطالب" : "تسجيل طالب جديد"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-indigo-900/60 mr-1">اسم الطالب رباعي</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل الاسم الكامل..."
                className="w-full px-5 py-4 bg-white/50 border border-white focus:bg-white focus:border-indigo-500 rounded-2xl outline-none transition-all placeholder-indigo-300 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-indigo-900/60 mr-1">تخصيص الفصل</label>
              <select 
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-5 py-4 bg-white/50 border border-white focus:bg-white focus:border-indigo-500 rounded-2xl outline-none transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="">اختر الفصل...</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="submit"
                disabled={!name.trim() || !selectedClassId}
                className={`flex-1 py-4 text-white rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale ${
                  editingStudent ? "bg-amber-500 shadow-amber-200 hover:bg-amber-600" : "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700"
                }`}
              >
                {editingStudent ? "تحديث البيانات" : "إضافة الطالب للنظام"}
              </button>
              
              {editingStudent && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  <X size={24} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Students List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-xl p-4 rounded-3xl border border-white/40 flex items-center gap-4">
            <Search className="text-indigo-400 mr-2" size={24} />
            <input 
              type="text" 
              placeholder="البحث عن طريق اسم الطالب أو الفصل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-indigo-950 placeholder-indigo-300 font-medium py-2"
            />
          </div>

          <div className="glass-xl rounded-[2.5rem] overflow-hidden border border-white/40 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-indigo-50/50 border-b border-indigo-100/50">
                    <th className="p-6 font-bold text-indigo-950">بيانات الطالب</th>
                    <th className="p-6 font-bold text-indigo-950">الفصل</th>
                    <th className="p-6 font-bold text-indigo-950 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50/30">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-white/40 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200/50 shadow-inner">
                            <GraduationCap size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-indigo-950 text-lg">{s.name}</p>
                            <p className="text-xs text-indigo-400 font-mono">ID: {s.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl border border-indigo-100 text-indigo-900 font-bold text-sm">
                          <Users size={16} className="text-indigo-400" />
                          {s.className}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-end gap-2">
                          {confirmDeleteId === s.id ? (
                            <div className="flex items-center gap-1 animate-in zoom-in-95 duration-200">
                              <button 
                                id={`confirm-delete-${s.id}`}
                                onClick={() => {
                                  onRemoveStudent(s.classId, s.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-3 py-1 bg-rose-500 text-white rounded-lg text-xs font-bold shadow-md hover:bg-rose-600 transition-all font-mono"
                              >
                                تأكيد
                              </button>
                              <button 
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-200"
                              >
                                تراجع
                              </button>
                            </div>
                          ) : (
                            <>
                              <button 
                                id={`edit-student-${s.id}`}
                                onClick={() => handleEdit(s, s.classId)}
                                className="w-10 h-10 flex items-center justify-center text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                                title="تعديل"
                              >
                                <Edit2 size={20} />
                              </button>
                              <button 
                                id={`delete-student-${s.id}`}
                                onClick={() => setConfirmDeleteId(s.id)}
                                className="w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                title="حذف"
                              >
                                <Trash2 size={20} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredStudents.length === 0 && (
              <div className="p-20 text-center">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-200">
                  <GraduationCap size={48} />
                </div>
                <p className="text-xl font-bold text-indigo-900/30 italic">لا توجد نتائج مطابقة لبحثك</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
