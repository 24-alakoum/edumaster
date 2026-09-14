import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, GraduationCap, School, Banknote, ArrowUpRight, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminDashboard = ({ setActiveTab }) => {
  const { students, teachers, classes, payments, schoolInfo } = useApp();

  // Calculs statistiques
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;

  const totalExpectedTuition = students.reduce((acc, s) => acc + (s.tuitionTotal || 450000), 0);
  const totalCollectedTuition = students.reduce((acc, s) => acc + (s.tuitionPaid || 0), 0);
  const totalRemainingTuition = totalExpectedTuition - totalCollectedTuition;
  const collectionRate = totalExpectedTuition > 0 ? ((totalCollectedTuition / totalExpectedTuition) * 100).toFixed(1) : 0;

  const paidStudentsCount = students.filter(s => s.tuitionStatus === 'solde').length;
  const pendingStudentsCount = students.filter(s => s.tuitionStatus === 'partiel').length;
  const overdueStudentsCount = students.filter(s => s.tuitionStatus === 'retard').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-work-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-success-400 bg-work-800 px-3 py-1 rounded-full border border-work-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tableau de Bord Direction</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion Globale de l'Établissement</h2>
          <p className="text-work-300 text-sm">
            Vue synthétique des effectifs, du corps professoral et du recouvrement financier.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('students')}
            className="bg-success-600 hover:bg-success-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-smooth shadow-sm flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Gérer les Élèves</span>
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className="bg-work-800 hover:bg-work-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl border border-work-700 transition-smooth flex items-center gap-1.5"
          >
            <Banknote className="w-4 h-4 text-success-400" />
            <span>Enregistrer un Paiement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (4 cartes minimalistes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 : Élèves */}
        <div className="bg-white p-5 rounded-2xl border border-work-200 shadow-sm hover:border-work-300 transition-smooth">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-work-500 uppercase tracking-wider">Effectif Élèves</span>
            <div className="p-2 bg-work-100 text-work-900 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-work-900">{totalStudents}</span>
            <span className="text-xs font-medium text-work-500">inscrits</span>
          </div>
          <div className="mt-2 text-xs text-work-500">Répartis sur {totalClasses} classes</div>
        </div>

        {/* Card 2 : Enseignants */}
        <div className="bg-white p-5 rounded-2xl border border-work-200 shadow-sm hover:border-work-300 transition-smooth">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-work-500 uppercase tracking-wider">Professeurs</span>
            <div className="p-2 bg-work-100 text-work-900 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-work-900">{totalTeachers}</span>
            <span className="text-xs font-medium text-work-500">enseignants</span>
          </div>
          <div className="mt-2 text-xs text-work-500">Corps professoral actif</div>
        </div>

        {/* Card 3 : Recouvrement Financier (Vert Émeraude - Réussite) */}
        <div className="bg-white p-5 rounded-2xl border border-success-200 shadow-sm hover:border-success-300 transition-smooth">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-success-700 uppercase tracking-wider">Encaissements</span>
            <div className="p-2 bg-success-50 text-success-700 rounded-xl">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-work-900">
              {totalCollectedTuition.toLocaleString('fr-FR')} <span className="text-sm font-semibold text-work-600">{schoolInfo.currency}</span>
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-semibold text-success-600">{collectionRate}% recouvré</span>
            <span className="text-work-400">sur {totalExpectedTuition.toLocaleString('fr-FR')} {schoolInfo.currency}</span>
          </div>
        </div>

        {/* Card 4 : Reste à Recouvrer */}
        <div className="bg-white p-5 rounded-2xl border border-work-200 shadow-sm hover:border-work-300 transition-smooth">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-work-500 uppercase tracking-wider">Reste à Recouvrer</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-work-900">
              {totalRemainingTuition.toLocaleString('fr-FR')} <span className="text-sm font-semibold text-work-600">{schoolInfo.currency}</span>
            </span>
          </div>
          <div className="mt-2 text-xs text-work-500">
            {overdueStudentsCount} élève(s) en retard de paiement
          </div>
        </div>
      </div>

      {/* Grid Finance Overview & Quick Roster Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Échéancier Financier & Bar de progression */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-work-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-work-900 text-lg">Statut Financier des Frais de Scolarité</h3>
              <p className="text-xs text-work-500">Répartition du règlement des scolarités par catégorie d'élève</p>
            </div>
            <button
              onClick={() => setActiveTab('finance')}
              className="text-xs font-semibold text-success-600 hover:text-success-700 flex items-center gap-1"
            >
              <span>Détails financiers</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Bar Multi-segments */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-work-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(paidStudentsCount / totalStudents) * 100}%` }}
                className="bg-success-600 h-full transition-all duration-500"
                title={`Solder: ${paidStudentsCount}`}
              />
              <div
                style={{ width: `${(pendingStudentsCount / totalStudents) * 100}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
                title={`Partiel: ${pendingStudentsCount}`}
              />
              <div
                style={{ width: `${(overdueStudentsCount / totalStudents) * 100}%` }}
                className="bg-rose-500 h-full transition-all duration-500"
                title={`En retard: ${overdueStudentsCount}`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
              <div className="bg-success-50 p-2.5 rounded-xl border border-success-100">
                <div className="flex items-center justify-center gap-1.5 text-success-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Scolarité Soldée</span>
                </div>
                <div className="text-lg font-extrabold text-work-900 mt-1">{paidStudentsCount} élèves</div>
              </div>

              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                <div className="flex items-center justify-center gap-1.5 text-amber-700 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Paiement Partiel</span>
                </div>
                <div className="text-lg font-extrabold text-work-900 mt-1">{pendingStudentsCount} élèves</div>
              </div>

              <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                <div className="flex items-center justify-center gap-1.5 text-rose-700 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>En Retard</span>
                </div>
                <div className="text-lg font-extrabold text-work-900 mt-1">{overdueStudentsCount} élèves</div>
              </div>
            </div>
          </div>
        </div>

        {/* Aperçu des Derniers Paiements Enregistrés */}
        <div className="bg-white p-6 rounded-2xl border border-work-200 shadow-sm space-y-4">
          <h3 className="font-bold text-work-900 text-lg">Derniers Enregistrements</h3>

          <div className="space-y-3">
            {payments.slice(0, 4).map((pay) => (
              <div key={pay.id} className="flex items-center justify-between p-3 bg-work-50 rounded-xl border border-work-100 text-xs">
                <div>
                  <div className="font-bold text-work-900">{pay.studentName}</div>
                  <div className="text-work-500 text-[11px]">{pay.method} • {pay.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-success-600">+{pay.amount.toLocaleString('fr-FR')} FCFA</div>
                  <span className="text-[10px] text-work-400">Réf: {pay.reference}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
