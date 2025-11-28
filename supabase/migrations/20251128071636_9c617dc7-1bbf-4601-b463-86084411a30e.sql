-- Create doctor_profiles table
CREATE TABLE public.doctor_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  specialty text,
  qualifications text,
  clinic_name text,
  clinic_address text,
  experience_years integer,
  consultation_fee numeric,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Create doctor_schedules table
CREATE TABLE public.doctor_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  slots integer DEFAULT 10,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;

-- Create doctor_patients table
CREATE TABLE public.doctor_patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  patient_age integer,
  patient_gender text,
  patient_phone text,
  patient_condition text,
  notes text,
  last_visit date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.doctor_patients ENABLE ROW LEVEL SECURITY;

-- Add doctor_id to appointments table
ALTER TABLE public.appointments 
ADD COLUMN doctor_id uuid REFERENCES auth.users(id);

-- Create trigger for new doctor signup
CREATE OR REPLACE FUNCTION public.handle_new_doctor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only create doctor profile if user has doctor role
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = NEW.id AND role = 'doctor'
  ) THEN
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

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created_doctor
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_doctor();

-- RLS Policies for doctor_profiles
CREATE POLICY "Doctors can view their own profile"
ON public.doctor_profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Doctors can update their own profile"
ON public.doctor_profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can view doctor profiles"
ON public.doctor_profiles
FOR SELECT
USING (true);

CREATE POLICY "Doctors can insert their own profile"
ON public.doctor_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- RLS Policies for doctor_schedules
CREATE POLICY "Doctors can view their own schedules"
ON public.doctor_schedules
FOR SELECT
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert their own schedules"
ON public.doctor_schedules
FOR INSERT
WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their own schedules"
ON public.doctor_schedules
FOR UPDATE
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete their own schedules"
ON public.doctor_schedules
FOR DELETE
USING (auth.uid() = doctor_id);

CREATE POLICY "Users can view doctor schedules"
ON public.doctor_schedules
FOR SELECT
USING (true);

-- RLS Policies for doctor_patients
CREATE POLICY "Doctors can view their own patients"
ON public.doctor_patients
FOR SELECT
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert their own patients"
ON public.doctor_patients
FOR INSERT
WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their own patients"
ON public.doctor_patients
FOR UPDATE
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete their own patients"
ON public.doctor_patients
FOR DELETE
USING (auth.uid() = doctor_id);

-- RLS Policies for appointments (add doctor access)
CREATE POLICY "Doctors can view their appointments"
ON public.appointments
FOR SELECT
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their appointments"
ON public.appointments
FOR UPDATE
USING (auth.uid() = doctor_id);

-- Trigger for updated_at on doctor tables
CREATE TRIGGER update_doctor_profiles_updated_at
BEFORE UPDATE ON public.doctor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_schedules_updated_at
BEFORE UPDATE ON public.doctor_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_patients_updated_at
BEFORE UPDATE ON public.doctor_patients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();