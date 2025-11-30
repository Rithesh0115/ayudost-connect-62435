-- Create admin_profiles table
CREATE TABLE public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  department TEXT DEFAULT 'Platform Administration',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_profiles
-- Admins can view their own profile
CREATE POLICY "Admins can view their own profile"
ON public.admin_profiles
FOR SELECT
USING (auth.uid() = id);

-- Admins can update their own profile
CREATE POLICY "Admins can update their own profile"
ON public.admin_profiles
FOR UPDATE
USING (auth.uid() = id);

-- Admins can insert their own profile
CREATE POLICY "Admins can insert their own profile"
ON public.admin_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update the existing user's role from 'user' to 'admin'
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '11a2ec2c-7167-4fcd-b104-8e6b84b5256e';

-- Insert admin profile data
INSERT INTO public.admin_profiles (id, full_name, email, department)
VALUES (
  '11a2ec2c-7167-4fcd-b104-8e6b84b5256e',
  'Ayudost',
  'ayudost@gmail.com',
  'Platform Administration'
);