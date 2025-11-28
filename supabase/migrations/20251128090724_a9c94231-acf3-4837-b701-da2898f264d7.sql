-- Update handle_new_user function to skip creating profiles for doctors
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only create profile if NOT signing up as doctor
  IF COALESCE((NEW.raw_user_meta_data->>'is_doctor')::boolean, false) = false THEN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
  END IF;
  RETURN NEW;
END;
$$;