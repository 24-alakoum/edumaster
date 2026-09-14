// Données de démonstration initiales pour l'écosystème Edumaster

export const INITIAL_SCHOOL_INFO = {
  name: "Lycée d'Excellence Edumaster",
  academicYear: "2025-2026",
  address: "Boulevard de l'Éducation, Cocody, Abidjan",
  phone: "+225 07 00 11 22 33",
  email: "contact@lycee-edumaster.edu",
  currency: "FCFA"
};

export const INITIAL_USERS = [
  {
    id: "user-admin",
    name: "Jean-Baptiste Koffi",
    email: "admin@edumaster.edu",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    title: "Directeur des Études"
  },
  {
    id: "user-teacher-1",
    name: "Prof. Amadou Diallo",
    email: "a.diallo@edumaster.edu",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    title: "Enseignant Principal Mathématiques & Physique"
  },
  {
    id: "user-parent-1",
    name: "Mme Fatou Sow",
    email: "fatou.sow@gmail.com",
    role: "parent",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    phone: "+225 05 44 33 22 11",
    occupation: "Chef d'entreprise",
    childrenIds: ["stu-101", "stu-104"]
  },
  {
    id: "user-student-1",
    name: "Cheick Diallo",
    email: "cheick.d@edumaster.edu",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
    matricule: "EDU-2025-089",
    classId: "cls-3a"
  }
];

export const INITIAL_CLASSES = [
  { id: "cls-6a", name: "6ème A", level: "Collège", mainTeacher: "Mme Aïcha Koné", totalStudents: 32 },
  { id: "cls-5b", name: "5ème B", level: "Collège", mainTeacher: "M. Paul N'Guessan", totalStudents: 28 },
  { id: "cls-3a", name: "3ème A", level: "Collège", mainTeacher: "Prof. Amadou Diallo", totalStudents: 30 },
  { id: "cls-t1", name: "Terminale S1", level: "Lycée", mainTeacher: "Dr. Oumar Diop", totalStudents: 25 }
];

export const INITIAL_SUBJECTS = [
  { id: "sub-math", name: "Mathématiques", code: "MATH", coef: 5, color: "#0F172A" },
  { id: "sub-pc", name: "Physique-Chimie", code: "PC", coef: 4, color: "#0369A1" },
  { id: "sub-fr", name: "Français", code: "FR", coef: 4, color: "#059669" },
  { id: "sub-hg", name: "Histoire-Géographie", code: "HG", coef: 3, color: "#D97706" },
  { id: "sub-svt", name: "Sciences de la Vie et de la Terre", code: "SVT", coef: 3, color: "#16A34A" },
  { id: "sub-ang", name: "Anglais", code: "ANG", coef: 3, color: "#4F46E5" },
  { id: "sub-eps", name: "Éducation Physique & Sportive", code: "EPS", coef: 2, color: "#DC2626" }
];

export const INITIAL_TEACHERS = [
  {
    id: "tch-101",
    userId: "user-teacher-1",
    name: "Prof. Amadou Diallo",
    email: "a.diallo@edumaster.edu",
    phone: "+225 07 11 22 33 44",
    specialty: "Mathématiques & Physique",
    classes: ["cls-3a", "cls-t1"],
    subjects: ["sub-math", "sub-pc"]
  },
  {
    id: "tch-102",
    name: "Mme Aïcha Koné",
    email: "a.kone@edumaster.edu",
    phone: "+225 07 55 66 77 88",
    specialty: "Lettres Modernes / Français",
    classes: ["cls-6a", "cls-3a"],
    subjects: ["sub-fr"]
  },
  {
    id: "tch-103",
    name: "Dr. Oumar Diop",
    email: "o.diop@edumaster.edu",
    phone: "+225 07 88 99 00 11",
    specialty: "Sciences Physiques",
    classes: ["cls-t1"],
    subjects: ["sub-pc", "sub-svt"]
  },
  {
    id: "tch-104",
    name: "M. Paul N'Guessan",
    email: "p.nguessan@edumaster.edu",
    phone: "+225 05 12 34 56 78",
    specialty: "Histoire-Géographie",
    classes: ["cls-5b", "cls-3a"],
    subjects: ["sub-hg"]
  }
];

