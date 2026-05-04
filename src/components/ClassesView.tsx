import React, { useState } from "react";
import { type Class } from "../types";
import { Plus, Users, ArrowLeft, X, Check } from "lucide-react";

interface ClassesViewProps {
  classes: Class[];
  onSelectClass: (c: Class) => void;
  onAddClass: (name: string) => void;
  userRole: 'teacher' | 'admin';
}

export default function ClassesView({ classes, onSelectClass, onAddClass, userRole }: ClassesViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim()) {
      onAddClass(newClassName.trim());
      setNewClassName("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-bold text-indigo-950">الفصول الدراسية</h2>
          <p className="text-indigo-800/60">إدارة الفصول والمجموعات الأكاديمية</p>
        </div>
        {userRole === 'admin' && (
          <div className="flex items-center gap-2">
            {showAddForm ? (
              <form onSubmit={handleSubmit} className="flex items-center gap-2 animate-in slide-in-from-left-4 duration-300">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="اسم الفصل..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="bg-white border border-indigo-200 px-4 py-2.5 rounded-xl outline-none focus:border-indigo-500 shadow-sm transition-all"
                />
                <button 
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-100"
                >
                  <Check size={20} />
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-2.5 rounded-xl transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 font-medium shadow-lg shadow-indigo-200"
              >
                <Plus size={20} />
                <span>إضافة فصل جديد</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(classes || []).map((c) => (
          <div 
            key={c.id} 
            className="glass rounded-3xl overflow-hidden hover:bg-white/50 transition-all duration-300 group"
          >
            <div className="h-2 bg-indigo-600/60" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-indigo-950 mb-2">{c.name}</h3>
              <div className="flex items-center gap-4 text-indigo-800/60 text-sm mb-6">
                <div className="flex items-center gap-1.5 bg-white/40 px-3 py-1 rounded-full border border-white/60">
                  <Users size={16} />
                  <span>{(c.students || []).length} طالب</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/40 px-3 py-1 rounded-full border border-white/60">
                  <span>{(c.assignments || []).length} اختبار</span>
                </div>
              </div>
              
              <button 
                onClick={() => onSelectClass(c)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/60 text-indigo-600 font-bold hover:bg-white transition-colors group shadow-sm"
              >
                <span>دخول الفصل</span>
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
