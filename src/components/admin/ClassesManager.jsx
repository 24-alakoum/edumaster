import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus, School, Users, Calendar, Clock, MapPin, User,
  Trash2, AlertCircle, Loader2, Sparkles, Filter, BookOpen
} from 'lucide-react';

export const ClassesManager = () => {
  const {
    classes,
    students,
    teachers,
    subjects,
    addClass,
    deleteClass,
    schedules,
    addScheduleSlot,
    deleteScheduleSlot,
    academicYears,
    selectedAcademicYear,
    setSelectedAcademicYear,
    addAcademicYear,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState('');
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isAddYearModalOpen, setIsAddYearModalOpen] = useState(false);
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);

  // Form states - Class
  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState('Collège');
  const [newClassYear, setNewClassYear] = useState(selectedAcademicYear || '2025-2026');

  // Form states - Academic Year
  const [newYearInput, setNewYearInput] = useState('');

  // Form states - Schedule Slot
  const [slotDay, setSlotDay] = useState('Lundi');
  const [slotTime, setSlotTime] = useState('08h00 - 10h00');
  const [slotSubject, setSlotSubject] = useState(subjects[0]?.name || 'Mathématiques');
  const [slotTeacher, setSlotTeacher] = useState(teachers[0]?.name || 'Professeur');
  const [slotRoom, setSlotRoom] = useState('Salle 101');

  // UI status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter classes by selected academic year (or all)
  const filteredClasses = selectedAcademicYear && selectedAcademicYear !== 'ALL'
    ? classes.filter(c => !c.academic_year || c.academic_year === selectedAcademicYear)
    : classes;

  // Active class object for schedule display
  const activeClassId = selectedClassId || filteredClasses[0]?.id || classes[0]?.id;
  const selectedClassObj = classes.find(c => c.id === activeClassId);
  const activeSchedule = (selectedClassObj ? schedules[selectedClassObj.id] : []) || [];

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await addClass({
      name: newClassName.trim(),
      level: newClassLevel,
      academic_year: newClassYear,
    });

    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg(`La classe "${newClassName}" a été créée avec succès !`);
      setNewClassName('');
      setTimeout(() => {
        setSuccessMsg('');
        setIsAddClassModalOpen(false);
      }, 1200);
    }
  };

  const handleCreateAcademicYear = async (e) => {
    e.preventDefault();
    if (!newYearInput.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await addAcademicYear(newYearInput.trim());
    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setSelectedAcademicYear(newYearInput.trim());
      setNewYearInput('');
      setIsAddYearModalOpen(false);
    }
  };

  const handleCreateScheduleSlot = async (e) => {
    e.preventDefault();
    if (!selectedClassObj) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await addScheduleSlot({
      class_id: selectedClassObj.id,
      day_name: slotDay,
      time_slot: slotTime,
      subject_name: slotSubject,
      teacher_name: slotTeacher,
      classroom: slotRoom,
    });

    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setIsAddScheduleModalOpen(false);
    }
  };

  const handleDeleteClass = async (id, className) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer la classe "${className}" ?`)) return;
    const res = await deleteClass(id);
    if (res?.error) {
      alert(`Impossible de supprimer la classe : ${res.error}`);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!selectedClassObj) return;
    await deleteScheduleSlot(slotId, selectedClassObj.id);
  };

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const timeSlotsOptions = [
    "08h00 - 09h30",
    "09h30 - 11h00",
    "11h15 - 12h45",
    "14h00 - 15h30",
    "15h30 - 17h00",
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Academic Year Banner */}
      <div className="bg-white p-5 rounded-2xl border border-work-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-work-900">Gestion des Classes & Emplois du Temps</h2>
            <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              {selectedAcademicYear === 'ALL' ? 'Toutes les années' : selectedAcademicYear}
            </span>
          </div>
          <p className="text-xs text-work-500 mt-1">
            Gérez les structures par année scolaire et organisez les emplois du temps des élèves.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Academic Year Filter Selector */}
          <div className="flex items-center gap-1.5 bg-work-50 px-3 py-2 rounded-xl border border-work-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-work-500" />
            <span className="font-bold text-work-700 hidden sm:inline">Année :</span>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="bg-transparent font-extrabold text-work-900 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Toutes les années</option>
              {academicYears.map((ay) => (
                <option key={ay.id || ay.year_code} value={ay.year_code}>
                  {ay.year_code} {ay.is_current ? '(En cours)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Add Academic Year Button */}
          <button
            onClick={() => setIsAddYearModalOpen(true)}
            className="bg-work-100 hover:bg-work-200 text-work-800 text-xs font-bold px-3 py-2 rounded-xl transition-smooth flex items-center gap-1.5"
            title="Créer une nouvelle année scolaire"
          >
            <Plus className="w-3.5 h-3.5 text-work-600" />
            <span>Nouvelle Année</span>
          </button>

          {/* Add Class Button */}
          <button
            onClick={() => {
              setNewClassYear(selectedAcademicYear === 'ALL' ? '2025-2026' : selectedAcademicYear);
              setErrorMsg('');
              setSuccessMsg('');
              setIsAddClassModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-smooth shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une Classe</span>
          </button>
        </div>
      </div>

      {/* Classes Selector Pills & List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold text-work-500 uppercase tracking-wider">
            Classes disponibles ({filteredClasses.length})
          </h3>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-work-300 p-8 text-center space-y-3">
            <School className="w-10 h-10 text-work-300 mx-auto" />
            <div>
              <p className="font-extrabold text-work-800 text-sm">Aucune classe trouvée</p>
              <p className="text-xs text-work-500 mt-0.5">
                Aucune classe enregistrée pour l'année scolaire <span className="font-bold">{selectedAcademicYear}</span>.
              </p>
            </div>
            <button
              onClick={() => setIsAddClassModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-smooth inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer la première classe</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {filteredClasses.map((cls) => {
              const count = students.filter(
                s => s.class_id === cls.id || s.classId === cls.id
              ).length;
              const isSelected = cls.id === activeClassId;
              return (
                <div
                  key={cls.id}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-smooth min-w-[210px] group ${
                    isSelected
                      ? 'bg-work-900 text-white border-work-900 shadow-md'
                      : 'bg-white text-work-800 border-work-200 hover:border-work-300'
                  }`}
                >
                  <button
                    onClick={() => setSelectedClassId(cls.id)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <div className={`p-2.5 rounded-xl font-bold text-xs ${
                      isSelected ? 'bg-work-800 text-emerald-400' : 'bg-work-100 text-work-700'
                    }`}>
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                        <span>{cls.name}</span>
                      </div>
                      <div className={`text-[11px] font-medium flex items-center gap-1.5 mt-0.5 ${
                        isSelected ? 'text-work-300' : 'text-work-500'
                      }`}>
                        <span>{count} élève(s)</span>
                        <span>•</span>
                        <span className="font-bold opacity-85">{cls.academic_year || '2025-2026'}</span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDeleteClass(cls.id, cls.name)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 ${
                      isSelected ? 'hover:bg-work-800 text-rose-400' : ''
                    }`}
                    title="Supprimer cette classe"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Timetable Display for Active Class */}
      {selectedClassObj && (
        <div className="bg-white p-6 rounded-2xl border border-work-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-work-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-work-900">Emploi du Temps — {selectedClassObj.name}</h3>
                <span className="text-xs bg-work-100 text-work-800 font-bold px-2.5 py-0.5 rounded-full">
                  Niveau : {selectedClassObj.level}
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {selectedClassObj.academic_year || '2025-2026'}
                </span>
              </div>
              <p className="text-xs text-work-500 mt-1">
                Planning des cours hebdomadaires pour les enseignants et élèves de la classe {selectedClassObj.name}.
              </p>
            </div>

            <button
              onClick={() => {
                if (subjects.length > 0) setSlotSubject(subjects[0].name);
                if (teachers.length > 0) setSlotTeacher(teachers[0].name);
                setErrorMsg('');
                setIsAddScheduleModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-smooth shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un cours</span>
            </button>
          </div>

          {/* Schedule Grid Days */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {days.map((dayName) => {
              const daySlots = activeSchedule.filter(s => s.day === dayName);
              return (
                <div key={dayName} className="bg-work-50 rounded-2xl p-4 border border-work-200 space-y-3">
                  <div className="font-extrabold text-work-900 text-xs uppercase tracking-wider text-center pb-2 border-b border-work-200 flex items-center justify-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{dayName}</span>
                  </div>

                  {daySlots.length === 0 ? (
                    <div className="text-center py-6 text-[11px] text-work-400 font-medium">
                      Pas de cours programmé
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {daySlots.map((slot, idx) => (
                        <div key={slot.id || idx} className="bg-white p-3 rounded-xl border border-work-200 shadow-xs space-y-1.5 hover:border-emerald-400 transition-smooth group relative">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                              <Clock className="w-3 h-3" />
                              <span>{slot.time}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="text-work-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                              title="Supprimer ce cours"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="font-extrabold text-work-900 text-xs">{slot.subject}</div>

                          <div className="flex items-center justify-between text-[10px] text-work-500 pt-1 border-t border-work-100">
                            <span className="flex items-center gap-1 font-medium">
                              <User className="w-3 h-3 text-work-400" /> {slot.teacher}
                            </span>
                            <span className="flex items-center gap-0.5 font-semibold text-work-700 bg-work-100 px-1.5 py-0.5 rounded">
                              <MapPin className="w-2.5 h-2.5" /> {slot.room}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal 1: Créer une nouvelle classe */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-work-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-work-200 space-y-4">
            <div className="flex items-center justify-between border-b border-work-200 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-work-900 flex items-center gap-2">
                  <School className="w-5 h-5 text-emerald-600" />
                  <span>Créer une nouvelle classe</span>
                </h3>
                <p className="text-xs text-work-500">Ajouter une classe pour l'année scolaire sélectionnée</p>
              </div>
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="text-work-400 hover:text-work-700 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-work-800">Nom de la classe *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: 6ème A, 3ème B, Terminale C"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-work-800">Niveau *</label>
                  <select
                    value={newClassLevel}
                    onChange={(e) => setNewClassLevel(e.target.value)}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none font-semibold text-xs bg-white"
                  >
                    <option value="Collège">Collège</option>
                    <option value="Lycée">Lycée</option>
                    <option value="Primaire">Primaire</option>
                    <option value="Maternelle">Maternelle</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-work-800">Année Scolaire *</label>
                  <select
                    value={newClassYear}
                    onChange={(e) => setNewClassYear(e.target.value)}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none font-semibold text-xs bg-white"
                  >
                    {academicYears.map((ay) => (
                      <option key={ay.id || ay.year_code} value={ay.year_code}>
                        {ay.year_code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-work-200">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 bg-work-100 text-work-700 rounded-xl font-semibold hover:bg-work-200 transition-smooth"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newClassName.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-smooth disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Créer la classe</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Créer une nouvelle Année Scolaire */}
      {isAddYearModalOpen && (
        <div className="fixed inset-0 z-50 bg-work-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-work-200 space-y-4">
            <div className="flex items-center justify-between border-b border-work-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-work-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Nouvelle Année Scolaire</span>
                </h3>
              </div>
              <button
                onClick={() => setIsAddYearModalOpen(false)}
                className="text-work-400 hover:text-work-700 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateAcademicYear} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-work-800">Code de l'année (ex: 2026-2027) *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: 2026-2027"
                  value={newYearInput}
                  onChange={(e) => setNewYearInput(e.target.value)}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-work-200">
                <button
                  type="button"
                  onClick={() => setIsAddYearModalOpen(false)}
                  className="px-4 py-2 bg-work-100 text-work-700 rounded-xl font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newYearInput.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-smooth disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Ajouter l'année</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Ajouter un créneau d'Emploi du Temps */}
      {isAddScheduleModalOpen && selectedClassObj && (
        <div className="fixed inset-0 z-50 bg-work-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-work-200 space-y-4">
            <div className="flex items-center justify-between border-b border-work-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-work-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Ajouter un cours — {selectedClassObj.name}</span>
                </h3>
              </div>
              <button
                onClick={() => setIsAddScheduleModalOpen(false)}
                className="text-work-400 hover:text-work-700 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateScheduleSlot} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-work-800">Jour *</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value)}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none font-semibold bg-white"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-work-800">Horaire *</label>
                  <select
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none font-semibold bg-white"
                  >
                    {timeSlotsOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-work-800">Matière *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Mathématiques, Français, Anglais"
                  value={slotSubject}
                  onChange={(e) => setSlotSubject(e.target.value)}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-work-800">Enseignant</label>
                  <input
                    type="text"
                    placeholder="ex: Prof. Diallo"
                    value={slotTeacher}
                    onChange={(e) => setSlotTeacher(e.target.value)}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-work-800">Salle</label>
                  <input
                    type="text"
                    placeholder="ex: Salle 101, Labo A"
                    value={slotRoom}
                    onChange={(e) => setSlotRoom(e.target.value)}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-work-200">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleModalOpen(false)}
                  className="px-4 py-2 bg-work-100 text-work-700 rounded-xl font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !slotSubject.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-smooth disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Enregistrer le cours</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
