-- Drop the public access policy that exposes contact information
DROP POLICY IF EXISTS "Anyone can view active clinics" ON public.clinics;

-- Create authenticated-only policy for viewing active clinics
-- This protects phone and email from public scraping
CREATE POLICY "Authenticated users can view active clinics"
ON public.clinics
FOR SELECT
TO authenticated
USING (status = 'active'::text);