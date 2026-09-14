-- ==============================================================================
-- MIGRATION 0004 — ANNEES SCOLAIRES & FIX CREATION CLASSES
-- ==============================================================================

-- 1. Permettre aux classes d'avoir le même nom dans des années scolaires différentes
ALTER TABLE public.classes DROP CONSTRAINT IF EXISTS classes_name_key;
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'classes_name_academic_year_key'
    ) THEN
        ALTER TABLE public.classes ADD CONSTRAINT classes_name_academic_year_key UNIQUE (name, academic_year);
    END IF;
END $$;

-- 2. Table des années scolaires
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_code VARCHAR(20) NOT NULL UNIQUE,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read academic_years" ON public.academic_years;
CREATE POLICY "Anyone can read academic_years" ON public.academic_years FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated write academic_years" ON public.academic_years;
CREATE POLICY "Authenticated write academic_years" ON public.academic_years FOR ALL USING (auth.role() = 'authenticated');

-- Années par défaut
INSERT INTO public.academic_years (year_code, is_current)
VALUES 
  ('2024-2025', false),
  ('2025-2026', true),
  ('2026-2027', false)
ON CONFLICT (year_code) DO NOTHING;

-- 3. RLS assoupli sur classes pour la création par les admins/utilisateurs authentifiés
DROP POLICY IF EXISTS "Admin manage classes" ON public.classes;
DROP POLICY IF EXISTS "Anyone can read classes" ON public.classes;
DROP POLICY IF EXISTS "Authenticated write classes" ON public.classes;

CREATE POLICY "Anyone can read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Authenticated write classes" ON public.classes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
