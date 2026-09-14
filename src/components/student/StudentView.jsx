import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Printer, BookOpen, Award, CheckCircle2, ShieldCheck } from 'lucide-react';

export const StudentView = () => {
  const {
    subjects,
    calculateStudentAverage,
    schoolInfo,
    currentUser,
    getScopedStudents,
    getScopedGrades
  } = useApp();

  const [period, setPeriod] = useState('Trimestre 1');

  // L'élève connecté depuis la liste scopée au rôle
  const scopedStudents = getScopedStudents();
  const student = scopedStudents[0] || {
    id: 'stu-101',
    name: 'Cheick Diallo',
    className: '3ème A',
    matricule: 'EDU-2025-089',
    avatar: currentUser.avatar
  };

  const scopedGrades = getScopedGrades();
  const studentGrades = scopedGrades.filter(g => g.studentId === student.id && g.period === period);
  const averageData = calculateStudentAverage(student.id, period);

  // Lancer l'impression directe du bulletin
  const handlePrintReportCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-work-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar || currentUser.avatar}
            alt={student.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-success-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{student.name}</h2>
              <span className="bg-success-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {student.className}
              </span>
            </div>
            <p className="text-work-300 text-xs mt-0.5">
              Matricule : <strong className="text-white font-mono">{student.matricule}</strong> • Année Académique {schoolInfo.academicYear} (Espace Privé Élève)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintReportCard}
            className="bg-success-600 hover:bg-success-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-smooth shadow-md flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer mon Bulletin (PDF)</span>
          </button>
        </div>
      </div>

      {/* Relevé / Bulletin de Notes Officiel (Optimisé pour Impression & Écran) */}
      <div className="bg-white p-8 rounded-2xl border border-work-200 shadow-sm space-y-6 print:border-none print:p-0">
        {/* Header Officiel du Bulletin */}
        <div className="flex items-center justify-between border-b-2 border-work-900 pb-4">
          <div>
            <h1 className="text-xl font-black text-work-900 tracking-tight uppercase">{schoolInfo.name}</h1>
            <p className="text-xs text-work-600 font-medium">{schoolInfo.address} • Tel: {schoolInfo.phone}</p>
          </div>

          <div className="text-right">
            <h2 className="text-lg font-extrabold text-success-700 uppercase">Bulletin Trimestriel</h2>
            <p className="text-xs font-bold text-work-800">{period} • {schoolInfo.academicYear}</p>
          </div>
        </div>

        {/* Fiche Élève synthétique */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-work-50 p-4 rounded-xl border border-work-200 text-xs">
          <div>
            <span className="text-work-500 font-medium block">Nom & Prénom :</span>
            <strong className="text-work-900 text-sm font-bold">{student.name}</strong>
          </div>
          <div>
            <span className="text-work-500 font-medium block">Matricule :</span>
            <strong className="text-work-900 font-mono">{student.matricule}</strong>
          </div>
          <div>
            <span className="text-work-500 font-medium block">Classe :</span>
            <strong className="text-work-900 font-bold">{student.className}</strong>
          </div>
          <div>
            <span className="text-work-500 font-medium block">Moyenne Générale :</span>
            <strong className="text-success-700 text-base font-black">{averageData.average} / 20</strong>
          </div>
        </div>

        {/* Tableau des Matières & Notes */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-work-200">
            <thead className="bg-work-900 text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3 border border-work-700">Discipline / Matière</th>
                <th className="p-3 border border-work-700 text-center w-20">Coef</th>
                <th className="p-3 border border-work-700 text-center w-24">Note (/20)</th>
                <th className="p-3 border border-work-700 text-center w-28">Total Pondéré</th>
                <th className="p-3 border border-work-700">Appréciation de l'Enseignant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-work-200">
              {subjects.map((sub) => {
                const subGrades = studentGrades.filter(g => g.subjectId === sub.id);
                const subScore = subGrades.length > 0
                  ? (subGrades.reduce((acc, g) => acc + g.score, 0) / subGrades.length).toFixed(2)
                  : 'N/A';
                const totalWeighted = subScore !== 'N/A' ? (Number(subScore) * sub.coef).toFixed(2) : '—';
                const lastComment = subGrades.length > 0 ? subGrades[subGrades.length - 1].comment : 'Aucune note saisie';

                return (
                  <tr key={sub.id} className="hover:bg-work-50/50 font-medium">
                    <td className="p-3 border border-work-200 font-bold text-work-900">{sub.name}</td>
                    <td className="p-3 border border-work-200 text-center font-bold">{sub.coef}</td>
                    <td className="p-3 border border-work-200 text-center font-extrabold text-work-900">
                      {subScore !== 'N/A' ? `${subScore} / 20` : '—'}
                    </td>
                    <td className="p-3 border border-work-200 text-center font-bold text-success-700">
                      {totalWeighted}
                    </td>
                    <td className="p-3 border border-work-200 italic text-work-600 text-[11px]">{lastComment}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-work-100 font-bold text-work-900 border-t-2 border-work-900">
              <tr>
                <td className="p-3 border border-work-200 uppercase font-black">Bilan Général</td>
                <td className="p-3 border border-work-200 text-center font-black">{averageData.totalCoefs}</td>
                <td className="p-3 border border-work-200 text-center text-sm font-black text-success-700">
                  {averageData.average} / 20
                </td>
                <td className="p-3 border border-work-200 text-center font-black">{averageData.totalPoints} pts</td>
                <td className="p-3 border border-work-200 font-bold text-success-700">
                  {averageData.average >= 14 ? "Mention Très Bien — Tableau d'Honneur" : "Résultats Satisfaisants"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Visa & Signatures Footer */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-work-200 text-xs text-center font-bold">
          <div>
            <p className="text-work-500 mb-8 uppercase text-[10px] tracking-wider">Le Professeur Principal</p>
            <p className="text-work-900 border-t border-work-300 inline-block px-8 pt-1">Prof. Amadou Diallo</p>
          </div>
          <div>
            <p className="text-work-500 mb-8 uppercase text-[10px] tracking-wider">Le Directeur des Études</p>
            <p className="text-work-900 border-t border-work-300 inline-block px-8 pt-1">M. Jean-Baptiste Koffi</p>
          </div>
        </div>
      </div>
    </div>
  );
};
