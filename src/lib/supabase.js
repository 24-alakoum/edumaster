import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// AUTH
// ============================================================
export const authSignUp = (email, password, metadata) =>
  supabase.auth.signUp({ email, password, options: { data: metadata } });

export const authSignIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

export const authSignOut = () => supabase.auth.signOut();

export const getSession = () => supabase.auth.getSession();

// ============================================================
// PROFILES
// ============================================================
export const fetchProfile = (userId) =>
  supabase.from('profiles').select('*').eq('id', userId).single();

export const upsertProfile = (data) =>
  supabase.from('profiles').upsert(data, { onConflict: 'id' });

// ============================================================
// STUDENTS
// ============================================================
export const fetchAllStudents = () =>
  supabase
    .from('students')
    .select('*, classes(id, name, level)')
    .order('name');

export const fetchStudentByProfileId = (profileId) =>
  supabase
    .from('students')
    .select('*, classes(id, name, level)')
    .eq('profile_id', profileId)
    .single();

export const searchStudentsDb = (query) =>
  supabase
    .from('students')
    .select('id, name, matricule, parent_name, parent_phone, classes(name)')
    .or(`name.ilike.%${query}%,matricule.ilike.%${query}%`)
    .limit(10);

export const insertStudent = (data) =>
  supabase.from('students').insert(data).select('*, classes(id, name, level)').single();

export const updateStudentDb = (id, data) =>
  supabase.from('students').update(data).eq('id', id);

export const deleteStudentDb = (id) =>
  supabase.from('students').delete().eq('id', id);

// ============================================================
// TEACHERS
// ============================================================
export const fetchAllTeachers = () =>
  supabase.from('teachers').select('*').order('name');

export const insertTeacher = (data) =>
  supabase.from('teachers').insert(data).select().single();

export const deleteTeacherDb = (id) =>
  supabase.from('teachers').delete().eq('id', id);

// ============================================================
// CLASSES
// ============================================================
export const fetchAllClasses = () =>
  supabase.from('classes').select('*').order('name');

export const insertClass = (data) =>
  supabase.from('classes').insert(data).select().single();

// ============================================================
// SUBJECTS
// ============================================================
export const fetchAllSubjects = () =>
  supabase.from('subjects').select('*').order('name');

// ============================================================
// GRADES
// ============================================================
export const fetchAllGrades = () =>
  supabase
    .from('grades')
    .select('*, subjects(name, code, color)')
    .order('created_at', { ascending: false });

export const fetchGradesByStudent = (studentId) =>
  supabase
    .from('grades')
    .select('*, subjects(name, code, color)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

export const fetchGradesByStudentIds = (studentIds) =>
  supabase
    .from('grades')
    .select('*, subjects(name, code, color)')
    .in('student_id', studentIds)
    .order('created_at', { ascending: false });

export const insertGrade = (data) =>
  supabase.from('grades').insert(data).select('*, subjects(name, code, color)').single();

export const deleteGradeDb = (id) =>
  supabase.from('grades').delete().eq('id', id);

// ============================================================
// PAYMENTS
// ============================================================
export const fetchAllPayments = () =>
  supabase
    .from('payments')
    .select('*')
    .order('payment_date', { ascending: false });

export const fetchPaymentsByStudentIds = (studentIds) =>
  supabase
    .from('payments')
    .select('*')
    .in('student_id', studentIds)
    .order('payment_date', { ascending: false });

export const insertPayment = (data) =>
  supabase.from('payments').insert(data).select().single();

// ============================================================
// SCHEDULES
// ============================================================
export const fetchSchedulesByClass = (classId) =>
  supabase.from('schedules').select('*').eq('class_id', classId);

// ============================================================
// PARENTS
// ============================================================
export const fetchParentByProfileId = (profileId) =>
  supabase.from('parents').select('*').eq('profile_id', profileId).single();

export const insertParent = (data) =>
  supabase.from('parents').insert(data).select().single();

export const fetchParentChildren = (parentId) =>
  supabase
    .from('parent_students')
    .select('student_id, students(*, classes(id, name, level))')
    .eq('parent_id', parentId);

export const linkParentToStudent = (parentId, studentId) =>
  supabase
    .from('parent_students')
    .insert({ parent_id: parentId, student_id: studentId });
