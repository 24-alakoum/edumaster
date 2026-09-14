-- ==============================================================================
-- MIGRATION 0003 — TRIGGER ROBUSTE (fix "Database error saving new user")
-- Cause : le CAST vers user_role échoue si la valeur n'est pas reconnue,
--         et SET search_path est requis pour les fonctions SECURITY DEFINER.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  _role user_role := 'student';
  _raw_role TEXT;
BEGIN
  -- Récupérer la valeur brute du rôle depuis les métadonnées
  _raw_role := NEW.raw_user_meta_data->>'role';

  -- Valider et caster le rôle de manière sécurisée
  IF _raw_role IN ('admin', 'teacher', 'parent', 'student') THEN
    _role := _raw_role::user_role;
  END IF;

  -- Insérer le profil (ON CONFLICT pour éviter les doublons)
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''), split_part(NEW.email, '@', 1)),
    _role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = public, auth, pg_temp;

-- Recrée le trigger proprement
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
