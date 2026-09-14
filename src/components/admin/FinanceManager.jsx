import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Banknote, Plus, Search, CheckCircle2, CreditCard, Smartphone,
  ArrowDownRight, ShieldCheck, Wallet, Printer, FileText, X, AlertCircle, Loader2, Sparkles, School
} from 'lucide-react';

export const FinanceManager = () => {
  const { students, payments, recordPayment, schoolInfo, classes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Selected payment for viewing / printing receipt
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState(null);

  // Form state pour paiement
  const [paymentForm, setPaymentForm] = useState({
    studentId: students[0]?.id || '',
    amount: 150000,
    method: 'Mobile Money (Wave)',
    reference: `REF-${Math.floor(100000 + Math.random() * 900000)}`
  });

  const handleOpenAddPayment = () => {
    setErrorMsg('');
    const firstStudent = students[0];
    setPaymentForm({
      studentId: firstStudent?.id || '',
      amount: 150000,
      method: 'Mobile Money (Wave)',
      reference: `REF-${Math.floor(100000 + Math.random() * 900000)}`
    });
    setIsModalOpen(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    const studentObj = students.find(s => s.id === paymentForm.studentId);
    if (!studentObj) {
      setErrorMsg('Veuillez sélectionner un élève valide.');
      return;
    }

    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      setErrorMsg('Le montant doit être supérieur à 0.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await recordPayment({
      student_id: studentObj.id,
      student_name: studentObj.name,
      matricule: studentObj.matricule,
      amount: Number(paymentForm.amount),
      method: paymentForm.method,
      reference: paymentForm.reference.trim()
    });

    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setIsModalOpen(false);
      // Automatically show the newly generated receipt
      if (res?.data) {
        setSelectedReceiptPayment(res.data);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredPayments = payments.filter(p => {
    const sName = p.studentName || p.student_name || '';
    const mat = p.matricule || '';
    const ref = p.reference || '';
    const term = searchTerm.toLowerCase();
    return sName.toLowerCase().includes(term) || mat.toLowerCase().includes(term) || ref.toLowerCase().includes(term);
  });

  // Calculate receipt student financial details
  const getReceiptDetails = (payment) => {
    if (!payment) return null;

    const studentId = payment.studentId || payment.student_id;
    const student = students.find(s => s.id === studentId) || {
      name: payment.studentName || payment.student_name,
      matricule: payment.matricule,
      tuitionTotal: 450000,
      tuitionPaid: payment.amount,
    };

    const tuitionTotal = Number(student.tuitionTotal || student.tuition_total) || 450000;
    const currentPaid = Number(student.tuitionPaid || student.tuition_paid) || Number(payment.amount);
    const amountPaidThisReceipt = Number(payment.amount) || 0;

    // Previous paid amount before this payment
    const previousPaid = Math.max(0, currentPaid - amountPaidThisReceipt);
    const balanceRemaining = Math.max(0, tuitionTotal - currentPaid);

    // Class name lookup
    const clsId = student.classId || student.class_id;
    const clsObj = classes.find(c => c.id === clsId);
    const className = clsObj ? clsObj.name : (student.classes?.name || student.className || 'N/A');

    return {
      student,
      className,
      tuitionTotal,
      previousPaid,
      amountPaidThisReceipt,
      currentPaid,
      balanceRemaining
    };
  };

  const receiptData = selectedReceiptPayment ? getReceiptDetails(selectedReceiptPayment) : null;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-work-200 shadow-sm no-print">
        <div>
          <h2 className="text-xl font-extrabold text-work-900">Suivi des Paiements & Scolarités</h2>
          <p className="text-xs text-work-500">Enregistrement des règlements et génération automatique des reçus</p>
        </div>

        <button
          onClick={handleOpenAddPayment}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-smooth shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer un Règlement</span>
        </button>
      </div>

      {/* Note V2 Mobile Money */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3 text-xs no-print">
        <div className="p-2 bg-emerald-600 text-white rounded-xl">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-extrabold text-emerald-900">Module de Caisse & Reçus Instantanés</h4>
          <p className="text-emerald-700 mt-0.5">
            Chaque paiement encaisse génère automatiquement un **Reçu de Caisse Officiel** imprimable affichant le montant versé et le solde restant.
          </p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-work-200 shadow-sm overflow-hidden space-y-4 p-5 no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <h3 className="font-bold text-work-900 text-base">Historique des Règlements Enregistrés</h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-work-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par élève, référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-work-50 border border-work-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-work-400 text-xs font-medium">
            Aucun règlement enregistré.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-work-700">
              <thead className="bg-work-50 text-work-900 font-bold uppercase tracking-wider text-[11px] border-b border-work-200">
                <tr>
                  <th className="py-3 px-4">Élève / Matricule</th>
                  <th className="py-3 px-4">Montant Versé</th>
                  <th className="py-3 px-4">Mode de Règlement</th>
                  <th className="py-3 px-4">Référence</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Action Reçu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-work-100">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-work-50/80 transition-smooth">
                    <td className="py-3 px-4 font-semibold text-work-900">
                      <div>{pay.studentName || pay.student_name}</div>
                      <div className="text-[10px] text-work-400 font-mono">{pay.matricule}</div>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-emerald-600 text-sm">
                      +{(Number(pay.amount) || 0).toLocaleString('fr-FR')} {schoolInfo.currency || 'FCFA'}
                    </td>
                    <td className="py-3 px-4 font-medium text-work-800">
                      <span className="px-2.5 py-1 bg-work-100 border border-work-200 rounded-lg text-[11px] font-semibold">
                        {pay.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-work-600">
                      {pay.reference}
                    </td>
                    <td className="py-3 px-4 text-work-500">
                      <div>{pay.date || (pay.created_at ? pay.created_at.split('T')[0] : '')}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> {pay.status || 'Confirmé'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceiptPayment(pay)}
                        className="bg-work-900 hover:bg-work-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-smooth inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Voir Reçu</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Saisie Manuel de Règlement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-work-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-work-200 space-y-4">
            <div className="flex items-center justify-between border-b border-work-200 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-work-900 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span>Enregistrer un Règlement</span>
                </h3>
                <p className="text-xs text-work-500">Encaissement et génération automatique du reçu</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-work-400 font-bold hover:text-work-900">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-work-800">Sélectionner l'Élève *</label>
                <select
                  value={paymentForm.studentId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, studentId: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none font-semibold text-work-900 bg-white"
                >
                  {students.map(s => {
                    const total = Number(s.tuitionTotal || s.tuition_total) || 450000;
                    const paid = Number(s.tuitionPaid || s.tuition_paid) || 0;
                    const rest = Math.max(0, total - paid);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.matricule}) — Reste à payer: {rest.toLocaleString('fr-FR')} FCFA
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-work-800">Montant encaisse (FCFA) *</label>
                <input
                  type="number"
                  required
                  step="5000"
                  min="1000"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none font-extrabold text-work-900 text-base"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-work-800">Moyen de Règlement *</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none font-semibold bg-white"
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
                <label className="font-bold text-work-800">Numéro de Réf / N° Reçu *</label>
                <input
                  type="text"
                  required
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  className="w-full p-2.5 border border-work-200 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-work-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-work-100 text-work-700 rounded-xl font-semibold hover:bg-work-200 transition-smooth"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-smooth disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Valider le Paiement & Générer Reçu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Official Printable Receipt Display */}
      {selectedReceiptPayment && receiptData && (
        <div className="fixed inset-0 z-50 bg-work-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-work-200 space-y-6 relative my-auto">

            {/* Print & Close Controls (hidden when printing) */}
            <div className="flex items-center justify-between border-b border-work-200 pb-4 no-print">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-work-900">Reçu Officiel de Règlement</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-smooth flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer / Télécharger PDF</span>
                </button>
                <button
                  onClick={() => setSelectedReceiptPayment(null)}
                  className="text-work-400 hover:text-work-900 p-2 rounded-xl font-bold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE RECEIPT CARD CONTENT */}
            <div className="printable-receipt space-y-6 bg-white p-2">

              {/* Receipt Header Banner */}
              <div className="flex items-start justify-between border-b border-work-200 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-work-900 text-white font-extrabold text-2xl flex items-center justify-center border border-work-800 shadow-md">
                    <span>E</span><span className="text-emerald-400">M</span>
                  </div>
                  <div>
                    <h2 className="font-black text-xl text-work-900 tracking-tight">{schoolInfo.name}</h2>
                    <p className="text-xs text-work-500 font-medium">{schoolInfo.subtitle}</p>
                    <p className="text-[11px] text-work-400 mt-0.5">{schoolInfo.address} • Tél: {schoolInfo.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block bg-emerald-100 text-emerald-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-300">
                    Reçu de Caisse
                  </div>
                  <div className="font-mono text-xs font-bold text-work-900 mt-2">
                    N° : {selectedReceiptPayment.reference}
                  </div>
                  <div className="text-[11px] text-work-500 font-medium mt-0.5">
                    Date : {selectedReceiptPayment.date || new Date().toISOString().split('T')[0]}
                  </div>
                </div>
              </div>

              {/* Student & Class Details Box */}
              <div className="bg-work-50 rounded-2xl p-4 border border-work-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[11px] text-work-400 uppercase font-bold tracking-wider block">Nom & Prénom de l'Élève</span>
                  <span className="font-extrabold text-work-900 text-sm mt-0.5 block">{receiptData.student.name}</span>
                  <span className="font-mono text-[11px] text-work-500">Matricule : {receiptData.student.matricule}</span>
                </div>
                <div>
                  <span className="text-[11px] text-work-400 uppercase font-bold tracking-wider block">Classe & Parent</span>
                  <span className="font-bold text-work-900 text-xs mt-0.5 block">Classe : {receiptData.className}</span>
                  <span className="text-work-600 text-[11px]">Parent : {receiptData.student.parentName || receiptData.student.parent_name || 'Tuteur Légal'}</span>
                </div>
              </div>

              {/* Financial Settlement Table */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-work-900 text-xs uppercase tracking-wider border-b border-work-200 pb-1">
                  Détail de la Transaction Financière
                </h4>

                <div className="border border-work-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-work-100">
                      <tr>
                        <td className="py-2.5 px-4 text-work-600 font-medium">Scolarité totale due ({schoolInfo.academicYear}) :</td>
                        <td className="py-2.5 px-4 font-bold text-work-900 text-right">
                          {receiptData.tuitionTotal.toLocaleString('fr-FR')} FCFA
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-work-600 font-medium">Montant réglé avant ce versement :</td>
                        <td className="py-2.5 px-4 font-semibold text-work-700 text-right">
                          {receiptData.previousPaid.toLocaleString('fr-FR')} FCFA
                        </td>
                      </tr>
                      <tr className="bg-emerald-50/80">
                        <td className="py-3 px-4 font-black text-emerald-900 text-sm">
                          VERSEMENT EFFECTUÉ CE JOUR :
                        </td>
                        <td className="py-3 px-4 font-black text-emerald-700 text-base text-right">
                          +{receiptData.amountPaidThisReceipt.toLocaleString('fr-FR')} FCFA
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-work-800 font-bold">Total cumulé payé à ce jour :</td>
                        <td className="py-2.5 px-4 font-extrabold text-work-900 text-right">
                          {receiptData.currentPaid.toLocaleString('fr-FR')} FCFA
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Balance Summary Box */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
                receiptData.balanceRemaining === 0
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div>
                  <span className="font-extrabold text-sm block">
                    {receiptData.balanceRemaining === 0 ? '🎉 SCOLARITÉ ENTIÈREMENT SOLDÉE' : 'RESTE À PAYER (SOLDE RESTANT) :'}
                  </span>
                  <span className="text-[11px] font-medium opacity-85">
                    Mode de règlement : <strong className="font-bold">{selectedReceiptPayment.method}</strong>
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-black ${
                    receiptData.balanceRemaining === 0 ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {receiptData.balanceRemaining.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Signatures & Stamp area */}
              <div className="pt-6 flex items-center justify-between text-[11px] text-work-500 border-t border-work-200">
                <div className="space-y-8">
                  <p className="font-bold text-work-800">Signature du Parent / Payeur :</p>
                  <div className="h-6"></div>
                </div>
                <div className="text-right space-y-8">
                  <p className="font-bold text-work-800">Cachet & Signature de la Caisse :</p>
                  <div className="font-extrabold text-work-900 italic">Groupe Scolaire Excellence</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
