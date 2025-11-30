-- Add admin access policies to doctor_profiles table
-- This explicitly grants admins the ability to view and manage doctor profiles
-- while maintaining the security boundary for other users

CREATE POLICY "Admins can view all doctor profiles"
ON public.doctor_profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update doctor profiles"
ON public.doctor_profiles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));