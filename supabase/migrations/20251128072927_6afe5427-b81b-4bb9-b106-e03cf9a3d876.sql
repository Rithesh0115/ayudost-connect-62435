-- Fix existing doctor users to have 'doctor' role
UPDATE public.user_roles 
SET role = 'doctor'
WHERE user_id IN (
  SELECT id FROM public.doctor_profiles
);

-- Create SECURITY DEFINER function for assigning doctor role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.assign_doctor_role(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete any existing role first (in case trigger added 'user' role)
  DELETE FROM public.user_roles WHERE user_id = user_id_param;
  
  -- Insert doctor role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id_param, 'doctor');
END;
$$;

-- Update trigger to NOT auto-assign 'user' role if user is signing up as doctor
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only assign 'user' role if not signing up as doctor
  -- (doctor signup will call assign_doctor_role function)
  IF COALESCE((NEW.raw_user_meta_data->>'is_doctor')::boolean, false) = false THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;