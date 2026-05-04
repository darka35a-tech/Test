import React, { useState } from "react";
import { type Class, type Student, type Assignment } from "../types";
import { 
  Plus, 
  ArrowRight, 
  Table as TableIcon, 
  UserPlus, 
  FileText, 
  Search,
  MoreVertical,
  Save,
  Upload,
  Trash2,
  Edit2,
  X,
  UserCheck
} from "lucide-react";
import { cn } from "../lib/utils";
import CSVImportModal from "./CSVImportModal";
import StudentFormModal from "./StudentFormModal";

interface ClassDetailViewProps {
  selectedClass: Class;
  onBack: () => void;
  onUpdateClass: (updatedClass: Class) => void;
  userRole: 'teacher' | 'admin';
}

export default function ClassDetailView({ selectedClass, onBack, onUpdateClass, userRole }: ClassDetailViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGrade, setEditingGrade] = useState<{sid: string, aid: string} | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const students = (selectedClass.students || []).filter(s => s.name.includes(searchTerm));

  const handleGradeChange = (studentId: string, assignmentId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const updatedStudents = (selectedClass.students || []).map(s => {
      if (s.id === studentId) {
        return { ...s, grades: { ...(s.grades || {}), [assignmentId]: numValue } };
      }
      return s;
    });
    onUpdateClass({ ...selectedClass, students: updatedStudents });
  };

  const handleSaveStudent = (name: string) => {
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      grades: {},
      attendance: []
    };
    onUpdateClass({ ...selectedClass, students: [...(selectedClass.students || []), newStudent] });
    setShowAddModal(false);
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudentId && editName.trim()) {
      const updatedStudents = (selectedClass.students || []).map(s => 
        s.id === editingStudentId ? { ...s, name: editName.trim() } : s
      );
      onUpdateClass({ ...selectedClass, students: updatedStudents });
      setEditingStudentId(null);
      setEditName("");
    }
  };

  const handleRemoveStudent = (id: string) => {
    const updatedStudents = (selectedClass.students || []).filter(s => s.id !== id);
    onUpdateClass({ ...selectedClass, students: updatedStudents });
    setConfirmDeleteId(null);
  };

  const handleImportStudents = (newStudents: Student[]) => {
    onUpdateClass({ ...selectedClass, students: [...(selectedClass.students || []), ...newStudents] });
  };

  const [showAddAssignmentForm, setShowAddAssignmentForm] = useState(false);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssignmentTitle.trim()) {
      const newAssignment: Assignment = {
        id: Math.random().toString(36).substr(2, 9),
        title: newAssignmentTitle.trim(),
        maxScore: 100,
        weight: 10
      };
      onUpdateClass({ ...selectedClass, assignments: [...(selectedClass.assignments || []), newAssignment] });
      setNewAssignmentTitle("");
      setShowAddAssignmentForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white/40 rounded-full transition-colors text-indigo-900 overflow-hidden">
          <ArrowRight size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-indigo-950">{selectedClass.name}</h2>
          <div className="flex gap-4 mt-1">
             <span className="text-sm text-indigo-800/60 font-medium">{(selectedClass.students || []).length} طالب</span>
             <span className="text-sm text-indigo-800/20">•</span>
             <span className="text-sm text-indigo-800/60 font-medium">{(selectedClass.assignments || []).length} عملية تقييم</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
          <input 
            type="text" 
            placeholder="بحث عن طالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-white/30 border border-white/60 rounded-xl outline-none focus:bg-white/50 focus:border-indigo-500 transition-all backdrop-blur-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {userRole === 'admin' && (
            <>
              <button 
                onClick={() => setShowImportModal(true)}
                className="bg-white/80 border border-white/60 text-indigo-900 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white transition-colors font-bold shadow-sm backdrop-blur-md"
              >
                <Upload size={18} />
                <span>استيراد CSV</span>
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-white/80 border border-white/60 text-indigo-900 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white transition-colors font-bold shadow-sm backdrop-blur-md"
              >
                <UserPlus size={18} />
                <span>إضافة طالب</span>
              </button>
            </>
          )}
          
          <div className="flex items-center gap-2">
            {showAddAssignmentForm ? (
              <form onSubmit={handleAddAssignment} className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                <input 
                  autoFocus
                  type="text"
                  placeholder="عنوان الدرجة..."
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  className="px-4 py-2 bg-white border border-indigo-200 rounded-xl outline-none focus:border-indigo-500 shadow-sm transition-all"
                />
                <button type="submit" className="bg-emerald-500 text-white p-2 rounded-xl hover:bg-emerald-600">
                  <UserCheck size={18} />
                </button>
                <button type="button" onClick={() => setShowAddAssignmentForm(false)} className="bg-slate-100 text-slate-500 p-2 rounded-xl">
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setShowAddAssignmentForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-200"
              >
                <Plus size={18} />
                <span>إضافة تقييم</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showImportModal && (
        <CSVImportModal 
          onClose={() => setShowImportModal(false)}
          onImport={handleImportStudents}
          assignments={selectedClass.assignments || []}
        />
      )}

      {showAddModal && (
        <StudentFormModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveStudent}
        />
      )}

      {/* Grades Table */}
      <div className="glass-xl rounded-3xl overflow-hidden overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/40 backdrop-blur-md border-b border-white/40">
              <th className="p-5 font-bold text-indigo-950 w-64">الطالب</th>
              {(selectedClass.assignments || []).map(a => (
                <th key={a.id} className="p-5 font-bold text-indigo-950 text-center">
                  <div className="flex flex-col items-center">
                    <span>{a.title}</span>
                    <span className="text-[10px] font-bold text-indigo-600/60 leading-none mt-1 uppercase tracking-tighter">الدرجة: {a.maxScore}</span>
                  </div>
                </th>
              ))}
              <th className="p-5 font-bold text-indigo-950 text-center">المجموع (%)</th>
              <th className="p-5 font-bold text-indigo-950 text-center text-indigo-600 bg-indigo-50/30">المعدل النهائي (%)</th>
              <th className="p-5 font-bold text-indigo-950 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {students.map(s => {
              const totalScore = (selectedClass.assignments || []).reduce((acc, a) => acc + ((s.grades || {})[a.id] || 0), 0);
              const maxPossible = (selectedClass.assignments || []).reduce((acc, a) => acc + (a.maxScore || 0), 0);
              const percentage = maxPossible > 0 ? (totalScore / maxPossible * 100).toFixed(1) : "0";

              // Weighted Final Grade Calculation
              const weightedPoints = (selectedClass.assignments || []).reduce((acc, a) => {
                const score = (s.grades || {})[a.id] || 0;
                return acc + (score / (a.maxScore || 1)) * a.weight;
              }, 0);
              const totalWeight = (selectedClass.assignments || []).reduce((acc, a) => acc + a.weight, 0);
              const finalWeightedPercentage = totalWeight > 0 ? (weightedPoints / totalWeight * 100).toFixed(1) : "0";

              return (
                <tr key={s.id} className="hover:bg-white/30 transition-colors group">
                  <td className="p-5 font-bold text-indigo-950">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600/10 flex items-center justify-center text-xs font-bold text-indigo-600 uppercase border border-indigo-600/20 shadow-inner">
                        {s.name.charAt(0)}
                      </div>
                      {editingStudentId === s.id ? (
                        <form onSubmit={handleUpdateStudent} className="flex gap-2">
                          <input 
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-3 py-1 bg-white border border-indigo-300 rounded-lg outline-none font-bold text-sm"
                          />
                          <button type="submit" className="text-emerald-600 hover:bg-emerald-50 p-1 rounded-lg"><UserCheck size={16} /></button>
                          <button type="button" onClick={() => setEditingStudentId(null)} className="text-slate-400 hover:bg-slate-50 p-1 rounded-lg"><X size={16} /></button>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between flex-1 group/edit">
                          <span>{s.name}</span>
                          {userRole === 'admin' && (
                            <button 
                              onClick={() => { setEditingStudentId(s.id); setEditName(s.name); }}
                              className="opacity-0 group-hover/edit:opacity-100 p-1 text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  {(selectedClass.assignments || []).map(a => (
                    <td key={a.id} className="p-5 text-center">
                      <input 
                        type="number" 
                        value={(s.grades || {})[a.id] ?? ""}
                        onChange={(e) => handleGradeChange(s.id, a.id, e.target.value)}
                        className="w-16 h-10 bg-white/20 border border-white/60 rounded-xl text-center font-bold text-indigo-900 focus:bg-white/60 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder-indigo-300"
                        placeholder="-"
                      />
                    </td>
                  ))}
                  <td className="p-5 text-center">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-black shadow-sm",
                      Number(percentage) >= 90 ? "bg-green-100/80 text-green-700 border border-green-200" :
                      Number(percentage) >= 75 ? "bg-blue-100/80 text-blue-700 border border-blue-200" :
                      "bg-orange-100/80 text-orange-700 border border-orange-200"
                    )}>
                      {percentage}%
                    </span>
                  </td>
                  <td className="p-5 text-center bg-indigo-50/10">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-black shadow-sm ring-2 ring-indigo-500/10",
                      Number(finalWeightedPercentage) >= 90 ? "bg-green-500 text-white" :
                      Number(finalWeightedPercentage) >= 75 ? "bg-indigo-500 text-white" :
                      "bg-orange-500 text-white"
                    )}>
                      {finalWeightedPercentage}%
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    {userRole === 'admin' ? (
                      confirmDeleteId === s.id ? (
                        <div className="flex items-center gap-1 justify-center animate-in zoom-in-95 duration-200">
                          <button 
                            onClick={() => handleRemoveStudent(s.id)}
                            className="px-3 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-black shadow-sm hover:bg-rose-600 transition-all"
                          >
                            تأكيد
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black hover:bg-slate-200"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmDeleteId(s.id)}
                          className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="حذف الطالب"
                        >
                          <Trash2 size={18} />
                        </button>
                      )
                    ) : (
                      <button className="p-2 text-indigo-300 hover:text-indigo-600 hover:bg-white/40 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {students.length === 0 && (
          <div className="p-12 text-center text-indigo-800/40 font-bold italic">
            لا يوجد طلاب في هذا الفصل حالياً.
          </div>
        )}
      </div>
    </div>
  );
}
