-- Drop any overly permissive policies that allow all authenticated users to view doctor contact info
DROP POLICY IF EXISTS "Authenticated users can view doctor profiles" ON public.doctor_profiles;
DROP POLICY IF EXISTS "Users can view doctor profiles" ON public.doctor_profiles;

-- The existing policies already correctly restrict access:
-- 1. Doctors can only view their own profile
-- 2. Admins can view all profiles
-- This ensures email and phone are only accessible to the doctor themselves and admins