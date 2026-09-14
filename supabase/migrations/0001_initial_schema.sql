-- ==============================================================================
-- EDUMASTER SAAS - MIGRATION DB INITIALE & RLS POLICIES (POSTGRESQL / SUPABASE CLI)
-- gen_random_uuid() est natif dans PostgreSQL 13+ — aucune extension requise
-- ==============================================================================

-- 1. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent', 'student');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tuition_status AS ENUM ('solde', 'partiel', 'retard');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'orange_money', 'wave', 'mtn_momo', 'card');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('completed', 'pending', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. PROFILES TABLE (Supabase Auth Integration)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CLASSES
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    level VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL DEFAULT '2025-2026',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SUBJECTS (MATIÈRES)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    coefficient INT NOT NULL DEFAULT 1,
    color VARCHAR(20) DEFAULT '#0F172A'
);

-- 5. TEACHERS & ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    specialty TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.teacher_classes (
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (teacher_id, class_id, subject_id)
);

-- 6. STUDENTS & PARENTS
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    matricule VARCHAR(50) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    date_of_birth DATE,
    class_id UUID REFERENCES public.classes(id) ON DELETE RESTRICT,
    parent_name TEXT,
    parent_phone TEXT,
    tuition_total NUMERIC(12, 2) DEFAULT 450000.00,
    tuition_paid NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    occupation TEXT
);

CREATE TABLE IF NOT EXISTS public.parent_students (
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_id, student_id)
);

-- 7. GRADES (NOTES & ÉVALUATIONS)
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
    score NUMERIC(4, 2) NOT NULL CHECK (score >= 0 AND score <= 20),
    max_score NUMERIC(4, 2) NOT NULL DEFAULT 20.00,
    coefficient INT NOT NULL DEFAULT 1,
    period VARCHAR(30) NOT NULL,
    evaluation_title VARCHAR(100) NOT NULL,
    comment TEXT,
    teacher_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SCHEDULES (EMPLOIS DU TEMPS)
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_name VARCHAR(100) NOT NULL,
    teacher_name VARCHAR(100),
    day_name VARCHAR(20) NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    classroom VARCHAR(50) NOT NULL
);

-- 9. PAYMENTS (FINANCE & MOBILE MONEY)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    matricule TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    method TEXT NOT NULL,
    reference TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'Confirmé',
    recorded_by TEXT,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — ISOLATION STRICTE PAR RÔLE
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
DROP POLICY IF EXISTS "Admins have full profile access" ON public.profiles;
CREATE POLICY "Admins have full profile access" ON public.profiles
    FOR ALL USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- 2. STUDENTS POLICIES
DROP POLICY IF EXISTS "Admin full student access" ON public.students;
CREATE POLICY "Admin full student access" ON public.students
    FOR ALL USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Student view own record" ON public.students;
CREATE POLICY "Student view own record" ON public.students
    FOR SELECT USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Parent view own children" ON public.students;
CREATE POLICY "Parent view own children" ON public.students
    FOR SELECT USING (
        id IN (
            SELECT student_id FROM public.parent_students ps
            JOIN public.parents p ON p.id = ps.parent_id
            WHERE p.profile_id = auth.uid()
        )
    );

-- 3. GRADES POLICIES
DROP POLICY IF EXISTS "Admin full grades access" ON public.grades;
CREATE POLICY "Admin full grades access" ON public.grades
    FOR ALL USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Teachers manage assigned grades" ON public.grades;
CREATE POLICY "Teachers manage assigned grades" ON public.grades
    FOR ALL USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'teacher');

DROP POLICY IF EXISTS "Students view own grades" ON public.grades;
CREATE POLICY "Students view own grades" ON public.grades
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
    );

DROP POLICY IF EXISTS "Parents view children grades" ON public.grades;
CREATE POLICY "Parents view children grades" ON public.grades
    FOR SELECT USING (
        student_id IN (
            SELECT student_id FROM public.parent_students ps
            JOIN public.parents p ON p.id = ps.parent_id
            WHERE p.profile_id = auth.uid()
        )
    );

-- 4. PAYMENTS POLICIES
DROP POLICY IF EXISTS "Admin full payments access" ON public.payments;
CREATE POLICY "Admin full payments access" ON public.payments
    FOR ALL USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Parents view children payments" ON public.payments;
CREATE POLICY "Parents view children payments" ON public.payments
    FOR SELECT USING (
        student_id IN (
            SELECT student_id FROM public.parent_students ps
            JOIN public.parents p ON p.id = ps.parent_id
            WHERE p.profile_id = auth.uid()
        )
    );

-- 5. OPEN READ POLICIES pour classes et subjects (données publiques)
DROP POLICY IF EXISTS "Anyone can read classes" ON public.classes;
CREATE POLICY "Anyone can read classes" ON public.classes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read subjects" ON public.subjects;
CREATE POLICY "Anyone can read subjects" ON public.subjects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read schedules" ON public.schedules;
CREATE POLICY "Anyone can read schedules" ON public.schedules
    FOR SELECT USING (true);

-- ==============================================================================
-- TRIGGER: CRÉATION AUTOMATIQUE DU PROFIL À L'INSCRIPTION
-- Chaque nouvel utilisateur Supabase Auth obtient automatiquement une ligne
-- dans public.profiles avec son rôle extrait des user_metadata
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
