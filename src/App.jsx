import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage       from './components/LandingPage';
import AuthPage          from './components/auth/AuthPage';
import ParentOnboarding  from './components/auth/ParentOnboarding';
import { Header }        from './components/Header';
import { AdminDashboard }        from './components/admin/AdminDashboard';
import { StudentsManager }       from './components/admin/StudentsManager';
import { TeachersManager }       from './components/admin/TeachersManager';
import { ClassesManager }        from './components/admin/ClassesManager';
import { FinanceManager }        from './components/admin/FinanceManager';
import { ExcelImportExportModal } from './components/admin/ExcelImportExportModal';
import { TeacherView }   from './components/teacher/TeacherView';
import { ParentView }    from './components/parent/ParentView';
import { StudentView }   from './components/student/StudentView';
import {
  LayoutDashboard, Users, GraduationCap, School, Banknote, Loader2
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   FULL-SCREEN LOADING SPINNER
───────────────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600
                      flex items-center justify-center shadow-lg shadow-emerald-500/30">
        <GraduationCap className="w-7 h-7 text-white" />
      </div>
      <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
      <p className="text-slate-500 text-sm font-medium">Chargement…</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ADMIN DASHBOARD SHELL
───────────────────────────────────────────────────────────── */
function AdminShell() {
  const [adminTab, setAdminTab]     = useState('dashboard');
  const [isExcelOpen, setIsExcelOpen] = useState(false);

  const TABS = [
    { id: 'dashboard', label: 'Tableau de Bord',          Icon: LayoutDashboard },
    { id: 'students',  label: 'Gestion Élèves',           Icon: Users           },
    { id: 'teachers',  label: 'Professeurs',              Icon: GraduationCap   },
    { id: 'classes',   label: 'Classes & Emplois du Temps', Icon: School        },
    { id: 'finance',   label: 'Finances & Paiements',     Icon: Banknote        },
  ];

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border
                      border-work-200 shadow-sm overflow-x-auto no-print">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            id={`admin-tab-${id}`}
            onClick={() => setAdminTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
                        transition-all whitespace-nowrap ${
              adminTab === id
                ? 'bg-work-900 text-white shadow-sm'
                : 'text-work-600 hover:text-work-900 hover:bg-work-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {adminTab === 'dashboard' && <AdminDashboard setActiveTab={setAdminTab} />}
      {adminTab === 'students'  && <StudentsManager onOpenExcelModal={() => setIsExcelOpen(true)} />}
      {adminTab === 'teachers'  && <TeachersManager />}
      {adminTab === 'classes'   && <ClassesManager />}
      {adminTab === 'finance'   && <FinanceManager />}

      <ExcelImportExportModal isOpen={isExcelOpen} onClose={() => setIsExcelOpen(false)} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN DASHBOARD (authenticated users)
───────────────────────────────────────────────────────────── */
function Dashboard() {
  const { currentRole } = useApp();

  return (
    <div className="min-h-screen bg-work-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRole === 'admin'   && <AdminShell />}
        {currentRole === 'teacher' && <TeacherView />}
        {currentRole === 'parent'  && <ParentView />}
        {currentRole === 'student' && <StudentView />}
      </main>
      <footer className="bg-white border-t border-work-200 py-4 text-center
                         text-xs text-work-500 no-print">
        © 2025-2026 Edumaster SaaS. Tous droits réservés.
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT ROUTER — decides which screen to show
───────────────────────────────────────────────────────────── */
function AppRouter() {
  const {
    session,
    userProfile,
    authLoading,
    currentRole,
    isParentOnboarded,
  } = useApp();

  const [screen, setScreen] = useState('landing'); // 'landing' | 'auth'

  // 1. Still resolving auth state
  if (authLoading) return <LoadingScreen />;

  // 2. Not authenticated → Landing or Auth
  if (!session) {
    if (screen === 'auth') {
      return <AuthPage onBack={() => setScreen('landing')} />;
    }
    return (
      <LandingPage
        onGetStarted={() => setScreen('auth')}
        onLogin={() => setScreen('auth')}
      />
    );
  }

  // 3. Authenticated but profile not loaded yet (trigger in progress)
  if (!userProfile) return <LoadingScreen />;

  // 4. Parent without linked child → onboarding
  if (currentRole === 'parent' && !isParentOnboarded) {
    return <ParentOnboarding />;
  }

  // 5. Fully authenticated → Dashboard
  return <Dashboard />;
}

/* ─────────────────────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
