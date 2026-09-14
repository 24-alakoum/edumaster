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
  deleteTeacherDb,
  insertClass,
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
      const [clsRes, subRes] = await Promise.all([
        fetchAllClasses(),
        fetchAllSubjects(),
      ]);
      setClasses(clsRes.data  || []);
      setSubjects(subRes.data || []);

      if (role === 'admin') {
        const [stuRes, tchRes, grdRes, payRes] = await Promise.all([
          fetchAllStudents(),
          fetchAllTeachers(),
          fetchAllGrades(),
          fetchAllPayments(),
        ]);
        setStudents(stuRes.data || []);
        setTeachers(tchRes.data || []);
        setGrades(grdRes.data   || []);
        setPayments(payRes.data || []);

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
    const matricule = `EDU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const { data: s, error } = await insertStudent({ ...data, matricule });
    if (error) return { error: error.message };
    setStudents((p) => [s, ...p]);
    return { data: s };
  };

  const updateStudent = async (id, updated) => {
    const { error } = await updateStudentDb(id, updated);
    if (error) return { error: error.message };
    setStudents((p) => p.map((s) => (s.id === id ? { ...s, ...updated } : s)));
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
    const { data: t, error } = await insertTeacher(data);
    if (error) return { error: error.message };
    setTeachers((p) => [t, ...p]);
    return { data: t };
  };

  const deleteTeacher = async (id) => {
    const { error } = await deleteTeacherDb(id);
    if (error) return { error: error.message };
    setTeachers((p) => p.filter((t) => t.id !== id));
    return { success: true };
  };

  // ─────────────────────────────────────────────────────────────
  // ADMIN CRUD — CLASSES
  // ─────────────────────────────────────────────────────────────
  const addClass = async (data) => {
    const { data: c, error } = await insertClass(data);
    if (error) return { error: error.message };
    setClasses((p) => [...p, c]);
    return { data: c };
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
    const reference = `PAY-${Date.now()}`;
    const { data: pay, error } = await insertPayment({
      ...paymentData,
      reference,
      status:      'Confirmé',
      recorded_by: userProfile?.full_name || 'Admin',
    });
    if (error) return { error: error.message };
    setPayments((p) => [pay, ...p]);
    setStudents((p) =>
      p.map((s) => {
        if (s.id === paymentData.student_id) {
          const newPaid = (s.tuition_paid || 0) + Number(paymentData.amount);
          return { ...s, tuition_paid: newPaid };
        }
        return s;
      })
    );
    return { data: pay };
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
        // School
        schoolInfo,
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
        deleteTeacher,
        addClass,
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
