-- ==============================================================================
-- MIGRATION 0002 — TRIGGER AUTO-PROFIL + CORRECTIFS
-- ==============================================================================

-- Trigger: création automatique d'un profil à l'inscription Supabase Auth
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

-- Open read policies (classes, subjects, schedules accessibles à tous les utilisateurs connectés)
DROP POLICY IF EXISTS "Anyone can read classes" ON public.classes;
CREATE POLICY "Anyone can read classes" ON public.classes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read subjects" ON public.subjects;
CREATE POLICY "Anyone can read subjects" ON public.subjects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read schedules" ON public.schedules;
CREATE POLICY "Anyone can read schedules" ON public.schedules
    FOR SELECT USING (true);

-- Admin write policies pour classes et subjects
DROP POLICY IF EXISTS "Admin manage classes" ON public.classes;
CREATE POLICY "Admin manage classes" ON public.classes
    FOR ALL USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin manage subjects" ON public.subjects;
CREATE POLICY "Admin manage subjects" ON public.subjects
    FOR ALL USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin manage schedules" ON public.schedules;
CREATE POLICY "Admin manage schedules" ON public.schedules
    FOR ALL USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

-- Teachers can manage grades
DROP POLICY IF EXISTS "Teachers manage grades" ON public.grades;
CREATE POLICY "Teachers manage grades" ON public.grades
    FOR ALL USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'teacher');

-- Teachers can read students
DROP POLICY IF EXISTS "Teachers read students" ON public.students;
CREATE POLICY "Teachers read students" ON public.students
    FOR SELECT USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'teacher');

-- Admin can write to students, teachers, parents
DROP POLICY IF EXISTS "Admin write students" ON public.students;
CREATE POLICY "Admin write students" ON public.students
    FOR INSERT WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin update students" ON public.students;
CREATE POLICY "Admin update students" ON public.students
    FOR UPDATE USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin delete students" ON public.students;
CREATE POLICY "Admin delete students" ON public.students
    FOR DELETE USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

-- Parents can create their own record
DROP POLICY IF EXISTS "Parents insert own record" ON public.parents;
CREATE POLICY "Parents insert own record" ON public.parents
    FOR INSERT WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Parents read own record" ON public.parents;
CREATE POLICY "Parents read own record" ON public.parents
    FOR SELECT USING (profile_id = auth.uid());

-- Parents can create parent_students links
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Parents create own links" ON public.parent_students;
CREATE POLICY "Parents create own links" ON public.parent_students
    FOR INSERT WITH CHECK (
        parent_id IN (
            SELECT id FROM public.parents WHERE profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Parents read own links" ON public.parent_students;
CREATE POLICY "Parents read own links" ON public.parent_students
    FOR SELECT USING (
        parent_id IN (
            SELECT id FROM public.parents WHERE profile_id = auth.uid()
        )
    );

-- Admin has full access to payments insert
DROP POLICY IF EXISTS "Admin insert payments" ON public.payments;
CREATE POLICY "Admin insert payments" ON public.payments
    FOR INSERT WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

-- Admin insert teachers
DROP POLICY IF EXISTS "Admin insert teachers" ON public.teachers;
CREATE POLICY "Admin insert teachers" ON public.teachers
    FOR INSERT WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin read teachers" ON public.teachers;
CREATE POLICY "Admin read teachers" ON public.teachers
    FOR SELECT USING (
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' IN ('admin', 'teacher')
    );

DROP POLICY IF EXISTS "Admin delete teachers" ON public.teachers;
CREATE POLICY "Admin delete teachers" ON public.teachers
    FOR DELETE USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');
