import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, GraduationCap, Banknote, CheckCircle2, AlertCircle, Smartphone, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';

export const ParentView = () => {
  const {
    calculateStudentAverage,
    recordPayment,
    currentUser,
    getParentChildren,
    getScopedGrades
  } = useApp();

  // Les enfants rattachés exclusivement au parent connecté
  const myChildren = getParentChildren();
  const [selectedChildId, setSelectedChildId] = useState(myChildren[0]?.id || 'stu-101');

  const selectedChild = myChildren.find(s => s.id === selectedChildId) || myChildren[0] || {
    id: 'stu-101',
    name: 'Cheick Diallo',
    className: '3ème A',
    matricule: 'EDU-2025-089',
    tuitionTotal: 450000,
    tuitionPaid: 300000
  };

  const scopedGrades = getScopedGrades();
  const childGrades = scopedGrades.filter(g => g.studentId === selectedChild.id);
  const childAverage = calculateStudentAverage(selectedChild.id, 'Trimestre 1');

  const [paymentAmount, setPaymentAmount] = useState(150000);
  const [selectedMethod, setSelectedMethod] = useState('Wave');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const totalTuition = selectedChild.tuitionTotal || 450000;
  const paidTuition = selectedChild.tuitionPaid || 0;
  const remainingTuition = totalTuition - paidTuition;

  // Simulation d'un paiement en ligne direct (V2 Mobile Money Preview)
  const handleSimulateOnlinePayment = (e) => {
    e.preventDefault();
    recordPayment({
      studentId: selectedChild.id,
      studentName: selectedChild.name,
      matricule: selectedChild.matricule,
      amount: Number(paymentAmount),
      method: `Paiement en Ligne (${selectedMethod})`,
      reference: `${selectedMethod.toUpperCase()}-ONLINE-${Math.floor(100000 + Math.random() * 900000)}`
    });

    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Parent */}
      <div className="bg-work-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Espace Parent d'Élève</h2>
            <span className="bg-success-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {currentUser.name}
            </span>
          </div>
          <p className="text-work-300 text-xs mt-1">
            Accès sécurisé : Suivi de vos {myChildren.length} enfant(s) inscrit(s).
          </p>
        </div>

        {/* Child Selector Pills */}
        <div className="flex items-center gap-2 bg-work-800 p-1.5 rounded-xl border border-work-700">
          <span className="text-xs text-work-400 font-semibold px-2 hidden sm:inline">Mes Enfants :</span>
          {myChildren.map(child => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-smooth flex items-center gap-1.5 ${
                child.id === selectedChildId
                  ? 'bg-success-600 text-white shadow-sm'
                  : 'text-work-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{child.name} ({child.className})</span>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Enfants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 : Moyenne Générale */}
        <div className="bg-white p-5 rounded-2xl border border-work-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-work-500 uppercase tracking-wider">Moyenne Générale</span>
            <div className="p-2 bg-success-50 text-success-700 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-work-900">{childAverage.average}</span>
            <span className="text-xs font-semibold text-work-500">/ 20</span>
          </div>
          <p className="text-xs text-success-600 font-semibold">
            {childAverage.average >= 14 ? "Élève Très Satisfaisant (Tableau d'Honneur)" : "Bon niveau académique"}
          </p>
        </div>

        {/* Card 2 : État Financier */}
        <div className="bg-white p-5 rounded-2xl border border-work-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-work-500 uppercase tracking-wider">Scolarité Versée</span>
            <div className="p-2 bg-work-100 text-work-900 rounded-xl">
              <Banknote className="w-5 h-5 text-success-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-work-900">{paidTuition.toLocaleString('fr-FR')}</span>
            <span className="text-xs font-semibold text-work-500">/ {totalTuition.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="text-xs font-semibold">
            {remainingTuition === 0 ? (
              <span className="text-success-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Scolarité entièrement soldée
              </span>
            ) : (
              <span className="text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Solde restant : {remainingTuition.toLocaleString('fr-FR')} FCFA
              </span>
            )}
          </div>
        </div>

        {/* Card 3 : Classe & Matricule */}
        <div className="bg-white p-5 rounded-2xl border border-work-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-work-500 uppercase tracking-wider">Fiche Élève</span>
            <div className="p-2 bg-work-100 text-work-900 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-lg text-work-900">{selectedChild.name}</div>
          <div className="text-xs text-work-500 flex items-center justify-between">
            <span>Matricule: <strong className="text-work-800">{selectedChild.matricule}</strong></span>
            <span className="px-2 py-0.5 bg-work-100 font-bold text-work-800 rounded">{selectedChild.className}</span>
          </div>
        </div>
      </div>

      {/* Main Grid : Relevé de Notes & Formulaire de Paiement en Ligne (Mobile Money) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Relevé des Notes du Trimestre */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-work-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-work-200 pb-3">
            <div>
              <h3 className="text-lg font-extrabold text-work-900">Relevé des Notes du Trimestre 1</h3>
              <p className="text-xs text-work-500">Évaluations transmises par l'école pour {selectedChild.name}</p>
            </div>
            <span className="text-xs font-bold text-success-700 bg-success-50 border border-success-200 px-3 py-1 rounded-full">
              {childGrades.length} évaluation(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-work-700">
              <thead className="bg-work-50 text-work-900 font-bold uppercase tracking-wider text-[11px] border-b border-work-200">
                <tr>
                  <th className="py-3 px-4">Matière</th>
                  <th className="py-3 px-4">Évaluation</th>
                  <th className="py-3 px-4 text-center">Note (/20)</th>
                  <th className="py-3 px-4">Observation du Professeur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-work-100">
                {childGrades.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-work-400">
                      Aucune note disponible pour le moment.
                    </td>
                  </tr>
                ) : (
                  childGrades.map((g) => (
                    <tr key={g.id} className="hover:bg-work-50/80 transition-smooth">
                      <td className="py-3 px-4 font-bold text-work-900">{g.subjectName}</td>
                      <td className="py-3 px-4 font-medium text-work-700">
                        <div>{g.title}</div>
                        <div className="text-[10px] text-work-400">Coef {g.coef} • {g.date}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg font-extrabold text-xs ${
                          g.score >= 14
                            ? 'bg-success-50 text-success-800 border border-success-200'
                            : g.score >= 10
                            ? 'bg-work-100 text-work-900'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {g.score} / 20
                        </span>
                      </td>
                      <td className="py-3 px-4 italic text-work-600 text-[11px]">{g.comment}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Paiement en ligne (Mobile Money Demo) */}
        <div className="bg-white p-6 rounded-2xl border border-work-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-work-900">
            <Smartphone className="w-5 h-5 text-success-600" />
            <h3 className="text-base font-extrabold">Payer la Scolarité en Ligne</h3>
          </div>

          <p className="text-xs text-work-500">
            Règlement direct pour {selectedChild.name} via Mobile Money.
          </p>

          {paymentSuccess && (
            <div className="bg-success-50 text-success-700 p-3 rounded-xl border border-success-200 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paiement effectué ! Le solde a été mis à jour.</span>
            </div>
          )}

          <form onSubmit={handleSimulateOnlinePayment} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-work-800">Montant à régler (FCFA) :</label>
              <input
                type="number"
                required
                min="5000"
                max={remainingTuition > 0 ? remainingTuition : 450000}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full p-2.5 bg-work-50 border border-work-200 rounded-xl font-extrabold text-work-900 text-sm focus:border-success-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-work-800 block">Opérateur de Paiement :</label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {['Wave', 'Orange Money', 'MTN MoMo', 'Carte VISA'].map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-smooth text-center ${
                      selectedMethod === method
                        ? 'bg-success-600 text-white border-success-600 shadow-sm'
                        : 'bg-work-50 text-work-800 border-work-200 hover:bg-work-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={remainingTuition <= 0}
              className={`w-full font-bold py-3 rounded-xl transition-smooth shadow-md flex items-center justify-center gap-2 ${
                remainingTuition <= 0
                  ? 'bg-work-200 text-work-400 cursor-not-allowed'
                  : 'bg-success-600 hover:bg-success-700 text-white'
              }`}
            >
              <span>Valider {paymentAmount.toLocaleString('fr-FR')} FCFA par {selectedMethod}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
