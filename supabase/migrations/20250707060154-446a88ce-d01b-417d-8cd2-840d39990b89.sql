-- Create profiles table for user banking information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  account_number TEXT,
  balance DECIMAL(12,2) DEFAULT 0.00,
  savings_balance DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loans table
CREATE TABLE public.loans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  loan_type TEXT NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) DEFAULT 0.00,
  remaining_amount DECIMAL(12,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  monthly_payment DECIMAL(10,2) NOT NULL,
  next_payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  balance_after DECIMAL(12,2),
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create FAQ table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[],
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for loans
CREATE POLICY "Users can view their own loans" 
ON public.loans 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policies for FAQs (public read access)
CREATE POLICY "FAQs are viewable by everyone" 
ON public.faqs 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample FAQ data
INSERT INTO public.faqs (question, answer, keywords, category) VALUES
('What is the ATM withdrawal limit?', 'The daily ATM withdrawal limit is ৳50,000 for current accounts and ৳30,000 for savings accounts. You can withdraw up to ৳2,00,000 per day from Eastern Bank ATMs.', ARRAY['atm', 'withdrawal', 'limit', 'daily'], 'ATM Services'),
('What are the bank operating hours?', 'Eastern Bank branches are open from 9:00 AM to 5:00 PM, Sunday to Thursday. Our ATM services are available 24/7.', ARRAY['hours', 'timing', 'open', 'branch', 'operating'], 'Branch Services'),
('How can I check my account balance?', 'You can check your balance through: 1) Mobile Banking App 2) Internet Banking 3) ATM 4) SMS Banking by sending BAL to 16236 5) Calling our hotline 16236', ARRAY['balance', 'check', 'account', 'mobile', 'internet', 'sms'], 'Account Services'),
('What are the current interest rates?', 'Current savings account interest rate is 3.5% per annum. Fixed deposit rates range from 5.5% to 7.5% depending on the tenure. Loan interest rates start from 9.5%.', ARRAY['interest', 'rate', 'savings', 'fixed', 'deposit', 'loan'], 'Interest Rates'),
('How do I apply for a loan?', 'To apply for a loan: 1) Visit any Eastern Bank branch 2) Bring required documents (NID, salary certificate, bank statements) 3) Fill out the loan application form 4) Our officers will process your application within 7-10 working days.', ARRAY['loan', 'apply', 'application', 'documents', 'process'], 'Loan Services'),
('What are the charges for money transfer?', 'Local money transfer charges: ৳10 for amounts up to ৳10,000, ৳25 for amounts above ৳10,000. International remittance charges vary by destination country, starting from ৳500.', ARRAY['transfer', 'money', 'charges', 'remittance', 'international', 'local'], 'Transfer Services'),
('How to activate mobile banking?', 'To activate mobile banking: 1) Download Eastern Bank Mobile App 2) Register with your account number and mobile number 3) Verify through OTP 4) Set your PIN 5) Start banking instantly!', ARRAY['mobile banking', 'activate', 'app', 'register', 'otp', 'pin'], 'Mobile Banking'),
('What documents are needed to open an account?', 'Required documents: 1) Original NID/Passport 2) 2 copies of NID/Passport 3) 2 passport size photos 4) Salary certificate or business documents 5) Minimum initial deposit as per account type.', ARRAY['documents', 'open account', 'nid', 'passport', 'photo', 'salary'], 'Account Opening');

-- Insert demo user data (this would normally be created through authentication)
-- For demo purposes, we'll use a fixed UUID
INSERT INTO public.profiles (user_id, full_name, account_number, balance, savings_balance) VALUES
('demo-user-id', 'Demo User', '1234567890', 125000.50, 75000.00);

INSERT INTO public.loans (user_id, loan_type, total_amount, paid_amount, remaining_amount, interest_rate, monthly_payment, next_payment_date) VALUES
('demo-user-id', 'Home Loan', 2500000.00, 350000.00, 2150000.00, 9.50, 28500.00, '2024-08-15'),
('demo-user-id', 'Car Loan', 800000.00, 320000.00, 480000.00, 12.00, 15200.00, '2024-08-10');

INSERT INTO public.transactions (user_id, transaction_type, amount, description, balance_after) VALUES
('demo-user-id', 'Credit', 25000.00, 'Salary Deposit', 125000.50),
('demo-user-id', 'Debit', -1500.00, 'ATM Withdrawal', 123500.50),
('demo-user-id', 'Debit', -850.00, 'Online Purchase', 122650.50),
('demo-user-id', 'Credit', 2500.00, 'Interest Credit', 125150.50),
('demo-user-id', 'Debit', -150.00, 'Service Charge', 125000.50);