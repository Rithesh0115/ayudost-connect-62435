-- Drop the overly permissive policy that exposes all doctor data
DROP POLICY IF EXISTS "Authenticated users can view doctor profiles" ON public.doctor_profiles;

-- Create a view for public doctor information (excludes sensitive email/phone)
CREATE OR REPLACE VIEW public.public_doctor_profiles AS
SELECT 
  id,
  full_name,
  specialty,
  qualifications,
  clinic_name,
  clinic_address,
  experience_years,
  consultation_fee,
  avatar_url,
  bio,
  created_at,
  updated_at
FROM public.doctor_profiles;

-- Grant SELECT on the public view to authenticated users
GRANT SELECT ON public.public_doctor_profiles TO authenticated;

-- The existing "Doctors can view their own profile" policy remains
-- This allows doctors to see their full profile including email/phone
-- when querying the doctor_profiles table directly