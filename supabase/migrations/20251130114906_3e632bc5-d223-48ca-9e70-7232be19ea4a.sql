-- Create clinics table with State → District → Taluk hierarchy
CREATE TABLE public.clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Karnataka',
  district TEXT NOT NULL,
  taluk TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  timings TEXT,
  services TEXT[],
  rating NUMERIC DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create clinic_doctors junction table to link doctors to clinics
CREATE TABLE public.clinic_doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(clinic_id, doctor_id)
);

-- Enable RLS on clinics table
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- Enable RLS on clinic_doctors table
ALTER TABLE public.clinic_doctors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clinics table
-- Anyone (including unauthenticated users) can view active clinics (for public search)
CREATE POLICY "Anyone can view active clinics"
ON public.clinics
FOR SELECT
USING (status = 'active');

-- Only admins can insert clinics
CREATE POLICY "Admins can insert clinics"
ON public.clinics
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update clinics
CREATE POLICY "Admins can update clinics"
ON public.clinics
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete clinics
CREATE POLICY "Admins can delete clinics"
ON public.clinics
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for clinic_doctors table
-- Doctors can view their own clinic assignments
CREATE POLICY "Doctors can view their own clinic assignments"
ON public.clinic_doctors
FOR SELECT
TO authenticated
USING (auth.uid() = doctor_id);

-- Anyone can view clinic-doctor links (for public clinic search)
CREATE POLICY "Anyone can view clinic-doctor links"
ON public.clinic_doctors
FOR SELECT
USING (true);

-- Only admins can insert clinic-doctor links
CREATE POLICY "Admins can insert clinic-doctor links"
ON public.clinic_doctors
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update clinic-doctor links
CREATE POLICY "Admins can update clinic-doctor links"
ON public.clinic_doctors
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete clinic-doctor links
CREATE POLICY "Admins can delete clinic-doctor links"
ON public.clinic_doctors
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_clinics_location ON public.clinics(state, district, taluk);
CREATE INDEX idx_clinic_doctors_doctor_id ON public.clinic_doctors(doctor_id);
CREATE INDEX idx_clinic_doctors_clinic_id ON public.clinic_doctors(clinic_id);

-- Add trigger for updated_at on clinics
CREATE TRIGGER update_clinics_updated_at
BEFORE UPDATE ON public.clinics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();