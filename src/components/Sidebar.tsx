import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight, 
  GraduationCap,
  BookOpen,
  PieChart,
  UserPlus
} from "lucide-react";
import { cn } from "../lib/utils";
import { type UserRole } from "../types";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  userRole?: UserRole;
}

export default function Sidebar({ activeView, onViewChange, onLogout, userRole }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "classes", label: "الفصول الدراسية", icon: BookOpen },
    { id: "students", label: "قائمة الطلاب", icon: Users },
    { id: "reports", label: "التقارير", icon: PieChart },
  ];

  if (userRole === 'admin') {
    menuItems.push({ id: "manageTeachers", label: "إدارة المعلمات", icon: UserPlus });
    menuItems.push({ id: "manageStudents", label: "إدارة الطلاب", icon: GraduationCap });
  }

  return (
    <div className="w-64 backdrop-blur-md bg-white/40 border-l border-white/50 flex flex-col h-full shadow-sm z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200/50">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-indigo-950 leading-none">نبراس</h1>
          <p className="text-xs text-indigo-800/60 mt-1">النسخة التعليمية</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-right",
              activeView === item.id 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200/40" 
                : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              activeView === item.id ? "text-white" : "text-slate-400 group-hover:text-slate-600"
            )} />
            <span className="font-medium flex-1">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/20">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50/50 transition-colors rounded-xl font-medium"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
