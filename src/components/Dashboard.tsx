import React from "react";
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp,
  Clock
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { type TeacherData } from "../types";

const data = [
  { name: 'الأحد', grade: 85 },
  { name: 'الإثنين', grade: 88 },
  { name: 'الثلاثاء', grade: 82 },
  { name: 'الأربعاء', grade: 90 },
  { name: 'الخميس', grade: 93 },
];

export default function Dashboard({ teacherData, userName }: { teacherData: TeacherData, userName: string }) {
  const totalStudents = (teacherData.classes || []).reduce((acc, c) => acc + (c.students?.length || 0), 0);
  const totalClasses = (teacherData.classes || []).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-indigo-950">أهلاً بكِ مجدداً، {userName} 👋</h2>
          <p className="text-indigo-800/60">نظرة عامة على أدائكِ الأكاديمي اليوم</p>
        </div>
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-indigo-900 font-medium">
          <Clock size={16} />
          <span className="text-sm">{new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الطلاب", value: totalStudents, icon: Users, color: "bg-blue-600/10 text-blue-600" },
          { label: "الفصول النشطة", value: totalClasses, icon: BookOpen, color: "bg-indigo-600/10 text-indigo-600" },
          { label: "متوسط الدرجات", value: "88%", icon: Award, color: "bg-teal-600/10 text-teal-600" },
          { label: "نسبة التحسن", value: "+4.2%", icon: TrendingUp, color: "bg-orange-600/10 text-orange-600" },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-indigo-900/50 font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-indigo-950">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-xl p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-indigo-950 text-lg">معدل درجات الطلاب (الأسبوع الحالي)</h3>
            <select className="text-sm border-none bg-white/50 backdrop-blur-sm rounded-lg px-2 py-1 outline-none text-indigo-900">
              <option>كل الفصول</option>
              <option>فصل 1/أ</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4338ca', fontSize: 12, fontWeight: 500}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#4338ca', fontSize: 12, fontWeight: 500}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255, 255, 255, 0.4)'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="grade" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Recent Activity */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="font-bold text-indigo-950 mb-4">الأنشطة الأخيرة</h3>
          <div className="space-y-4">
            {[
              { text: "تم رصد درجات اختبار 1", time: "قبل ساعة", type: "grade" },
              { text: "إضافة 3 طلاب جدد للفصل 2/ب", time: "قبل 3 ساعات", type: "student" },
              { text: "تحديث حضور الأسبوع الماضي", time: "أمس", type: "attendance" },
              { text: "إنشاء تقرير شهري للفصل 1/أ", time: "قبل يومين", type: "report" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-3 items-start border-r-2 border-white/40 pr-4 relative">
                <div className="absolute top-0 right-[-5px] w-2 h-2 rounded-full bg-indigo-600 shadow-sm" />
                <div>
                  <p className="text-sm text-indigo-950 leading-tight font-medium">{activity.text}</p>
                  <p className="text-xs text-indigo-800/40 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
