-- Recreate the view with SECURITY INVOKER to use querying user's permissions
DROP VIEW IF EXISTS public.public_doctor_profiles;

CREATE VIEW public.public_doctor_profiles
WITH (security_invoker = true) AS
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

-- Enable RLS on the view (inherits from underlying table)
ALTER VIEW public.public_doctor_profiles SET (security_invoker = on);