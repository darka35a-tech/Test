import React, { useState } from "react";
import { GraduationCap, Lock, User, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { type AppUser, type TeacherAccount } from "../types";

interface LoginViewProps {
  onLogin: (user: AppUser) => void;
  authorizedTeachers: TeacherAccount[];
}

export default function LoginView({ onLogin, authorizedTeachers }: LoginViewProps) {
  const [selectedRole, setSelectedRole] = useState<"teacher" | "admin">("teacher");
  const [teacherName, setTeacherName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedRole === "admin") {
      if (password !== "12345") {
        setError("عذراً، الرقم السري للمديرة غير صحيح!");
        return;
      }
      onLogin({
        id: "admin",
        name: "مديرة المدرسة",
        role: "admin"
      });
    } else {
      if (!teacherName.trim()) {
        setError("يرجى إدخال اسم المعلمة");
        return;
      }
      
      const normalizedInputName = teacherName.trim().replace(/^أ\.\s*/, "");
      
      const teacher = authorizedTeachers.find(t => {
        const normalizedStoredName = t.name.trim().replace(/^أ\.\s*/, "");
        return normalizedStoredName === normalizedInputName && t.password.trim() === password.trim();
      });

      if (!teacher) {
        setError("اسم المعلمة أو الرقم السري غير صحيح. يرجى مراجعة المديرة.");
        return;
      }

      onLogin({
        id: teacher.id,
        name: `أ. ${teacher.name}`,
        role: "teacher",
        subject: teacher.subject,
        assignedClassIds: teacher.assignedClassIds
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Blurs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-[120px] -z-10" />

      <div className="glass-xl w-full max-w-md p-8 rounded-[2.5rem] relative z-10 animate-in fade-in zoom-in duration-500 border border-white/40">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-indigo-200 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2">نبراس المعلمة</h1>
          <p className="text-indigo-800/50 font-medium">سجلي دخولكِ للبدء في إدارة المنصة</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex gap-3 mb-8">
            <button
              type="button"
              onClick={() => {
                setSelectedRole("teacher");
                setError("");
              }}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 font-bold ${
                selectedRole === "teacher" 
                ? "border-indigo-600 bg-white/60 text-indigo-600 shadow-md" 
                : "border-white/40 bg-white/20 text-slate-400 hover:bg-white/40"
              }`}
            >
              <User size={24} />
              <span>معلمة</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole("admin");
                setError("");
              }}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 font-bold ${
                selectedRole === "admin" 
                ? "border-indigo-600 bg-white/60 text-indigo-600 shadow-md" 
                : "border-white/40 bg-white/20 text-slate-400 hover:bg-white/40"
              }`}
            >
              <ShieldCheck size={24} />
              <span>مديرة</span>
            </button>
          </div>

          <div className="space-y-4">
            {selectedRole === "teacher" && (
              <div className="relative animate-in slide-in-from-top-2 duration-300">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="اسم المعلمة" 
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-white/40 border border-white/60 rounded-2xl outline-none focus:bg-white/60 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="الرقم السري" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12 pl-12 py-4 bg-white/40 border border-white/60 rounded-2xl outline-none focus:bg-white/60 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-right"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                title={showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="flex justify-start px-2">
              <button 
                type="button"
                onClick={() => setError("يرجى مراجعة مديرة المدرسة لاستعادة الرقم السري الخاص بكِ.")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                نسيتي كلمة السر؟
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold animate-pulse">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            دخول للمنصة
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-indigo-800/40 font-bold">
          جميع الحقوق محفوظة منصة نبراس © 2024
        </p>
      </div>
    </div>
  );
}
