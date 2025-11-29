-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view doctor profiles" ON public.doctor_profiles;

-- Create a new policy that requires authentication to view doctor profiles
-- This prevents public scraping of doctor contact information
CREATE POLICY "Authenticated users can view doctor profiles"
ON public.doctor_profiles
FOR SELECT
TO authenticated
USING (true);

-- Doctors can still view their own profiles (existing policy remains)
-- Doctors can still update their own profiles (existing policy remains)
-- Doctors can still insert their own profiles (existing policy remains)