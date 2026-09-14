-- ==============================================================================
-- MIGRATION 0005 — POLICIES RLS COMPLÈTES POUR TOUTES LES TABLES
-- ==============================================================================

-- 1. STUDENTS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students select all" ON public.students;
DROP POLICY IF EXISTS "Students insert all" ON public.students;
DROP POLICY IF EXISTS "Students update all" ON public.students;
DROP POLICY IF EXISTS "Students delete all" ON public.students;

CREATE POLICY "Students select all" ON public.students FOR SELECT USING (true);
CREATE POLICY "Students insert all" ON public.students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Students update all" ON public.students FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Students delete all" ON public.students FOR DELETE USING (auth.role() = 'authenticated');

-- 2. TEACHERS
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers select all" ON public.teachers;
DROP POLICY IF EXISTS "Teachers insert all" ON public.teachers;
DROP POLICY IF EXISTS "Teachers update all" ON public.teachers;
DROP POLICY IF EXISTS "Teachers delete all" ON public.teachers;

CREATE POLICY "Teachers select all" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Teachers insert all" ON public.teachers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Teachers update all" ON public.teachers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Teachers delete all" ON public.teachers FOR DELETE USING (auth.role() = 'authenticated');

-- 3. SCHEDULES
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Schedules select all" ON public.schedules;
DROP POLICY IF EXISTS "Schedules insert all" ON public.schedules;
DROP POLICY IF EXISTS "Schedules update all" ON public.schedules;
DROP POLICY IF EXISTS "Schedules delete all" ON public.schedules;

CREATE POLICY "Schedules select all" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Schedules insert all" ON public.schedules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Schedules update all" ON public.schedules FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Schedules delete all" ON public.schedules FOR DELETE USING (auth.role() = 'authenticated');

-- 4. GRADES
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Grades select all" ON public.grades;
DROP POLICY IF EXISTS "Grades insert all" ON public.grades;
DROP POLICY IF EXISTS "Grades update all" ON public.grades;
DROP POLICY IF EXISTS "Grades delete all" ON public.grades;

CREATE POLICY "Grades select all" ON public.grades FOR SELECT USING (true);
CREATE POLICY "Grades insert all" ON public.grades FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Grades update all" ON public.grades FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Grades delete all" ON public.grades FOR DELETE USING (auth.role() = 'authenticated');

-- 5. PAYMENTS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Payments select all" ON public.payments;
DROP POLICY IF EXISTS "Payments insert all" ON public.payments;
DROP POLICY IF EXISTS "Payments update all" ON public.payments;
DROP POLICY IF EXISTS "Payments delete all" ON public.payments;

CREATE POLICY "Payments select all" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Payments insert all" ON public.payments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Payments update all" ON public.payments FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Payments delete all" ON public.payments FOR DELETE USING (auth.role() = 'authenticated');
