import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Banknote, Plus, Search, CheckCircle2, CreditCard, Smartphone, ArrowDownRight, ShieldCheck, Wallet } from 'lucide-react';

export const FinanceManager = () => {
  const { students, payments, recordPayment, schoolInfo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state pour paiement
  const [paymentForm, setPaymentForm] = useState({
    studentId: students[0]?.id || '',
    amount: 150000,
    method: 'Mobile Money (Wave)',
    reference: `REF-${Math.floor(100000 + Math.random() * 900000)}`
  });

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const studentObj = students.find(s => s.id === paymentForm.studentId);
    if (!studentObj) return;

    recordPayment({
      studentId: studentObj.id,
      studentName: studentObj.name,
      matricule: studentObj.matricule,
      amount: Number(paymentForm.amount),
      method: paymentForm.method,
      reference: paymentForm.reference
    });

    setIsModalOpen(false);
  };

  const filteredPayments = payments.filter(p =>
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-work-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-work-900">Suivi des Paiements & Scolarités</h2>
          <p className="text-xs text-work-500">Enregistrement manuel des paiements reçus et historique financier</p>
        </div>

        <button
          onClick={() => {
            setPaymentForm(prev => ({
              ...prev,
              studentId: students[0]?.id || '',
              reference: `REF-${Math.floor(100000 + Math.random() * 900000)}`
            }));
            setIsModalOpen(true);
          }}
          className="bg-success-600 hover:bg-success-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-smooth shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer un Règlement</span>
        </button>
      </div>

      {/* Note V2 Mobile Money */}
      <div className="bg-success-50 border border-success-200 p-4 rounded-2xl flex items-start gap-3 text-xs">
        <div className="p-2 bg-success-600 text-white rounded-xl">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-extrabold text-success-900">Anticipation V2 — Passerelle Mobile Money Afrique de l'Ouest</h4>
          <p className="text-success-700 mt-0.5">
            L'architecture de la table des paiements intègre déjà les références de transactions externes (`external_reference`), les méthodes numériques (`Orange Money`, `Wave`, `MTN MoMo`) et les statuts de paiement en ligne direct.
          </p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-work-200 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <h3 className="font-bold text-work-900 text-base">Historique des Règlements Enregistrés</h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-work-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par élève, référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-work-50 border border-work-200 rounded-xl focus:outline-none focus:border-success-500 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-work-700">
            <thead className="bg-work-50 text-work-900 font-bold uppercase tracking-wider text-[11px] border-b border-work-200">
              <tr>
                <th className="py-3 px-4">Élève / Matricule</th>
                <th className="py-3 px-4">Montant Versé</th>
                <th className="py-3 px-4">Mode de Règlement</th>
                <th className="py-3 px-4">Référence Transaction</th>
                <th className="py-3 px-4">Date & Agent</th>
                <th className="py-3 px-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-work-100">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-work-50/80 transition-smooth">
                  <td className="py-3 px-4 font-semibold text-work-900">
                    <div>{pay.studentName}</div>
                    <div className="text-[10px] text-work-400 font-mono">{pay.matricule}</div>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-success-600">
                    +{pay.amount.toLocaleString('fr-FR')} {schoolInfo.currency}
                  </td>
                  <td className="py-3 px-4 font-medium text-work-800">
                    <span className="px-2 py-1 bg-work-100 border border-work-200 rounded-lg text-[11px]">
                      {pay.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-work-600">
                    {pay.reference}
                  </td>
                  <td className="py-3 px-4 text-work-500">
                    <div>{pay.date}</div>
                    <div className="text-[10px] text-work-400">Saisi par : {pay.recordedBy}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-success-50 text-success-700 border border-success-200 rounded-full font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Saisie Manuel de Règlement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-work-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-work-200 space-y-4">
            <div className="flex items-center justify-between border-b border-work-200 pb-3">
              <h3 className="font-extrabold text-lg text-work-900">Enregistrer un Règlement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-work-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-work-800">Sélectionner l'Élève *</label>
                <select
                  value={paymentForm.studentId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, studentId: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none font-semibold text-work-900"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className}) — Reste: {((s.tuitionTotal || 450000) - (s.tuitionPaid || 0)).toLocaleString('fr-FR')} FCFA
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-work-800">Montant encaisse (FCFA) *</label>
                <input
                  type="number"
                  required
                  step="5000"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none font-extrabold text-work-900 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-work-800">Moyen de Règlement *</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none font-semibold"
                >
                  <option value="Mobile Money (Wave)">Mobile Money (Wave)</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="MTN MoMo">MTN MoMo</option>
                  <option value="Espèces (Caisse)">Espèces (Caisse)</option>
                  <option value="Virement Bancaire">Virement Bancaire</option>
                  <option value="Chèque">Chèque Bancaire</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-work-800">Numéro de Réf / Reçu</label>
                <input
                  type="text"
                  required
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-success-500 focus:outline-none font-mono"
                />
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
                  className="px-4 py-2 bg-success-600 text-white rounded-xl font-bold hover:bg-success-700"
                >
                  Valider le Paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
