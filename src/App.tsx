/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ClassesView from "./components/ClassesView";
import ClassDetailView from "./components/ClassDetailView";
import StudentsView from "./components/StudentsView";
import ReportsView from "./components/ReportsView";
import ManageTeachersView from "./components/ManageTeachersView";
import ManageStudentsView from "./components/ManageStudentsView";
import LoginView from "./components/LoginView";
import { type Class, type TeacherData, type AppUser, type TeacherAccount, type Student } from "./types";
import { loadData, saveData } from "./lib/storage";
import { Bell, Search, User, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const [data, setData] = useState<TeacherData>(loadData());
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (data) saveData(data);
  }, [data]);

  if (!currentUser) {
    return <LoginView onLogin={setCurrentUser} authorizedTeachers={data.teachers} />;
  }

  const updateClass = (updatedClass: Class) => {
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        classes: prev.classes.map(c => c.id === updatedClass.id ? updatedClass : c)
      };
    });
    setSelectedClass(updatedClass);
  };

  const handleAddClass = (name: string) => {
    if (currentUser?.role !== 'admin') {
      return;
    }
    const newClass: Class = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      students: [],
      assignments: []
    };
    setData(prev => ({
      ...prev,
      classes: [...prev.classes, newClass]
    }));
  };

  const handleAddTeacher = (teacher: TeacherAccount) => {
    setData(prev => ({
      ...prev,
      teachers: [...prev.teachers, teacher]
    }));
  };

  const handleRemoveTeacher = (id: string) => {
    setData(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== id)
    }));
  };

  const handleUpdateTeacher = (updatedTeacher: TeacherAccount) => {
    setData(prev => ({
      ...prev,
      teachers: prev.teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t)
    }));
  };

  const handleAddStudent = (classId: string, student: Student) => {
    setData(prev => ({
      ...prev,
      classes: prev.classes.map(c => 
        c.id === classId 
          ? { ...c, students: [...(c.students || []), student] } 
          : c
      )
    }));
  };

  const handleRemoveStudent = (classId: string, studentId: string) => {
    setData(prev => {
      const updatedClasses = prev.classes.map(c => {
        if (c.id === classId) {
          return {
            ...c,
            students: (c.students || []).filter(s => s.id !== studentId)
          };
        }
        return c;
      });
      return { ...prev, classes: updatedClasses };
    });
  };

  const handleUpdateStudent = (oldClassId: string, newClassId: string, updatedStudent: Student) => {
    setData(prev => {
      const updatedClasses = prev.classes.map(c => {
        if (oldClassId === newClassId) {
          if (c.id === oldClassId) {
            return {
              ...c,
              students: (c.students || []).map(s => s.id === updatedStudent.id ? updatedStudent : s)
            };
          }
        } else {
          if (c.id === oldClassId) {
            return {
              ...c,
              students: (c.students || []).filter(s => s.id !== updatedStudent.id)
            };
          }
          if (c.id === newClassId) {
            return {
              ...c,
              students: [...(c.students || []), updatedStudent]
            };
          }
        }
        return c;
      });
      
      return { ...prev, classes: updatedClasses };
    });
  };

  const viewData: TeacherData = currentUser.role === 'admin' 
    ? data 
    : { 
        ...data, 
        classes: data.classes.filter(c => currentUser.assignedClassIds?.includes(c.id)) 
      };

  return (
    <div className="flex h-screen font-sans overflow-hidden relative">
      {/* Decorative Blurs */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-blue-300/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -z-10" />

      <Sidebar 
        activeView={activeView} 
        onViewChange={(v) => {
          setActiveView(v);
          setSelectedClass(null);
        }} 
        onLogout={() => setCurrentUser(null)}
        userRole={currentUser.role}
      />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <header className="h-16 backdrop-blur-xl bg-white/40 border-b border-white/40 flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative group max-w-md w-full hidden md:block">
               <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
               <input 
                 type="search" 
                 placeholder="بحث سريع عن طالب أو فصل..." 
                 className="w-full pr-10 pl-4 py-2 bg-white/30 border border-white/60 focus:bg-white/50 focus:border-indigo-500 rounded-xl outline-none text-sm transition-all backdrop-blur-sm"
               />
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-white/60 rounded-lg relative transition-colors">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-white/20 mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-indigo-950 text-right">{currentUser.name}</p>
                <p className="text-xs text-indigo-800/60 text-right">{currentUser.role === 'admin' ? 'مديرة المدرسة' : `معلمة ${currentUser.subject}`}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200/50 relative">
                {currentUser.role === 'admin' ? <Shield size={20} /> : <User size={20} />}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedClass ? `class-${selectedClass.id}` : activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {selectedClass ? (
                 <ClassDetailView 
                    selectedClass={selectedClass} 
                    onBack={() => setSelectedClass(null)}
                    onUpdateClass={updateClass}
                    userRole={currentUser.role}
                 />
              ) : (
                <>
                  {activeView === "dashboard" && <Dashboard teacherData={viewData} userName={currentUser.name} />}
                  {activeView === "classes" && (
                    <ClassesView 
                      classes={viewData.classes} 
                      onSelectClass={setSelectedClass}
                      onAddClass={handleAddClass}
                      userRole={currentUser.role}
                    />
                  )}
                  {activeView === "students" && (
                     <StudentsView teacherData={viewData} userRole={currentUser.role} />
                  )}
                  {activeView === "reports" && (
                     <ReportsView teacherData={viewData} />
                  )}
                  {activeView === "manageTeachers" && (
                    <ManageTeachersView 
                      teachers={data.teachers}
                      availableClasses={data.classes}
                      onAddTeacher={handleAddTeacher}
                      onUpdateTeacher={handleUpdateTeacher}
                      onRemoveTeacher={handleRemoveTeacher}
                    />
                  )}
                  {activeView === "manageStudents" && (
                    <ManageStudentsView 
                      classes={data.classes}
                      onAddStudent={handleAddStudent}
                      onUpdateStudent={handleUpdateStudent}
                      onRemoveStudent={handleRemoveStudent}
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
