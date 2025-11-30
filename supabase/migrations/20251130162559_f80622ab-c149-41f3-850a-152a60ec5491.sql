-- Allow authenticated users (patients) to view doctor profiles for booking
CREATE POLICY "Authenticated users can view doctor profiles for booking"
ON public.doctor_profiles
FOR SELECT
TO authenticated
USING (true);