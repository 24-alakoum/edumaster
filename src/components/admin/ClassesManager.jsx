import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, School, Users, Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';

export const ClassesManager = () => {
  const { classes, students, addClass, schedules } = useApp();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-3a');
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState('Collège');

  const selectedClassObj = classes.find(c => c.id === selectedClassId) || classes[0];
  const activeSchedule = schedules[selectedClassId] || schedules['cls-3a'] || [];

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassName) return;
    addClass({
      name: newClassName,
      level: newClassLevel,
      mainTeacher: 'À désigner',
      totalStudents: 0
    });
    setNewClassName('');
    setIsAddClassModalOpen(false);
  };

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-work-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-work-900">Gestion des Classes & Emplois du Temps</h2>
          <p className="text-xs text-work-500">Organisation des niveaux académiques et emplois du temps hebdomadaires</p>
        </div>

        <button
          onClick={() => setIsAddClassModalOpen(true)}
          className="bg-success-600 hover:bg-success-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-smooth shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une Classe</span>
        </button>
      </div>

      {/* Classes Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {classes.map((cls) => {
          const count = students.filter(s => s.classId === cls.id).length;
          const isSelected = cls.id === selectedClassId;
          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-smooth text-left min-w-[180px] ${
                isSelected
                  ? 'bg-work-900 text-white border-work-900 shadow-md'
                  : 'bg-white text-work-800 border-work-200 hover:border-work-300'
              }`}
            >
              <div className={`p-2 rounded-xl font-bold text-xs ${
                isSelected ? 'bg-work-800 text-success-400' : 'bg-work-100 text-work-700'
              }`}>
                <School className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-sm leading-tight">{cls.name}</div>
                <div className={`text-[11px] font-medium ${isSelected ? 'text-work-300' : 'text-work-500'}`}>
                  {count} élève(s) enrolled
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Class Schedule Display */}
      {selectedClassObj && (
        <div className="bg-white p-6 rounded-2xl border border-work-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-work-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-work-900">Emploi du Temps — {selectedClassObj.name}</h3>
                <span className="text-xs bg-work-100 text-work-700 font-bold px-2.5 py-0.5 rounded-full">
                  {selectedClassObj.level}
                </span>
              </div>
              <p className="text-xs text-work-500 mt-0.5">
                Professeur Principal : <span className="font-semibold text-work-800">{selectedClassObj.mainTeacher}</span>
              </p>
            </div>
          </div>

          {/* Schedule Grid Days */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {days.map((dayName) => {
              const daySlots = activeSchedule.filter(s => s.day === dayName);
              return (
                <div key={dayName} className="bg-work-50 rounded-2xl p-4 border border-work-200 space-y-3">
                  <div className="font-extrabold text-work-900 text-xs uppercase tracking-wider text-center pb-2 border-b border-work-200 flex items-center justify-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-success-600" />
                    <span>{dayName}</span>
                  </div>

                  {daySlots.length === 0 ? (
                    <div className="text-center py-6 text-[11px] text-work-400 font-medium">
                      Pas de cours programmé
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {daySlots.map((slot, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-work-200 shadow-xs space-y-1.5 hover:border-success-400 transition-smooth">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-success-700">
                            <Clock className="w-3 h-3" />
                            <span>{slot.time}</span>
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

      {/* Modal Créer une classe */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-work-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-work-200 space-y-4">
            <div className="flex items-center justify-between border-b border-work-200 pb-3">
              <h3 className="font-extrabold text-lg text-work-900">Créer une nouvelle classe</h3>
              <button onClick={() => setIsAddClassModalOpen(false)} className="text-work-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-work-800">Nom de la classe *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: 4ème B ou Terminale C"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-work-800">Niveau *</label>
                <select
                  value={newClassLevel}
                  onChange={(e) => setNewClassLevel(e.target.value)}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none font-semibold"
                >
                  <option value="Collège">Collège</option>
                  <option value="Lycée">Lycée</option>
                  <option value="Primaire">Primaire</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-work-200">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 bg-work-100 text-work-700 rounded-xl font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-success-600 text-white rounded-xl font-bold hover:bg-success-700"
                >
                  Créer la classe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
