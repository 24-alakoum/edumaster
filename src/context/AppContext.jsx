import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  supabase,
  fetchProfile,
  fetchAllStudents,
  fetchAllTeachers,
  fetchAllClasses,
  fetchAllSubjects,
  fetchAllGrades,
  fetchAllPayments,
  fetchAllSchedules,
  insertSchedule,
  deleteScheduleDb,
  fetchParentByProfileId,
  fetchParentChildren,
  fetchStudentByProfileId,
  fetchGradesByStudent,
  fetchGradesByStudentIds,
  fetchPaymentsByStudentIds,
  insertStudent,
  updateStudentDb,
  deleteStudentDb,
  insertTeacher,
  updateTeacherDb,
  deleteTeacherDb,
  insertClass,
  deleteClassDb,
  fetchAllAcademicYears,
  insertAcademicYear,
  insertGrade,
  deleteGradeDb,
  insertPayment,
  insertParent,
  linkParentToStudent,
  upsertProfile,
} from '../lib/supabase';

const AppContext = createContext();

const SCHOOL_INFO = {
  name: 'Groupe Scolaire Excellence',
  subtitle: "Établissement Privé d'Enseignement Général",
  address: "Abidjan, Côte d'Ivoire",
  phone: '+225 07 00 00 00',
  email: 'contact@excellence-ci.edu',
  academicYear: '2025-2026',
};

