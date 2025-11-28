-- Update handle_new_doctor function to check is_doctor metadata directly
CREATE OR REPLACE FUNCTION public.handle_new_doctor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create doctor profile if signing up as doctor (check metadata directly)
  IF COALESCE((NEW.raw_user_meta_data->>'is_doctor')::boolean, false) = true THEN
    INSERT INTO public.doctor_profiles (id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;