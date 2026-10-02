import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ProjectBoard } from './components/ProjectBoard';
import { FindStudents } from './components/FindStudents';
import { MyProfile } from './components/MyProfile';
import { ProjectRequests } from './components/ProjectRequests';
import { MyPartners } from './components/MyPartners';
import { StudentProfileModal } from './components/StudentProfileModal';
import { SendRequestModal } from './components/SendRequestModal';
import { AuthScreen } from './components/AuthScreen';
import { Toast } from './components/Toast';
import { RotateCcw } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentStudent, activeTab, resetAllData } = useApp();

  if (!currentStudent) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'project-board' && <ProjectBoard />}
        {activeTab === 'requests' && <ProjectBoard initialTab="received-requests" />}
        {activeTab === 'find-students' && <FindStudents />}
        {activeTab === 'my-profile' && <MyProfile />}
        {activeTab === 'partners' && <MyPartners />}
      </main>

      {/* Global Modals & Toast */}
      <StudentProfileModal />
      <SendRequestModal />
      <Toast />

      {/* Subtle Campus Product Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SkillMate</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-600">Student Skills &amp; Project Partners</span>
            <span aria-hidden="true">·</span>
            <span>Kamaladevi College</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">B.Sc. Computer Science Mini Project</span>
            <button
              onClick={resetAllData}
              className="text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
              title="Reset all demo data to default state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
