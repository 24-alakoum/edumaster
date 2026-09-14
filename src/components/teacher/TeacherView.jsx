import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, BookOpen, Save, Calendar, FileSpreadsheet, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import * as XLSX from 'xlsx';

export const TeacherView = () => {
  const {
    subjects,
    addGrade,
    deleteGrade,
    currentUser,
    schedules,
    getScopedStudents,
    getScopedClasses,
    getScopedGrades,
    getCurrentTeacherProfile
  } = useApp();

  const scopedClasses = getScopedClasses();
  const scopedStudents = getScopedStudents();
  const scopedGrades = getScopedGrades();
  const teacherProfile = getCurrentTeacherProfile();

  const [activeTab, setActiveTab] = useState('grades'); // 'grades' | 'schedule'
  const [selectedClassId, setSelectedClassId] = useState(scopedClasses[0]?.id || 'cls-3a');
  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-math');
  const [period, setPeriod] = useState('Trimestre 1');

  // Form State pour la saisie d'une évaluation
  const [evaluationTitle, setEvaluationTitle] = useState('Devoir N°2 de Mathématiques');
  const [coef, setCoef] = useState(5);
  const [scores, setScores] = useState({}); // { [studentId]: { score: 15, comment: 'Bon travail' } }
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Filtrer les élèves de la classe sélectionnée parmi les élèves autorisés
  const classStudents = scopedStudents.filter(s => s.classId === selectedClassId);
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const selectedClass = scopedClasses.find(c => c.id === selectedClassId) || scopedClasses[0] || { name: 'Classe' };

  const handleScoreChange = (studentId, field, value) => {
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleBatchSaveGrades = (e) => {
    e.preventDefault();

    let count = 0;
    classStudents.forEach(student => {
      const studentEntry = scores[student.id];
      if (studentEntry && studentEntry.score !== undefined && studentEntry.score !== '') {
        addGrade({
          studentId: student.id,
          subjectId: selectedSubject.id,
          subjectName: selectedSubject.name,
          coef: Number(coef),
          score: Number(studentEntry.score),
          maxScore: 20,
          period,
          title: evaluationTitle,
          comment: studentEntry.comment || 'Travail satisfaisant',
          teacherName: currentUser.name
        });
        count++;
      }
    });

    setSaveSuccessMsg(`${count} notes publiées avec succès !`);
    setScores({});
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Exporter le relevé de notes sous format Excel
  const handleExportClassGrades = () => {
    const exportData = classStudents.map(student => {
      const studentGrades = scopedGrades.filter(g => g.studentId === student.id && g.subjectId === selectedSubjectId);
      const scoresList = studentGrades.map(g => `${g.title}: ${g.score}/20`).join(' | ');
      const avg = studentGrades.length > 0
        ? (studentGrades.reduce((acc, g) => acc + g.score, 0) / studentGrades.length).toFixed(2)
        : 'N/A';

      return {
        "Matricule": student.matricule,
        "Nom Élève": student.name,
        "Classe": student.className,
        "Matière": selectedSubject.name,
        "Notes Saisies": scoresList || "Aucune note",
        "Moyenne Matière": avg
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Notes_${selectedClass.name}`);
    XLSX.writeFile(workbook, `Notes_${selectedClass.name}_${selectedSubject.code}.xlsx`);
  };

  const teacherSchedule = schedules[selectedClassId] || [];

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="bg-work-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-success-600 font-extrabold text-xl text-white flex items-center justify-center border-2 border-success-400">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              <span className="bg-work-800 text-success-400 text-xs px-2.5 py-0.5 rounded-full border border-work-700 font-semibold">
                Espace Enseignant (Accès Sécurisé)
              </span>
            </div>
            <p className="text-work-300 text-xs mt-0.5">
              Spécialité : <strong className="text-white">{teacherProfile?.specialty || 'Enseignant'}</strong> • {scopedClasses.length} classe(s) sous votre responsabilité
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-work-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-smooth flex items-center gap-1.5 ${
              activeTab === 'grades' ? 'bg-success-600 text-white' : 'text-work-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Saisie des Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-smooth flex items-center gap-1.5 ${
              activeTab === 'schedule' ? 'bg-success-600 text-white' : 'text-work-300 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Mon Emploi du Temps</span>
          </button>
        </div>
      </div>

      {activeTab === 'grades' ? (
        <div className="space-y-6">
          {/* Controls Bar : Selection Classe, Matière, Période */}
          <div className="bg-white p-5 rounded-2xl border border-work-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
              <div>
                <label className="font-bold text-work-800 block mb-1">Vos Classes Assignées :</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-work-50 border border-work-200 rounded-xl font-bold text-work-900 focus:border-success-500 focus:outline-none"
                >
                  {scopedClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-work-800 block mb-1">Matière :</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-work-50 border border-work-200 rounded-xl font-bold text-work-900 focus:border-success-500 focus:outline-none"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Coef {s.coef})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-work-800 block mb-1">Période :</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 bg-work-50 border border-work-200 rounded-xl font-bold text-work-900 focus:border-success-500 focus:outline-none"
                >
                  <option value="Trimestre 1">Trimestre 1</option>
                  <option value="Trimestre 2">Trimestre 2</option>
                  <option value="Trimestre 3">Trimestre 3</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleExportClassGrades}
              className="bg-work-100 hover:bg-work-200 text-work-900 font-semibold px-4 py-2.5 rounded-xl border border-work-300 transition-smooth flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-success-600" />
              <span>Exporter Relevé Excel</span>
            </button>
          </div>

          {/* Form Matrix De Saisie des Notes */}
          <form onSubmit={handleBatchSaveGrades} className="bg-white rounded-2xl border border-work-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-work-200 pb-4 text-xs">
              <div>
                <h3 className="text-lg font-extrabold text-work-900">
                  Grille d'Évaluation — {selectedClass.name}
                </h3>
                <p className="text-work-500">Saisie restreinte aux élèves de votre classe ({classStudents.length} élèves)</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="space-y-1 flex-1 sm:flex-none">
                  <span className="font-bold text-work-800 block">Intitulé de l'Évaluation :</span>
                  <input
                    type="text"
                    required
                    value={evaluationTitle}
                    onChange={(e) => setEvaluationTitle(e.target.value)}
                    className="p-2 border border-work-200 rounded-xl font-semibold w-full sm:w-56 focus:border-success-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 w-20">
                  <span className="font-bold text-work-800 block">Coef :</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={coef}
                    onChange={(e) => setCoef(e.target.value)}
                    className="p-2 border border-work-200 rounded-xl font-bold text-center w-full focus:border-success-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="bg-success-50 text-success-700 p-3 rounded-xl border border-success-200 flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Students Grade Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-work-700">
                <thead className="bg-work-50 text-work-900 font-bold uppercase tracking-wider text-[11px] border-b border-work-200">
                  <tr>
                    <th className="py-3 px-4">Élève</th>
                    <th className="py-3 px-4 w-32">Note (/20)</th>
                    <th className="py-3 px-4">Appréciation / Observation</th>
                    <th className="py-3 px-4 text-right">Dernières Notes Publiées</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-work-100">
                  {classStudents.map((student) => {
                    const studentGrades = scopedGrades.filter(
                      g => g.studentId === student.id && g.subjectId === selectedSubjectId
                    );
                    const currentEntry = scores[student.id] || { score: '', comment: '' };

                    return (
                      <tr key={student.id} className="hover:bg-work-50/80 transition-smooth">
                        <td className="py-3 px-4 font-semibold text-work-900">
                          <div className="font-extrabold">{student.name}</div>
                          <div className="text-[10px] text-work-400 font-mono">{student.matricule}</div>
                        </td>

                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="20"
                            placeholder="/20"
                            value={currentEntry.score}
                            onChange={(e) => handleScoreChange(student.id, 'score', e.target.value)}
                            className="w-24 p-2 bg-work-50 border border-work-200 rounded-xl font-bold text-work-900 text-center focus:border-success-500 focus:bg-white focus:outline-none"
                          />
                        </td>

                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="ex: Très attentif et réactif..."
                            value={currentEntry.comment}
                            onChange={(e) => handleScoreChange(student.id, 'comment', e.target.value)}
                            className="w-full p-2 bg-work-50 border border-work-200 rounded-xl font-medium focus:border-success-500 focus:bg-white focus:outline-none"
                          />
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            {studentGrades.length === 0 ? (
                              <span className="text-[11px] text-work-400 italic">Aucune note</span>
                            ) : (
                              studentGrades.map(g => (
                                <span
                                  key={g.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-success-50 text-success-800 border border-success-200 rounded font-bold text-[11px]"
                                  title={`${g.title}: ${g.comment}`}
                                >
                                  {g.score}/20
                                  <button
                                    type="button"
                                    onClick={() => deleteGrade(g.id)}
                                    className="text-rose-500 hover:text-rose-700 ml-0.5"
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-4 border-t border-work-200">
              <button
                type="submit"
                className="bg-success-600 hover:bg-success-700 text-white font-bold px-6 py-3 rounded-xl transition-smooth shadow-md flex items-center gap-2 text-xs"
              >
                <Save className="w-4 h-4" />
                <span>Publier les Notes de la Classe</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Vue Emploi du Temps du Professeur */
        <div className="bg-white p-6 rounded-2xl border border-work-200 shadow-sm space-y-4">
          <h3 className="text-lg font-extrabold text-work-900">Emploi du Temps Hebdomadaire — {selectedClass.name}</h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map(dayName => {
              const daySlots = teacherSchedule.filter(s => s.day === dayName);
              return (
                <div key={dayName} className="bg-work-50 p-4 rounded-2xl border border-work-200 space-y-3">
                  <div className="font-extrabold text-work-900 text-xs uppercase text-center pb-2 border-b border-work-200">
                    {dayName}
                  </div>

                  {daySlots.length === 0 ? (
                    <div className="text-center py-6 text-[11px] text-work-400">Libre</div>
                  ) : (
                    daySlots.map((slot, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-work-200 text-xs space-y-1">
                        <div className="text-[10px] font-bold text-success-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {slot.time}
                        </div>
                        <div className="font-extrabold text-work-900">{slot.subject}</div>
                        <div className="text-[10px] text-work-500 font-semibold">{slot.room}</div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
