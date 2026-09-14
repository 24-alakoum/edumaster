import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, FileSpreadsheet, Trash2, Edit, Filter, UserCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const StudentsManager = ({ onOpenExcelModal }) => {
  const { students, classes, addStudent, updateStudent, deleteStudent, schoolInfo } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    gender: 'M',
    dateOfBirth: '',
    classId: 'cls-3a',
    parentName: '',
    parentPhone: '',
    tuitionTotal: 450000
  });

  // Filtrage des élèves
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (student.parentName && student.parentName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass = selectedClass === 'ALL' || student.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setErrorMsg('');
    setFormData({
      name: '',
      gender: 'M',
      dateOfBirth: '2010-01-01',
      classId: classes[0]?.id || '',
      parentName: '',
      parentPhone: '',
      tuitionTotal: 450000
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setErrorMsg('');
    setFormData({
      name: student.name,
      gender: student.gender || 'M',
      dateOfBirth: student.dateOfBirth || student.date_of_birth || '',
      classId: student.classId || student.class_id || classes[0]?.id || '',
      parentName: student.parentName || student.parent_name || '',
      parentPhone: student.parentPhone || student.parent_phone || '',
      tuitionTotal: student.tuitionTotal || student.tuition_total || 450000
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    let res;
    if (editingStudent) {
      res = await updateStudent(editingStudent.id, {
        name: formData.name,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth,
        class_id: formData.classId,
        parent_name: formData.parentName,
        parent_phone: formData.parentPhone,
        tuition_total: Number(formData.tuitionTotal)
      });
    } else {
      res = await addStudent({
        name: formData.name,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth,
        class_id: formData.classId,
        parent_name: formData.parentName,
        parent_phone: formData.parentPhone,
        tuition_total: Number(formData.tuitionTotal)
      });
    }

    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-work-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-work-900">Gestion des Élèves ({students.length})</h2>
          <p className="text-xs text-work-500">Inscriptions, dossiers d'élèves et affectation aux classes</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenExcelModal}
            className="flex-1 sm:flex-none bg-work-100 hover:bg-work-200 text-work-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-work-300 transition-smooth flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-success-600" />
            <span>Import / Export Excel</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-none bg-success-600 hover:bg-success-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-smooth shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Inscrire un Élève</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-work-200 shadow-sm text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-work-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-work-50 border border-work-200 rounded-xl focus:outline-none focus:border-success-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-work-400" />
          <span className="text-work-600 font-medium hidden sm:inline">Classe :</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-work-50 border border-work-200 rounded-xl focus:outline-none focus:border-success-500 font-semibold text-work-800"
          >
            <option value="ALL">Toutes les classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-work-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-work-700">
            <thead className="bg-work-50 text-work-900 font-bold uppercase tracking-wider text-[11px] border-b border-work-200">
              <tr>
                <th className="py-3.5 px-4">Matricule / Nom</th>
                <th className="py-3.5 px-4">Classe</th>
                <th className="py-3.5 px-4">Parent / Contact</th>
                <th className="py-3.5 px-4">Scolarité</th>
                <th className="py-3.5 px-4">Statut Paiement</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-work-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-work-400">
                    Aucun élève trouvé.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const paid = student.tuitionPaid || 0;
                  const total = student.tuitionTotal || 450000;
                  const remaining = total - paid;

                  return (
                    <tr key={student.id} className="hover:bg-work-50/80 transition-smooth">
                      <td className="py-3.5 px-4 font-semibold text-work-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-work-100 font-bold text-work-800 flex items-center justify-center text-xs">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold">{student.name}</div>
                            <div className="text-[10px] text-work-400 font-mono">{student.matricule}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-work-800">
                        <span className="inline-block px-2.5 py-1 bg-work-100 border border-work-200 rounded-lg text-work-800 font-bold">
                          {student.className}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-work-900">{student.parentName || 'N/A'}</div>
                        <div className="text-[11px] text-work-500">{student.parentPhone || '—'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        <div><span className="font-bold text-work-900">{paid.toLocaleString('fr-FR')}</span> / {total.toLocaleString('fr-FR')} FCFA</div>
                        {remaining > 0 ? (
                          <span className="text-[10px] text-amber-600 font-semibold">Reste: {remaining.toLocaleString('fr-FR')} FCFA</span>
                        ) : (
                          <span className="text-[10px] text-success-600 font-semibold">Totalement Réglé</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {student.tuitionStatus === 'solde' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-success-50 text-success-700 border border-success-200 rounded-full font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> Soldé
                          </span>
                        ) : student.tuitionStatus === 'partiel' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold text-[10px]">
                            <AlertCircle className="w-3 h-3" /> Partiel
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-bold text-[10px]">
                            <AlertCircle className="w-3 h-3" /> En Retard
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(student)}
                            className="p-1.5 hover:bg-work-100 text-work-600 hover:text-work-900 rounded-lg transition-smooth"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteStudent(student.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-smooth"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Inscription / Édition Élève */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-work-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-work-200 space-y-4">
            <div className="flex items-center justify-between border-b border-work-200 pb-3">
              <h3 className="font-extrabold text-lg text-work-900">
                {editingStudent ? "Modifier la fiche de l'élève" : "Inscrire un nouvel élève"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-work-400 hover:text-work-900 font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-work-800">Nom complet de l'élève *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Cheick Diallo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-work-800">Sexe</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none font-semibold"
                  >
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-work-800">Classe d'affectation *</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none font-semibold"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-work-800">Nom du Parent / Tuteur</label>
                  <input
                    type="text"
                    placeholder="ex: Mme Fatou Sow"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-work-800">Téléphone du Parent</label>
                  <input
                    type="text"
                    placeholder="ex: +225 05 44 33 22 11"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-work-800">Montant total de la scolarité (FCFA)</label>
                <input
                  type="number"
                  required
                  value={formData.tuitionTotal}
                  onChange={(e) => setFormData({ ...formData, tuitionTotal: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none font-semibold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-work-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-work-100 text-work-700 rounded-xl font-semibold hover:bg-work-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name.trim()}
                  className="px-4 py-2 bg-success-600 text-white rounded-xl font-bold hover:bg-success-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingStudent ? "Enregistrer les modifications" : "Inscrire l'élève"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
