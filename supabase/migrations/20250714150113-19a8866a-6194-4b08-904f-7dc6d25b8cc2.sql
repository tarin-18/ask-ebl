-- Create new profiles with 5-digit login IDs and passwords for real users
-- First, clear all existing profiles
DELETE FROM public.profiles;

-- Insert real users with 5-digit login IDs and passwords
INSERT INTO public.profiles (user_id, login_id, password, full_name, account_number, balance, savings_balance)
VALUES 
  ('12345678-1234-1234-1234-123456789012', '10001', 'bank123', 'Ahmed Hassan', '1001234567890', 125000.00, 50000.00),
  ('87654321-4321-4321-4321-210987654321', '10002', 'bank123', 'Fatima Rahman', '1002345678901', 87500.00, 75000.00),
  ('11111111-1111-1111-1111-111111111111', '10003', 'bank123', 'Mohammad Ali', '1003456789012', 45000.00, 25000.00),
  ('22222222-2222-2222-2222-222222222222', '10004', 'bank123', 'Ayesha Khan', '1004567890123', 156000.00, 120000.00),
  ('33333333-3333-3333-3333-333333333333', '10005', 'bank123', 'Omar Faruk', '1005678901234', 203000.00, 95000.00);