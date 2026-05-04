import React, { useState } from "react";
import { type TeacherAccount, type Class } from "../types";
import { UserPlus, Trash2, Key, UserCheck, Shield, BookOpen } from "lucide-react";

interface ManageTeachersViewProps {
  teachers: TeacherAccount[];
  availableClasses: Class[];
  onAddTeacher: (teacher: TeacherAccount) => void;
  onUpdateTeacher: (teacher: TeacherAccount) => void;
  onRemoveTeacher: (id: string) => void;
}

export default function ManageTeachersView({ teachers, availableClasses, onAddTeacher, onUpdateTeacher, onRemoveTeacher }: ManageTeachersViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPassword("");
    setSubject("");
    setSelectedClassIds([]);
  };

  const handleEdit = (t: TeacherAccount) => {
    setEditingId(t.id);
    setName(t.name);
    setPassword(t.password);
    setSubject(t.subject);
    setSelectedClassIds(t.assignedClassIds || []);
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && password.trim() && subject.trim()) {
      const teacherData: TeacherAccount = {
        id: editingId || Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        password: password.trim(),
        subject: subject.trim(),
        assignedClassIds: selectedClassIds
      };

      if (editingId) {
        onUpdateTeacher(teacherData);
      } else {
        onAddTeacher(teacherData);
      }
      resetForm();
    }
  };

  const toggleClass = (id: string) => {
    setSelectedClassIds(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="px-2">
        <h2 className="text-2xl font-bold text-indigo-950">إدارة حسابات المعلمات</h2>
        <p className="text-indigo-800/60 font-medium">تسجيل المعلمات ومنحهم صلاحيات الوصول للنظام</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Teacher Form */}
        <div className="lg:col-span-1 glass-xl p-8 rounded-[2.5rem] border border-white/40 overflow-hidden flex flex-col">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl transition-all ${editingId ? "bg-amber-500 shadow-amber-200" : "bg-indigo-600 shadow-indigo-200"}`}>
            {editingId ? <Key size={32} /> : <UserPlus size={32} />}
          </div>
          <h3 className="text-xl font-bold text-indigo-950 mb-6">
            {editingId ? "تعديل بيانات المعلمة" : "تسجيل معلمة جديدة"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-5 flex-1 overflow-y-auto pr-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-indigo-950 mr-1">اسم المعلمة الثنائي:</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: مريم العتيبي"
                className="w-full px-5 py-4 bg-white/40 border border-white/60 rounded-2xl outline-none focus:bg-white/60 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-indigo-950 mr-1">المادة الدراسية:</label>
              <div className="relative">
                <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-white/40 border border-white/60 rounded-2xl outline-none focus:bg-white/60 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold appearance-none cursor-pointer"
                >
                  <option value="">اختر المادة...</option>
                  <option value="عربي">عربي</option>
                  <option value="انجليزي">انجليزي</option>
                  <option value="علوم">علوم</option>
                  <option value="رياضيات">رياضيات</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-indigo-950 mr-1">الرقم السري الخاص بها:</label>
              <div className="relative">
                <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة مرور الدخول"
                  className="w-full pr-12 pl-4 py-4 bg-white/40 border border-white/60 rounded-2xl outline-none focus:bg-white/60 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-indigo-950 mr-1">الصفوف المسندة لها:</label>
              <div className="grid grid-cols-1 gap-2">
                {availableClasses.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleClass(c.id)}
                    className={`p-3 rounded-xl border text-sm font-bold text-right transition-all flex items-center justify-between ${
                      selectedClassIds.includes(c.id)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white/30 border-white/60 text-indigo-900 hover:bg-white/50"
                    }`}
                  >
                    <span>{c.name}</span>
                    {selectedClassIds.includes(c.id) && <UserCheck size={16} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="submit"
                disabled={!name.trim() || !password.trim() || !subject.trim()}
                className={`flex-1 py-4 text-white rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale ${
                  editingId ? "bg-amber-500 shadow-amber-200 hover:bg-amber-600" : "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700"
                }`}
              >
                {editingId ? "تحديث البيانات" : "حفظ وتنشيط الحساب"}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Teachers List */}
        <div className="lg:col-span-2 glass-xl rounded-[2.5rem] overflow-hidden flex flex-col border border-white/40">
           <div className="p-6 bg-white/40 border-b border-white/40 flex items-center gap-3">
              <UserCheck size={20} className="text-indigo-600" />
              <h3 className="font-bold text-indigo-950">المعلمات المسجلات ({teachers.length})</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto">
             <table className="w-full text-right border-collapse">
               <thead>
                 <tr className="bg-white/20">
                   <th className="p-4 font-bold text-indigo-950">المعلمة</th>
                   <th className="p-4 font-bold text-indigo-950">المادة</th>
                   <th className="p-4 font-bold text-indigo-950">الصفوف</th>
                   <th className="p-4 font-bold text-indigo-950">الرقم السري</th>
                   <th className="p-4"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/20">
                 {teachers.map(t => (
                   <tr key={t.id} className="hover:bg-white/30 transition-colors">
                     <td className="p-4">
                        <div className="font-bold text-indigo-950">أ. {t.name}</div>
                        <div className="text-[10px] text-emerald-600 font-black">نشط</div>
                     </td>
                     <td className="p-4">
                        <span className="bg-white/50 px-2 py-1 rounded-lg border border-white/60 text-xs font-bold text-indigo-700">
                          {t.subject}
                        </span>
                     </td>
                     <td className="p-4 font-bold text-indigo-900/60 text-xs">
                        {t.assignedClassIds?.length || 0} فصول
                     </td>
                     <td className="p-4 font-mono text-indigo-600 text-sm">{t.password}</td>
                     <td className="p-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(t)}
                            className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-colors"
                            title="تعديل الحساب"
                          >
                            <Key size={18} />
                          </button>
                          <button 
                            onClick={() => onRemoveTeacher(t.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            title="حذف الحساب"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                     </td>
                   </tr>
                 ))}
                 {teachers.length === 0 && (
                   <tr>
                     <td colSpan={5} className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                          <UserPlus size={32} />
                        </div>
                        <p className="text-slate-400 font-bold italic">لم يتم تسجيل أي معلمة بعد</p>
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>

           <div className="p-6 bg-indigo-50/50 border-t border-white/40 flex items-center gap-3">
              <Shield size={18} className="text-indigo-400" />
              <p className="text-xs text-indigo-800/60 font-medium">ملاحظة: المعلمات المسجلات هنا فقط من يستطعن الدخول للنظام باستخدام أسمائهم وأرقامهم السرية المحددة.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
