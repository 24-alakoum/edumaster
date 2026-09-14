import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, Download, Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

export const ExcelImportExportModal = ({ isOpen, onClose }) => {
  const { students, importStudents } = useApp();
  const [importedData, setImportedData] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Exportation Excel de la liste des élèves
  const handleExportExcel = () => {
    const exportFormat = students.map(s => ({
      "Matricule": s.matricule,
      "Nom complet": s.name,
      "Sexe": s.gender,
      "Date Naissance": s.dateOfBirth,
      "Classe": s.className,
      "Parent / Tuteur": s.parentName || 'N/A',
      "Téléphone Parent": s.parentPhone || 'N/A',
      "Scolarité Totale (FCFA)": s.tuitionTotal || 450000,
      "Scolarité Payée (FCFA)": s.tuitionPaid || 0,
      "Statut Paiement": s.tuitionStatus
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportFormat);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Élèves Edumaster");
    XLSX.writeFile(workbook, `Edumaster_Liste_Eleves_${new Date().toISOString().split('T')[0]}.xlsx`);
    setSuccessMsg('Fichier Excel exporté avec succès !');
  };

  // Importation de fichier Excel / CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      setImportedData(json);
      setSuccessMsg(`${json.length} lignes analysées avec succès.`);
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = () => {
    if (importedData.length === 0) return;

    const formatted = importedData.map(item => ({
      matricule: item["Matricule"] || item.matricule,
      name: item["Nom complet"] || item.nom || item.name,
      gender: item["Sexe"] || item.gender || "M",
      dateOfBirth: item["Date Naissance"] || item.date_naissance || "2010-01-01",
      className: item["Classe"] || item.classe || "3ème A",
      parentName: item["Parent / Tuteur"] || item.parent || "Tuteur",
      parentPhone: item["Téléphone Parent"] || item.phone || "+225 00 00 00 00",
      tuitionTotal: Number(item["Scolarité Totale (FCFA)"] || item.tuitionTotal || 450000),
      tuitionPaid: Number(item["Scolarité Payée (FCFA)"] || item.tuitionPaid || 0)
    }));

    importStudents(formatted);
    setSuccessMsg(`${formatted.length} élèves importés dans la base de données !`);
    setTimeout(() => {
      setImportedData([]);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-work-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-work-200 space-y-5 text-xs">
        <div className="flex items-center justify-between border-b border-work-200 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-success-600" />
            <h3 className="font-extrabold text-lg text-work-900">Import / Export Fichiers Excel (XLSX)</h3>
          </div>
          <button onClick={onClose} className="text-work-400 font-bold hover:text-work-900">✕</button>
        </div>

        {successMsg && (
          <div className="bg-success-50 text-success-700 p-3 rounded-xl border border-success-200 flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 1 : Exportation Excel */}
          <div className="bg-work-50 p-4 rounded-xl border border-work-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="font-extrabold text-work-900 text-sm flex items-center gap-1.5">
                <Download className="w-4 h-4 text-work-700" />
                <span>Exporter vers Excel</span>
              </h4>
              <p className="text-work-500 text-[11px]">
                Générez un tableau `.xlsx` contenant les fiches des {students.length} élèves et leurs soldes.
              </p>
            </div>

            <button
              onClick={handleExportExcel}
              className="w-full bg-work-900 hover:bg-work-800 text-white font-bold py-2.5 px-3 rounded-xl transition-smooth shadow-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger .XLSX</span>
            </button>
          </div>

          {/* Section 2 : Importation Excel */}
          <div className="bg-work-50 p-4 rounded-xl border border-work-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="font-extrabold text-work-900 text-sm flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-success-600" />
                <span>Importer un fichier</span>
              </h4>
              <p className="text-work-500 text-[11px]">
                Sélectionnez un fichier `.xlsx` ou `.csv` d'effectifs pour les injecter dans le système.
              </p>
            </div>

            <label className="w-full bg-success-600 hover:bg-success-700 text-white font-bold py-2.5 px-3 rounded-xl cursor-pointer transition-smooth shadow-sm flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Parcourir les fichiers</span>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Aperçu des données importées */}
        {importedData.length > 0 && (
          <div className="space-y-3 border-t border-work-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-work-900">
                Aperçu des données prêtes à être importées ({importedData.length} lignes) :
              </span>
              <button
                onClick={handleConfirmImport}
                className="bg-success-600 hover:bg-success-700 text-white font-bold px-4 py-1.5 rounded-lg shadow-sm"
              >
                Confirmer l'importation
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto border border-work-200 rounded-xl bg-white p-2">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-work-100 font-bold">
                  <tr>
                    <th className="p-1">Nom</th>
                    <th className="p-1">Classe</th>
                    <th className="p-1">Parent</th>
                  </tr>
                </thead>
                <tbody>
                  {importedData.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="border-b border-work-100">
                      <td className="p-1 font-semibold">{row["Nom complet"] || row.nom || row.name}</td>
                      <td className="p-1">{row["Classe"] || row.classe || row.className}</td>
                      <td className="p-1">{row["Parent / Tuteur"] || row.parent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