export const INITIAL_STUDENTS = [
  {
    id: "stu-101",
    userId: "user-student-1",
    matricule: "EDU-2025-089",
    name: "Cheick Diallo",
    gender: "M",
    dateOfBirth: "2010-04-14",
    classId: "cls-3a",
    className: "3ème A",
    parentId: "user-parent-1",
    parentName: "Mme Fatou Sow",
    parentPhone: "+225 05 44 33 22 11",
    tuitionTotal: 450000,
    tuitionPaid: 300000,
    tuitionStatus: "partiel"
  },
  {
    id: "stu-102",
    matricule: "EDU-2025-090",
    name: "Marie-Claire Kouassi",
    gender: "F",
    dateOfBirth: "2010-08-22",
    classId: "cls-3a",
    className: "3ème A",
    parentId: "par-202",
    parentName: "M. Alain Kouassi",
    parentPhone: "+225 07 22 33 44 55",
    tuitionTotal: 450000,
    tuitionPaid: 450000,
    tuitionStatus: "solde"
  },
  {
    id: "stu-103",
    matricule: "EDU-2025-091",
    name: "Ibrahim Traoré",
    gender: "M",
    dateOfBirth: "2010-01-05",
    classId: "cls-3a",
    className: "3ème A",
    parentId: "par-203",
    parentName: "Mme Salimata Traoré",
    parentPhone: "+225 07 66 77 88 99",
    tuitionTotal: 450000,
    tuitionPaid: 150000,
    tuitionStatus: "retard"
  },
  {
    id: "stu-104",
    matricule: "EDU-2025-112",
    name: "Aminata Diallo",
    gender: "F",
    dateOfBirth: "2013-11-19",
    classId: "cls-6a",
    className: "6ème A",
    parentId: "user-parent-1",
    parentName: "Mme Fatou Sow",
    parentPhone: "+225 05 44 33 22 11",
    tuitionTotal: 400000,
    tuitionPaid: 400000,
    tuitionStatus: "solde"
  },
  {
    id: "stu-105",
    matricule: "EDU-2025-144",
    name: "Koffi Emmanuel Bamba",
    gender: "M",
    dateOfBirth: "2007-06-30",
    classId: "cls-t1",
    className: "Terminale S1",
    parentId: "par-205",
    parentName: "M. Serge Bamba",
    parentPhone: "+225 01 02 03 04 05",
    tuitionTotal: 550000,
    tuitionPaid: 350000,
    tuitionStatus: "partiel"
  }
];

export const INITIAL_GRADES = [
  // Notes pour Cheick Diallo (stu-101)
  { id: "grd-1", studentId: "stu-101", subjectId: "sub-math", subjectName: "Mathématiques", coef: 5, score: 16.5, maxScore: 20, period: "Trimestre 1", title: "Devoir de Synthèse N°1", comment: "Excellent travail, raisonnement rigoureux.", date: "2025-10-15", teacherName: "Prof. Amadou Diallo" },
  { id: "grd-2", studentId: "stu-101", subjectId: "sub-math", subjectName: "Mathématiques", coef: 5, score: 18.0, maxScore: 20, period: "Trimestre 1", title: "Interrogation Écrite", comment: "Très maîtrisé.", date: "2025-11-02", teacherName: "Prof. Amadou Diallo" },
  { id: "grd-3", studentId: "stu-101", subjectId: "sub-pc", subjectName: "Physique-Chimie", coef: 4, score: 14.0, maxScore: 20, period: "Trimestre 1", title: "TP Chimie & Lois de Newton", comment: "Bonne compréhension globale.", date: "2025-10-20", teacherName: "Prof. Amadou Diallo" },
  { id: "grd-4", studentId: "stu-101", subjectId: "sub-fr", subjectName: "Français", coef: 4, score: 13.5, maxScore: 20, period: "Trimestre 1", title: "Dissertation Littéraire", comment: "Bon style rédactionnel.", date: "2025-10-28", teacherName: "Mme Aïcha Koné" },
  { id: "grd-5", studentId: "stu-101", subjectId: "sub-hg", subjectName: "Histoire-Géographie", coef: 3, score: 15.0, maxScore: 20, period: "Trimestre 1", title: "Cartographie & Histoire UEMOA", comment: "Rendu propre et précis.", date: "2025-11-10", teacherName: "M. Paul N'Guessan" },
  { id: "grd-6", studentId: "stu-101", subjectId: "sub-ang", subjectName: "Anglais", coef: 3, score: 17.0, maxScore: 20, period: "Trimestre 1", title: "Oral Presentation & Grammar", comment: "Fluent expression.", date: "2025-11-12", teacherName: "Mme Sarah Mensah" },

  // Notes pour Marie-Claire Kouassi (stu-102)
  { id: "grd-7", studentId: "stu-102", subjectId: "sub-math", subjectName: "Mathématiques", coef: 5, score: 14.0, maxScore: 20, period: "Trimestre 1", title: "Devoir de Synthèse N°1", comment: "Bon travail.", date: "2025-10-15", teacherName: "Prof. Amadou Diallo" },
  { id: "grd-8", studentId: "stu-102", subjectId: "sub-pc", subjectName: "Physique-Chimie", coef: 4, score: 15.5, maxScore: 20, period: "Trimestre 1", title: "TP Chimie", comment: "Très appliquée.", date: "2025-10-20", teacherName: "Prof. Amadou Diallo" },

  // Notes pour Ibrahim Traoré (stu-103)
  { id: "grd-9", studentId: "stu-103", subjectId: "sub-math", subjectName: "Mathématiques", coef: 5, score: 9.5, maxScore: 20, period: "Trimestre 1", title: "Devoir de Synthèse N°1", comment: "Doit réviser les équations.", date: "2025-10-15", teacherName: "Prof. Amadou Diallo" }
];

