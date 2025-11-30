-- Rename tables to include patient_ prefix
ALTER TABLE profiles RENAME TO patient_profiles;
ALTER TABLE prescriptions RENAME TO patient_prescriptions;
ALTER TABLE medical_records RENAME TO patient_medical_records;
ALTER TABLE appointments RENAME TO patient_appointments;

-- Update the handle_new_user() trigger function to reference patient_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only create profile if NOT signing up as doctor
  IF COALESCE((NEW.raw_user_meta_data->>'is_doctor')::boolean, false) = false THEN
    INSERT INTO public.patient_profiles (id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
  END IF;
  RETURN NEW;
END;
$function$;