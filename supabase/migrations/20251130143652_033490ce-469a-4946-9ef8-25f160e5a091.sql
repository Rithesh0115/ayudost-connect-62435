-- Add explicit admin access policy for patient_profiles
-- This ensures only profile owners and authorized admins can view sensitive contact data

CREATE POLICY "Admins can view all patient profiles"
ON public.patient_profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update patient profiles"
ON public.patient_profiles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));