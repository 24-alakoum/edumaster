import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, GraduationCap, Users, User, LogOut, Sparkles } from 'lucide-react';

export const Header = () => {
  const { currentRole, userProfile, schoolInfo, signOut, selectedAcademicYear } = useApp();

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'teacher': return 'Professeur';
      case 'parent': return 'Parent d\'élève';
      case 'student': return 'Élève';
      default: return role || 'Utilisateur';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return ShieldCheck;
      case 'teacher': return GraduationCap;
      case 'parent': return Users;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon(currentRole);
  const userName = userProfile?.full_name || 'Utilisateur';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-work-200 shadow-sm no-print">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & School Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-work-900 text-white flex items-center justify-center font-extrabold text-xl shadow-md border border-work-700">
            <span className="text-white">E</span>
            <span className="text-emerald-400">M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl text-work-900 tracking-tight">
                EDU<span className="text-emerald-600">MASTER</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                SaaS ERP
              </span>
            </div>
            <p className="text-xs text-work-500 font-medium">
              {schoolInfo.name} • {selectedAcademicYear || schoolInfo.academicYear}
            </p>
          </div>
        </div>

        {/* Current Active User Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-work-50 px-3.5 py-1.5 rounded-xl border border-work-200">
            <div className="w-8 h-8 rounded-full bg-work-900 text-white font-bold flex items-center justify-center text-xs border-2 border-emerald-500 shadow-sm">
              {userInitial}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-work-900 leading-tight">{userName}</div>
              <div className="text-[11px] font-semibold text-emerald-700 capitalize flex items-center gap-1">
                <RoleIcon className="w-3 h-3 text-emerald-600" />
                <span>{getRoleLabel(currentRole)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={signOut}
            className="p-2 rounded-xl bg-work-100 hover:bg-rose-50 text-work-600 hover:text-rose-600 border border-work-200 transition-smooth flex items-center gap-1.5 text-xs font-bold"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};
