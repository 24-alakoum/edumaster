import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, GraduationCap, Mail, Phone, BookOpen, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const TeachersManager = () => {
  const { teachers, classes, subjects, addTeacher, deleteTeacher } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: 'Mathématiques',
    selectedClasses: [],
    selectedSubjects: []
  });

  const handleOpenModal = () => {
    setErrorMsg('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: 'Mathématiques',
      selectedClasses: classes.length > 0 ? [classes[0].id] : [],
      selectedSubjects: subjects.length > 0 ? [subjects[0].id] : []
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await addTeacher({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      specialty: formData.specialty,
      selectedClasses: formData.selectedClasses,
      selectedSubjects: formData.selectedSubjects
    });

    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setIsModalOpen(false);
    }
  };

  const toggleClass = (classId) => {
    setFormData(prev => {
      const exists = prev.selectedClasses.includes(classId);
      return {
        ...prev,
        selectedClasses: exists
          ? prev.selectedClasses.filter(id => id !== classId)
          : [...prev.selectedClasses, classId]
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-work-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-work-900">Corps Professoral ({teachers.length})</h2>
          <p className="text-xs text-work-500">Gestion des enseignants, leurs matières et affectations aux classes</p>
        </div>

        <button
          onClick={handleOpenModal}
          className="bg-success-600 hover:bg-success-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-smooth shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Enseignant</span>
        </button>
      </div>

      {/* Teachers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white p-5 rounded-2xl border border-work-200 shadow-sm hover:border-work-300 transition-smooth space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-work-900 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-work-900 text-sm">{teacher.name}</h3>
                  <p className="text-xs text-success-600 font-semibold">{teacher.specialty}</p>
                </div>
              </div>

              <button
                onClick={() => deleteTeacher(teacher.id)}
                className="text-work-400 hover:text-rose-600 p-1 transition-smooth"
                title="Supprimer l'enseignant"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-work-600 pt-2 border-t border-work-100">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-work-400" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-work-400" />
                <span>{teacher.phone || '—'}</span>
              </div>
            </div>

            {/* Classes & Matières affectées */}
            <div className="pt-2 border-t border-work-100 space-y-2 text-xs">
              <div>
                <span className="font-bold text-work-800 text-[11px] uppercase tracking-wider block mb-1">
                  Classes Enseignées :
                </span>
                <div className="flex flex-wrap gap-1">
                  {teacher.classes?.map(clsId => {
                    const c = classes.find(item => item.id === clsId);
                    return (
                      <span key={clsId} className="px-2 py-0.5 bg-work-100 text-work-800 rounded font-semibold text-[11px]">
                        {c ? c.name : clsId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajout Enseignant */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-work-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-work-200 space-y-4">
            <div className="flex items-center justify-between border-b border-work-200 pb-3">
              <h3 className="font-extrabold text-lg text-work-900">Nouveau Professeur</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-work-400 hover:text-work-900 font-bold">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-work-800">Nom complet du professeur *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Prof. Amadou Diallo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-work-800">Adresse Email</label>
                  <input
                    type="email"
                    required
                    placeholder="email@edumaster.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-work-800">Téléphone</label>
                  <input
                    type="text"
                    placeholder="+225 07 00 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-work-800">Spécialité / Matière principale</label>
                <input
                  type="text"
                  placeholder="ex: Mathématiques & Physique"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none font-semibold"
                />
              </div>

              {/* Sélection des classes */}
              <div className="space-y-1">
                <label className="font-bold text-work-800 block">Affecter aux classes :</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {classes.map(c => {
                    const isSelected = formData.selectedClasses.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleClass(c.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-smooth ${
                          isSelected
                            ? 'bg-success-600 text-white border-success-600'
                            : 'bg-work-50 text-work-700 border-work-200 hover:bg-work-100'
                        }`}
                      >
                        {c.name} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-work-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-work-100 text-work-700 rounded-xl font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name.trim() || !formData.email.trim()}
                  className="px-4 py-2 bg-success-600 text-white rounded-xl font-bold hover:bg-success-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Créer l'enseignant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