export const INITIAL_SCHEDULES = {
  "cls-3a": [
    { day: "Lundi", time: "08h00 - 10h00", subject: "Mathématiques", room: "Salle 12", teacher: "Prof. Amadou Diallo" },
    { day: "Lundi", time: "10h15 - 12h00", subject: "Français", room: "Salle 12", teacher: "Mme Aïcha Koné" },
    { day: "Lundi", time: "14h00 - 16h00", subject: "Anglais", room: "Labo Langues", teacher: "Mme Sarah Mensah" },
    
    { day: "Mardi", time: "08h00 - 10h00", subject: "Physique-Chimie", room: "Labo Sciences", teacher: "Prof. Amadou Diallo" },
    { day: "Mardi", time: "10h15 - 12h00", subject: "Histoire-Géographie", room: "Salle 12", teacher: "M. Paul N'Guessan" },
    { day: "Mardi", time: "14h00 - 16h00", subject: "SVT", room: "Labo Sciences", teacher: "Dr. Oumar Diop" },

    { day: "Mercredi", time: "08h00 - 10h00", subject: "Mathématiques", room: "Salle 12", teacher: "Prof. Amadou Diallo" },
    { day: "Mercredi", time: "10h15 - 12h00", subject: "EPS", room: "Terrain de Sport", teacher: "M. Jean Traoré" },

    { day: "Jeudi", time: "08h00 - 10h00", subject: "Français", room: "Salle 12", teacher: "Mme Aïcha Koné" },
    { day: "Jeudi", time: "10h15 - 12h00", subject: "Physique-Chimie", room: "Labo Sciences", teacher: "Prof. Amadou Diallo" },
    { day: "Jeudi", time: "14h00 - 16h00", subject: "Histoire-Géographie", room: "Salle 12", teacher: "M. Paul N'Guessan" },

    { day: "Vendredi", time: "08h00 - 10h00", subject: "Mathématiques", room: "Salle 12", teacher: "Prof. Amadou Diallo" },
    { day: "Vendredi", time: "10h15 - 12h00", subject: "Anglais", room: "Labo Langues", teacher: "Mme Sarah Mensah" }
  ]
};

export const INITIAL_PAYMENTS = [
  {
    id: "pay-001",
    studentId: "stu-101",
    studentName: "Cheick Diallo",
    matricule: "EDU-2025-089",
    amount: 150000,
    date: "2025-09-05",
    method: "Mobile Money (Wave)",
    reference: "WAVE-CI-8890123",
    status: "Confirmé",
    recordedBy: "Jean-Baptiste Koffi"
  },
  {
    id: "pay-002",
    studentId: "stu-101",
    studentName: "Cheick Diallo",
    matricule: "EDU-2025-089",
    amount: 150000,
    date: "2025-11-10",
    method: "Orange Money",
    reference: "OM-CI-7734120",
    status: "Confirmé",
    recordedBy: "Jean-Baptiste Koffi"
  },
  {
    id: "pay-003",
    studentId: "stu-102",
    studentName: "Marie-Claire Kouassi",
    matricule: "EDU-2025-090",
    amount: 450000,
    date: "2025-09-01",
    method: "Virement Bancaire",
    reference: "VIR-NSIA-0091",
    status: "Confirmé",
    recordedBy: "Jean-Baptiste Koffi"
  },
  {
    id: "pay-004",
    studentId: "stu-103",
    studentName: "Ibrahim Traoré",
    matricule: "EDU-2025-091",
    amount: 150000,
    date: "2025-09-12",
    method: "Espèces (Caisse)",
    reference: "REC-2025-042",
    status: "Confirmé",
    recordedBy: "Jean-Baptiste Koffi"
  }
];
