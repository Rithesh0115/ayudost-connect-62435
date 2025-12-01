-- Add patient_name column to patient_appointments table
ALTER TABLE patient_appointments ADD COLUMN patient_name text;

-- Backfill existing appointments with patient names from patient_profiles
UPDATE patient_appointments pa
SET patient_name = pp.full_name
FROM patient_profiles pp
WHERE pa.user_id = pp.id AND pa.patient_name IS NULL;