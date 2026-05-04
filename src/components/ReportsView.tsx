import React from "react";
import { type TeacherData, type Student } from "../types";
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  PieChart as PieChartIcon,
  Download,
  Filter
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { cn } from "../lib/utils";

interface ReportsViewProps {
  teacherData: TeacherData;
}

export default function ReportsView({ teacherData }: ReportsViewProps) {
  const allStudents = (teacherData.classes || []).flatMap(c => 
    (c.students || []).map(s => {
      // Calculate final weighted grade for analysis
      const weightedPoints = (c.assignments || []).reduce((acc, a) => {
        const score = (s.grades || {})[a.id] || 0;
        return acc + (score / (a.maxScore || 1)) * a.weight;
      }, 0);
      const totalWeight = (c.assignments || []).reduce((acc, a) => acc + a.weight, 0);
      const grade = totalWeight > 0 ? (weightedPoints / totalWeight * 100) : 0;
      
      return { ...s, finalGrade: grade, className: c.name };
    })
  );

  const stats = {
    excellent: allStudents.filter(s => s.finalGrade >= 90).length,
    good: allStudents.filter(s => s.finalGrade >= 75 && s.finalGrade < 90).length,
    average: allStudents.filter(s => s.finalGrade >= 50 && s.finalGrade < 75).length,
    struggling: allStudents.filter(s => s.finalGrade < 50).length,
  };

  const chartData = [
    { name: 'ممتاز (90-100)', value: stats.excellent, color: '#10b981' },
    { name: 'جيد جداً (75-89)', value: stats.good, color: '#3b82f6' },
    { name: 'مقبول (50-74)', value: stats.average, color: '#f59e0b' },
    { name: 'بحاجة لدعم (<50)', value: stats.struggling, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const topStudents = [...allStudents].sort((a, b) => b.finalGrade - a.finalGrade).slice(0, 5);
  const studentsInNeed = allStudents.filter(s => s.finalGrade < 60).sort((a, b) => a.finalGrade - b.finalGrade);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-bold text-indigo-950 font-sans">التقارير الذكية والتحليل</h2>
          <p className="text-indigo-800/60 font-medium">تحليل تلقائي لمستويات الطلاب بناءً على البيانات المرصودة</p>
        </div>
        <button className="bg-white/80 border border-white/60 text-indigo-900 px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-white transition-all font-bold shadow-sm backdrop-blur-md">
          <Download size={20} />
          <span>تصدير تقرير شامل (PDF)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Chart */}
        <div className="lg:col-span-1 glass-xl p-8 rounded-[2rem] flex flex-col items-center">
          <h3 className="font-bold text-indigo-950 mb-6 flex items-center gap-2 self-start ring-indigo-500/10 ring-8 rounded-full pr-4">
             <PieChartIcon size={20} className="text-indigo-600" />
             توزيع المستويات العام
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
             {chartData.map((d, i) => (
                <div key={i} className="flex flex-col gap-1 items-center p-3 rounded-2xl bg-white/30 border border-white/40">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">{d.name.split(' ')[0]}</span>
                   <span className="text-lg font-black" style={{ color: d.color }}>{d.value}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="lg:col-span-1 glass-xl p-8 rounded-[2rem]">
          <h3 className="font-bold text-indigo-950 mb-6 flex items-center gap-2 ring-emerald-500/10 ring-8 rounded-full pr-4">
             <Award size={20} className="text-emerald-500" />
             لوحة الشرف (الأوائل)
          </h3>
          <div className="space-y-4">
            {topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center gap-4 p-4 bg-white/40 border border-white/60 rounded-2xl group hover:bg-white/60 transition-colors">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-black",
                  i === 0 ? "bg-yellow-400 text-white shadow-lg shadow-yellow-200" :
                  i === 1 ? "bg-slate-300 text-white" :
                  i === 2 ? "bg-orange-300 text-white" : "bg-white/60 text-slate-400"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-indigo-950">{s.name}</p>
                  <p className="text-[10px] text-indigo-800/40 font-bold uppercase">{s.className}</p>
                </div>
                <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  {s.finalGrade.toFixed(1)}%
                </div>
              </div>
            ))}
            {topStudents.length === 0 && <p className="text-center text-slate-400 py-10 italic">لا توجد بيانات كافية</p>}
          </div>
        </div>

        {/* Students Needing Support */}
        <div className="lg:col-span-1 glass-xl p-8 rounded-[2rem]">
          <h3 className="font-bold text-indigo-950 mb-6 flex items-center gap-2 ring-rose-500/10 ring-8 rounded-full pr-4">
             <AlertTriangle size={20} className="text-rose-500" />
             طلاب بحاجة لاهتمام مكثف
          </h3>
          <div className="space-y-3">
            {studentsInNeed.map((s) => (
               <div key={s.id} className="flex items-center gap-4 p-4 bg-white/40 border border-white/60 rounded-2xl">
                 <div className="flex-1">
                    <p className="text-sm font-bold text-indigo-950">{s.name}</p>
                    <div className="flex gap-2 mt-1">
                       <span className="text-[10px] text-rose-600 font-black uppercase bg-rose-50 px-1.5 rounded-md border border-rose-100">تحذير أكاديمي</span>
                    </div>
                 </div>
                 <div className="text-center">
                    <p className="text-xs font-black text-rose-600">{s.finalGrade.toFixed(1)}%</p>
                    <button className="text-[10px] font-bold text-indigo-600 underline mt-1">خطة دعم</button>
                 </div>
               </div>
            ))}
            {studentsInNeed.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                 <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                    <TrendingUp size={32} />
                 </div>
                 <p className="text-sm font-bold text-emerald-700">ممتاز! جميع الطلاب حققوا الحد الأدنى من النجاح</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
