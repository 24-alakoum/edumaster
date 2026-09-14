import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, GraduationCap, Users, User, BookOpen, Layers } from 'lucide-react';

export const Header = () => {
  const { currentRole, switchRole, currentUser, schoolInfo } = useApp();

  const rolesConfig = [
    { id: 'admin', label: 'Administrateur', icon: ShieldCheck, color: 'bg-work-900 text-white hover:bg-work-800' },
    { id: 'teacher', label: 'Professeur', icon: GraduationCap, color: 'bg-work-700 text-white hover:bg-work-600' },
    { id: 'parent', label: 'Parent', icon: Users, color: 'bg-success-600 text-white hover:bg-success-700' },
    { id: 'student', label: 'Élève', icon: User, color: 'bg-emerald-600 text-white hover:bg-emerald-700' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-work-200 shadow-sm no-print">
      {/* Top Banner: Sélecteur de Rôle interactif */}
      <div className="bg-work-900 text-white text-xs px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-success-400 animate-pulse"></span>
          <span>Sélecteur de Rôle MVP (Démonstration) :</span>
        </div>

        <div className="flex items-center gap-1 bg-work-800 p-1 rounded-lg">
          {rolesConfig.map((role) => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => switchRole(role.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-smooth font-medium ${
                  isActive
                    ? 'bg-success-600 text-white shadow-sm scale-105'
                    : 'text-work-300 hover:text-white hover:bg-work-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & School Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-work-900 text-white flex items-center justify-center font-extrabold text-xl shadow-md border border-work-700">
            <span className="text-white">E</span>
            <span className="text-success-400">M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl text-work-900 tracking-tight">
                EDU<span className="text-success-600">MASTER</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-success-50 text-success-700 border border-success-200 rounded-full">
                SaaS ERP
              </span>
            </div>
            <p className="text-xs text-work-500 font-medium">{schoolInfo.name} • {schoolInfo.academicYear}</p>
          </div>
        </div>

        {/* Current Active User Profile */}
        <div className="flex items-center gap-3 bg-work-50 px-3.5 py-1.5 rounded-xl border border-work-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-success-500"
          />
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-work-900 leading-tight">{currentUser.name}</div>
            <div className="text-[11px] font-medium text-success-700 capitalize flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
              {currentRole === 'admin' ? 'Administrateur' :
               currentRole === 'teacher' ? 'Professeur' :
               currentRole === 'parent' ? 'Parent d\'élève' : 'Élève'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
