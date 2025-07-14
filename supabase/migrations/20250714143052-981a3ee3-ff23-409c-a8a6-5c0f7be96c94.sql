-- Add login_id and password columns to profiles table for 5-digit user authentication
ALTER TABLE public.profiles 
ADD COLUMN login_id TEXT UNIQUE,
ADD COLUMN password TEXT;

-- Update existing profiles with 5-digit login IDs and passwords
UPDATE public.profiles 
SET 
  login_id = CASE 
    WHEN id::text LIKE '%1%' THEN '12345'
    WHEN id::text LIKE '%2%' THEN '67890'
    WHEN id::text LIKE '%3%' THEN '11111'
    WHEN id::text LIKE '%4%' THEN '22222'
    ELSE '33333'
  END,
  password = 'demo123'
WHERE login_id IS NULL;

-- Make login_id required for new records
ALTER TABLE public.profiles 
ALTER COLUMN login_id SET NOT NULL;

-- Create index for faster login queries
CREATE INDEX idx_profiles_login_id ON public.profiles(login_id);