-- Update existing profiles with actual 5-digit login IDs and passwords
UPDATE public.profiles 
SET 
  login_id = '12345',
  password = 'demo123'
WHERE login_id IS NULL 
  AND user_id = '12345678-1234-1234-1234-123456789012';

UPDATE public.profiles 
SET 
  login_id = '67890',
  password = 'demo123'
WHERE login_id IS NULL 
  AND user_id = '87654321-4321-4321-4321-210987654321';

UPDATE public.profiles 
SET 
  login_id = '11111',
  password = 'demo123'
WHERE login_id IS NULL 
  AND user_id = '11111111-1111-1111-1111-111111111111';

UPDATE public.profiles 
SET 
  login_id = '22222',
  password = 'demo123'
WHERE login_id IS NULL 
  AND user_id = '22222222-2222-2222-2222-222222222222';

UPDATE public.profiles 
SET 
  login_id = '33333',
  password = 'demo123'
WHERE login_id IS NULL 
  AND user_id = '33333333-3333-3333-3333-333333333333';

-- Make login_id required for future records
ALTER TABLE public.profiles 
ALTER COLUMN login_id SET NOT NULL;