export const AppProvider = ({ children }) => {
  // ── Auth ────────────────────────────────────────────────────
  const [session, setSession]           = useState(null);
  const [userProfile, setUserProfile]   = useState(null);
  const [authLoading, setAuthLoading]   = useState(true);

  // ── Data ────────────────────────────────────────────────────
  const [students,  setStudents]  = useState([]);
  const [teachers,  setTeachers]  = useState([]);
  const [classes,   setClasses]   = useState([]);
  const [subjects,  setSubjects]  = useState([]);
  const [grades,    setGrades]    = useState([]);
  const [payments,  setPayments]  = useState([]);
  const [schedules, setSchedules] = useState({});
  const [academicYears, setAcademicYears] = useState([
    { id: '1', year_code: '2026-2027', is_current: false },
    { id: '2', year_code: '2025-2026', is_current: true },
    { id: '3', year_code: '2024-2025', is_current: false },
  ]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2025-2026');
  const [dataLoading, setDataLoading] = useState(false);

  // ── Parent ───────────────────────────────────────────────────
  const [parentRecord,      setParentRecord]      = useState(null);
  const [isParentOnboarded, setIsParentOnboarded] = useState(false);

  const schoolInfo  = SCHOOL_INFO;
  const currentRole = userProfile?.role || null;

  // ─────────────────────────────────────────────────────────────
  // AUTH LISTENER
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) loadUserProfile(s.user.id);
      else    setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        if (s) {
          loadUserProfile(s.user.id);
        } else {
          resetState();
          setAuthLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetState = () => {
    setUserProfile(null);
    setStudents([]);
    setTeachers([]);
    setClasses([]);
    setSubjects([]);
    setGrades([]);
    setPayments([]);
    setParentRecord(null);
    setIsParentOnboarded(false);
  };

  // ─────────────────────────────────────────────────────────────
  // LOAD PROFILE → THEN DATA
  // ─────────────────────────────────────────────────────────────
  const loadUserProfile = async (userId) => {
    try {
      const { data: profile, error } = await fetchProfile(userId);
      if (error || !profile) {
        // New user — profile may not exist yet (trigger may still be running)
        setAuthLoading(false);
        return;
      }
      setUserProfile(profile);
      await loadDataForRole(profile.role, userId, profile.id);
    } catch (err) {
      console.error('loadUserProfile:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadDataForRole = async (role, _userId, profileId) => {
    setDataLoading(true);
    try {
      const [clsRes, subRes, ayRes] = await Promise.all([
        fetchAllClasses(),
        fetchAllSubjects(),
        fetchAllAcademicYears(),
      ]);
      setClasses(clsRes.data  || []);
      setSubjects(subRes.data || []);
      if (ayRes?.data && ayRes.data.length > 0) {
        setAcademicYears(ayRes.data);
        const curr = ayRes.data.find(a => a.is_current);
        if (curr) setSelectedAcademicYear(curr.year_code);
      }

      if (role === 'admin') {
        const [stuRes, tchRes, grdRes, payRes, schRes] = await Promise.all([
          fetchAllStudents(),
          fetchAllTeachers(),
          fetchAllGrades(),
          fetchAllPayments(),
          fetchAllSchedules(),
        ]);
        const mappedStudents = (stuRes.data || []).map(s => ({
          ...s,
          classId: s.class_id || s.classId,
          parentName: s.parent_name || s.parentName,
          parentPhone: s.parent_phone || s.parentPhone,
          tuitionTotal: s.tuition_total || s.tuitionTotal,
          tuitionPaid: s.tuition_paid || s.tuitionPaid,
          dateOfBirth: s.date_of_birth || s.dateOfBirth,
        }));
        setStudents(mappedStudents);
        setTeachers(tchRes.data || []);
        setGrades(grdRes.data   || []);
        setPayments(payRes.data || []);

        // Schedule Map
        const schedMap = {};
        (schRes?.data || []).forEach(item => {
          const cId = item.class_id;
          if (!schedMap[cId]) schedMap[cId] = [];
          schedMap[cId].push({
            id: item.id,
            day: item.day_name,
            time: item.time_slot,
            subject: item.subject_name,
            teacher: item.teacher_name,
            room: item.classroom,
            class_id: item.class_id,
          });
        });
        setSchedules(schedMap);

      } else if (role === 'teacher') {
        const [stuRes, grdRes] = await Promise.all([
          fetchAllStudents(),
          fetchAllGrades(),
        ]);
        setStudents(stuRes.data || []);
        setGrades(grdRes.data   || []);

      } else if (role === 'parent') {
        const { data: parentData } = await fetchParentByProfileId(profileId);
        if (parentData) {
          setParentRecord(parentData);
          setIsParentOnboarded(true);
          const { data: links } = await fetchParentChildren(parentData.id);
          const children = (links || []).map((l) => l.students).filter(Boolean);
          const childIds = children.map((c) => c.id);
          setStudents(children);
          if (childIds.length > 0) {
            const [grdRes, payRes] = await Promise.all([
              fetchGradesByStudentIds(childIds),
              fetchPaymentsByStudentIds(childIds),
            ]);
            setGrades(grdRes.data   || []);
            setPayments(payRes.data || []);
          }
        } else {
          setIsParentOnboarded(false);
        }

      } else if (role === 'student') {
        const { data: stuData } = await fetchStudentByProfileId(profileId);
        if (stuData) {
          setStudents([stuData]);
          const { data: grdData } = await fetchGradesByStudent(stuData.id);
          setGrades(grdData || []);
        }
      }
    } catch (err) {
      console.error('loadDataForRole:', err);
    } finally {
      setDataLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // SIGN OUT
  // ─────────────────────────────────────────────────────────────
  const signOut = () => supabase.auth.signOut();

  // ─────────────────────────────────────────────────────────────
  // PARENT ONBOARDING
  // ─────────────────────────────────────────────────────────────
  const completeParentOnboarding = async (selectedStudent) => {
    if (!userProfile) return { error: 'Non connecté' };
    try {
      // Create parent row
      const { data: parent, error: pErr } = await insertParent({
        profile_id: userProfile.id,
        name:       userProfile.full_name,
        email:      userProfile.email,
        phone:      userProfile.phone || '',
      });
      if (pErr) return { error: pErr.message };

      // Link child
      const { error: lErr } = await linkParentToStudent(parent.id, selectedStudent.id);
      if (lErr) return { error: lErr.message };

      setParentRecord(parent);
      setIsParentOnboarded(true);
      setStudents([selectedStudent]);

      // Load that child's data
      const [grdRes, payRes] = await Promise.all([
        fetchGradesByStudentIds([selectedStudent.id]),
        fetchPaymentsByStudentIds([selectedStudent.id]),
      ]);
      setGrades(grdRes.data   || []);
      setPayments(payRes.data || []);

      return { success: true };
    } catch (err) {
      return { error: err.message };
    }
  };

  const addMoreChild = async (studentId) => {
    if (!parentRecord) return { error: 'Pas de profil parent' };
    const { error } = await linkParentToStudent(parentRecord.id, studentId);
    if (error) return { error: error.message };
    await loadDataForRole('parent', null, userProfile.id);
    return { success: true };
  };

  // ─────────────────────────────────────────────────────────────
  // ADMIN CRUD — STUDENTS
  // ─────────────────────────────────────────────────────────────
  const addStudent = async (data) => {
    const matricule = data.matricule || `EDU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      name: data.name,
      gender: data.gender || 'M',
      date_of_birth: data.date_of_birth || data.dateOfBirth || null,
      class_id: data.class_id || data.classId || null,
      parent_name: data.parent_name || data.parentName || '',
      parent_phone: data.parent_phone || data.parentPhone || '',
      tuition_total: Number(data.tuition_total || data.tuitionTotal) || 450000,
      tuition_paid: Number(data.tuition_paid || data.tuitionPaid) || 0,
      matricule,
    };
    const { data: s, error } = await insertStudent(payload);
    if (error) {
      console.error('addStudent DB error:', error);
      return { error: error.message };
    }
    const studentWithCompat = {
      ...s,
      classId: s.class_id,
      parentName: s.parent_name,
      parentPhone: s.parent_phone,
      tuitionTotal: s.tuition_total,
      tuitionPaid: s.tuition_paid,
      dateOfBirth: s.date_of_birth,
    };
    setStudents((p) => [studentWithCompat, ...p]);
    return { data: studentWithCompat };
  };

  const updateStudent = async (id, updated) => {
    const payload = {
      name: updated.name,
      gender: updated.gender,
      date_of_birth: updated.date_of_birth || updated.dateOfBirth || null,
      class_id: updated.class_id || updated.classId || null,
      parent_name: updated.parent_name || updated.parentName || '',
      parent_phone: updated.parent_phone || updated.parentPhone || '',
      tuition_total: Number(updated.tuition_total || updated.tuitionTotal) || 450000,
      tuition_paid: Number(updated.tuition_paid || updated.tuitionPaid) || 0,
    };
    const { error } = await updateStudentDb(id, payload);
    if (error) return { error: error.message };
    setStudents((p) => p.map((s) => (s.id === id ? {
      ...s,
      ...payload,
      classId: payload.class_id,
      parentName: payload.parent_name,
      parentPhone: payload.parent_phone,
      tuitionTotal: payload.tuition_total,
      tuitionPaid: payload.tuition_paid,
      dateOfBirth: payload.date_of_birth,
    } : s)));
    return { success: true };
  };

  const deleteStudent = async (id) => {
    const { error } = await deleteStudentDb(id);
    if (error) return { error: error.message };
    setStudents((p) => p.filter((s) => s.id !== id));
    setGrades((p)   => p.filter((g) => g.student_id !== id));
    return { success: true };
  };

  const importStudents = async (list) => {
    const results = [];
    for (const item of list) {
      const res = await addStudent({
        name:         item.name  || item.nom  || 'Élève',
        gender:       item.gender || item.sexe || 'M',
        date_of_birth: item.dateOfBirth || item.date_naissance || null,
        class_id:     item.classId || null,
        parent_name:  item.parentName  || item.parent_name  || '',
        parent_phone: item.parentPhone || item.parent_phone || '',
        tuition_total: Number(item.tuitionTotal || item.tuition_total) || 450000,
        tuition_paid:  Number(item.tuitionPaid  || item.tuition_paid)  || 0,
      });
      results.push(res);
    }
    return results;
  };

  // ─────────────────────────────────────────────────────────────
  // ADMIN CRUD — TEACHERS
  // ─────────────────────────────────────────────────────────────
  const addTeacher = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      specialty: data.specialty || 'Général',
    };
    const { data: t, error } = await insertTeacher(payload);
    if (error) {
      console.error('addTeacher DB error:', error);
      return { error: error.message };
    }
    const teacherWithCompat = {
      ...t,
      classes: data.selectedClasses || data.classes || [],
      subjects: data.selectedSubjects || data.subjects || [],
    };
    setTeachers((p) => [teacherWithCompat, ...p]);
    return { data: teacherWithCompat };
  };

  const updateTeacher = async (id, updated) => {
    const payload = {
      name: updated.name,
      email: updated.email,
      phone: updated.phone || '',
      specialty: updated.specialty || 'Général',
    };
    const { error } = await updateTeacherDb(id, payload);
    if (error) return { error: error.message };
    setTeachers((p) => p.map((t) => (t.id === id ? {
      ...t,
      ...payload,
      classes: updated.selectedClasses || t.classes || [],
      subjects: updated.selectedSubjects || t.subjects || [],
    } : t)));
    return { success: true };
  };

  const deleteTeacher = async (id) => {
    const { error } = await deleteTeacherDb(id);
    if (error) return { error: error.message };
    setTeachers((p) => p.filter((t) => t.id !== id));
    return { success: true };
  };

  // ─────────────────────────────────────────────────────────────
  // ADMIN CRUD — CLASSES & ACADEMIC YEARS
  // ─────────────────────────────────────────────────────────────
  const addClass = async (data) => {
    const payload = {
      name: data.name,
      level: data.level || 'Collège',
      academic_year: data.academic_year || selectedAcademicYear || '2025-2026',
    };
    const { data: c, error } = await insertClass(payload);
    if (error) {
      console.error('addClass DB error:', error);
      return { error: error.message || 'Erreur lors de la création de la classe' };
    }
    setClasses((p) => [c, ...p]);
    return { data: c };
  };

  const deleteClass = async (id) => {
    const { error } = await deleteClassDb(id);
    if (error) return { error: error.message };
    setClasses((p) => p.filter((c) => c.id !== id));
    return { success: true };
  };

  const addAcademicYear = async (yearCode) => {
    const trimmed = yearCode.trim();
    if (!trimmed) return { error: "Code d'année invalide" };
    const { data: ay, error } = await insertAcademicYear(trimmed);
    if (error) {
      // Fallback local if DB error or offline
      const fallback = { id: Date.now().toString(), year_code: trimmed, is_current: false };
      setAcademicYears((prev) => {
        if (prev.some(y => y.year_code === trimmed)) return prev;
        return [fallback, ...prev];
      });
      return { data: fallback };
    }
    setAcademicYears((prev) => {
      if (prev.some(y => y.year_code === trimmed)) return prev;
      return [ay, ...prev];
    });
    return { data: ay };
  };

  // ─────────────────────────────────────────────────────────────
  // SCHEDULES
  // ─────────────────────────────────────────────────────────────
  const addScheduleSlot = async (slotData) => {
    const payload = {
      class_id: slotData.class_id || slotData.classId,
      subject_name: slotData.subject_name || slotData.subject,
      teacher_name: slotData.teacher_name || slotData.teacher || 'Enseignant',
      day_name: slotData.day_name || slotData.day,
      time_slot: slotData.time_slot || slotData.time,
      classroom: slotData.classroom || slotData.room || 'Salle A',
    };
    const { data: s, error } = await insertSchedule(payload);
    if (error) {
      console.error('addScheduleSlot DB error:', error);
      return { error: error.message };
    }
    const newSlot = {
      id: s.id,
      day: s.day_name,
      time: s.time_slot,
      subject: s.subject_name,
      teacher: s.teacher_name,
      room: s.classroom,
      class_id: s.class_id,
    };
    setSchedules((prev) => {
      const clsId = payload.class_id;
      const currentClsSchedules = prev[clsId] || [];
      return {
        ...prev,
        [clsId]: [...currentClsSchedules, newSlot]
      };
    });
    return { data: newSlot };
  };

  const deleteScheduleSlot = async (id, classId) => {
    const { error } = await deleteScheduleDb(id);
    if (error) return { error: error.message };
    setSchedules((prev) => {
      const clsId = classId;
      const currentClsSchedules = prev[clsId] || [];
      return {
        ...prev,
        [clsId]: currentClsSchedules.filter((item) => item.id !== id)
      };
    });
    return { success: true };
  };

  // ─────────────────────────────────────────────────────────────
  // GRADES
  // ─────────────────────────────────────────────────────────────
  const addGrade = async (data) => {
    const { data: g, error } = await insertGrade(data);
    if (error) return { error: error.message };
    setGrades((p) => [g, ...p]);
    return { data: g };
  };

  const deleteGrade = async (id) => {
    const { error } = await deleteGradeDb(id);
    if (error) return { error: error.message };
    setGrades((p) => p.filter((g) => g.id !== id));
    return { success: true };
  };

  const calculateStudentAverage = (studentId, period = 'Trimestre 1') => {
    const sg = grades.filter(
      (g) => g.student_id === studentId && g.period === period
    );
    if (!sg.length) return { average: 0, totalPoints: 0, totalCoefs: 0, count: 0 };
    let pts = 0, coefs = 0;
    sg.forEach((g) => {
      const c = Number(g.coefficient) || 1;
      pts   += Number(g.score) * c;
      coefs += c;
    });
    return {
      average:     coefs > 0 ? Number((pts / coefs).toFixed(2)) : 0,
      totalPoints: pts.toFixed(2),
      totalCoefs:  coefs,
      count:       sg.length,
    };
  };

  // ─────────────────────────────────────────────────────────────
  // PAYMENTS
  // ─────────────────────────────────────────────────────────────
  const recordPayment = async (paymentData) => {
    const reference = paymentData.reference || `PAY-${Date.now()}`;
    const targetStudentId = paymentData.student_id || paymentData.studentId;
    const targetStudent = students.find(s => s.id === targetStudentId);

    const payload = {
      student_id: targetStudentId,
      student_name: paymentData.student_name || paymentData.studentName || targetStudent?.name || 'Élève',
      matricule: paymentData.matricule || targetStudent?.matricule || 'N/A',
      amount: Number(paymentData.amount) || 0,
      method: paymentData.method || 'Espèces',
      reference,
      status: 'Confirmé',
    };

    const { data: pay, error } = await insertPayment(payload);
    if (error) {
      console.error('recordPayment DB error:', error);
      return { error: error.message };
    }

    // Update student's tuition_paid in Supabase DB
    if (targetStudent) {
      const currentPaid = Number(targetStudent.tuition_paid || targetStudent.tuitionPaid || 0);
      const newPaid = currentPaid + payload.amount;
      await updateStudentDb(targetStudent.id, { tuition_paid: newPaid });
      setStudents((prev) =>
        prev.map((s) => (s.id === targetStudent.id ? { ...s, tuition_paid: newPaid, tuitionPaid: newPaid } : s))
      );
    }

    const paymentWithCompat = {
      ...pay,
      studentId: pay.student_id,
      studentName: pay.student_name,
      matricule: pay.matricule,
      amount: Number(pay.amount),
      method: pay.method,
      reference: pay.reference,
      date: pay.payment_date || new Date().toISOString().split('T')[0],
      recordedBy: userProfile?.full_name || 'Admin',
      status: pay.status || 'Confirmé',
    };

    setPayments((prev) => [paymentWithCompat, ...prev]);
    return { data: paymentWithCompat };
  };

  // ─────────────────────────────────────────────────────────────
  // LEGACY COMPAT (les vues existantes utilisent ces getters)
  // ─────────────────────────────────────────────────────────────
  const getScopedStudents      = () => students;
  const getScopedClasses       = () => classes;
  const getScopedGrades        = () => grades;
  const getParentChildren      = () => students;
  const getCurrentTeacherProfile = () =>
    teachers.find((t) => t.profile_id === userProfile?.id) || teachers[0] || null;

  // ─────────────────────────────────────────────────────────────
  // PROVIDER
  // ─────────────────────────────────────────────────────────────
  return (
    <AppContext.Provider
      value={{
        // Auth
        session,
        userProfile,
        currentRole,
        authLoading,
        dataLoading,
        signOut,
        // School & Academic Years
        schoolInfo,
        academicYears,
        selectedAcademicYear,
        setSelectedAcademicYear,
        addAcademicYear,
        // Data
        students,
        teachers,
        classes,
        subjects,
        grades,
        payments,
        schedules,
        // Parent
        parentRecord,
        isParentOnboarded,
        completeParentOnboarding,
        addMoreChild,
        // Legacy compat
        currentUser:              userProfile,
        getScopedStudents,
        getScopedClasses,
        getScopedGrades,
        getParentChildren,
        getCurrentTeacherProfile,
        // CRUD
        addStudent,
        updateStudent,
        deleteStudent,
        importStudents,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addClass,
        deleteClass,
        addScheduleSlot,
        deleteScheduleSlot,
        addGrade,
        deleteGrade,
        calculateStudentAverage,
        recordPayment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
