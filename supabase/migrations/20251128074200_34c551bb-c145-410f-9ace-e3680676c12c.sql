-- Fix orphaned doctor accounts that didn't get proper role/profile setup

-- Fix rithesh@gmail.com (21935c6b-efa7-4f11-89db-17810809685f)
INSERT INTO public.user_roles (user_id, role)
VALUES ('21935c6b-efa7-4f11-89db-17810809685f', 'doctor')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.doctor_profiles (id, full_name, email)
VALUES ('21935c6b-efa7-4f11-89db-17810809685f', 'rithesh', 'rithesh@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- Fix yyy / y@gmail.com (b05649c2-02cd-4ea1-ab3b-ec6211d95973)
INSERT INTO public.user_roles (user_id, role)
VALUES ('b05649c2-02cd-4ea1-ab3b-ec6211d95973', 'doctor')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.doctor_profiles (id, full_name, email)
VALUES ('b05649c2-02cd-4ea1-ab3b-ec6211d95973', 'yyy', 'y@gmail.com')
ON CONFLICT (id) DO NOTHING;