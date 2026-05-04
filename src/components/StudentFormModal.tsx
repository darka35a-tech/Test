import React, { useState } from "react";
import { X, UserPlus, GraduationCap, Check } from "lucide-react";

interface StudentFormModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function StudentFormModal({ onClose, onSave }: StudentFormModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-indigo-950/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-xl w-full max-w-md p-8 rounded-[2.5rem] relative animate-in zoom-in duration-300">
        <button 
          onClick={onClose} 
          className="absolute left-6 top-6 p-2 hover:bg-white/40 rounded-full transition-colors text-indigo-900"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-indigo-200">
            <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-bold text-indigo-950">إضافة طالب جديد</h2>
          <p className="text-indigo-800/50 text-sm font-medium">أدخل اسم الطالب لإضافته إلى السجل</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-indigo-950 mr-1">الاسم الثلاثي أو الرباعي:</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم الطالب..."
              className="w-full px-5 py-4 bg-white/40 border border-white/60 rounded-2xl outline-none focus:bg-white/60 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-indigo-900"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check size={20} />
            <span>حفظ الطالب</span>
          </button>
        </form>
      </div>
    </div>
  );
}
