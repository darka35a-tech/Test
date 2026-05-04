import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { X, Upload, Check, AlertCircle } from "lucide-react";
import { type Student, type Assignment } from "../types";
import { cn } from "../lib/utils";

interface CSVImportModalProps {
  onClose: () => void;
  onImport: (students: Student[]) => void;
  assignments: Assignment[];
  currentSubject: string;
}

export default function CSVImportModal({ onClose, onImport, assignments, currentSubject }: CSVImportModalProps) {
  const [step, setStep] = useState<"upload" | "map">("upload");
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<{ name: string; grades: Record<string, string> }>({
    name: "",
    grades: {},
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          setCsvData(results.data as any[]);
          setHeaders(Object.keys(results.data[0]));
          setStep("map");
        }
      },
    });
  };

  const executeImport = () => {
    if (!mapping.name) {
      alert("يرجى تحديد عمود الاسم أولاً");
      return;
    }

    const importedStudents: Student[] = csvData.map((row: any) => {
      const subjectGrades: Record<string, number> = {};
      Object.entries(mapping.grades).forEach(([assignmentId, csvHeader]) => {
        if (csvHeader) {
          subjectGrades[assignmentId] = parseFloat(String(row[csvHeader as string])) || 0;
        }
      });

      return {
        id: Math.random().toString(36).substr(2, 9),
        name: String(row[mapping.name as string] || ""),
        grades: {
          [currentSubject]: subjectGrades
        },
        attendance: [],
      };
    });

    onImport(importedStudents);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-indigo-950/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-xl w-full max-w-2xl rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/40 flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-950">استيراد بيانات الطلاب من CSV</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/40 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          {step === "upload" ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/60 rounded-3xl p-12 text-center hover:bg-white/20 transition-all cursor-pointer group"
            >
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
              />
              <div className="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-indigo-950 mb-2">اختر ملف CSV للمتابعة</h3>
              <p className="text-sm text-indigo-800/60 font-medium">أو قم بسحب الملف وإفلاته هنا</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3">
                <AlertCircle className="text-indigo-600 shrink-0" size={20} />
                <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                  تم التعرف على <span className="font-bold">{csvData.length}</span> طالب. 
                  يرجى ربط أعمدة الملف بالحقول المطلوبة أدناه لضمان دقة الاستيراد.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-indigo-950 mr-1">عمود اسم الطالب:</label>
                  <select 
                    value={mapping.name}
                    onChange={(e) => setMapping({ ...mapping, name: e.target.value })}
                    className="w-full p-3 bg-white/40 border border-white/60 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">-- اختر العمود --</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <h4 className="font-bold text-indigo-950 mb-3">ربط الدرجات (اختياري):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignments.map(a => (
                      <div key={a.id} className="flex flex-col gap-1 text-right">
                        <label className="text-xs font-bold text-indigo-800/60 mr-1">{a.title}:</label>
                        <select 
                          value={mapping.grades[a.id] || ""}
                          onChange={(e) => setMapping({
                            ...mapping,
                            grades: { ...mapping.grades, [a.id]: e.target.value }
                          })}
                          className="w-full p-2 text-sm bg-white/40 border border-white/60 rounded-lg outline-none"
                        >
                          <option value="">-- تخطي --</option>
                          {headers.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/40 flex justify-end gap-3 bg-white/20">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-indigo-900 font-bold hover:bg-white/40 transition-colors"
          >
            إلغاء
          </button>
          {step === "map" && (
            <button 
              onClick={executeImport}
              className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Check size={20} />
              <span>بدء الاستيراد</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
