-- Create popular_questions table
CREATE TABLE public.popular_questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT[],
    category TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.popular_questions ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing popular questions
CREATE POLICY "Popular questions are viewable by everyone" 
ON public.popular_questions 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_popular_questions_updated_at
BEFORE UPDATE ON public.popular_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial popular questions
INSERT INTO public.popular_questions (question, answer, keywords, category, display_order) VALUES
('What types of loans do you offer?', 'EBL offers various types of loans including: Personal Loans (up to 25 lakhs), Home Loans (up to 3 crores), Car Loans (up to 1 crore), Education Loans (up to 50 lakhs), and SME Loans for businesses. Interest rates start from 7.5% annually. Loan tenure ranges from 1 to 25 years depending on the type.', ARRAY['loan', 'types', 'personal', 'home', 'car', 'education', 'sme'], 'loans', 1),
('What types of accounts can I open?', 'EBL offers multiple account types: Savings Account (minimum balance 5,000 BDT), Current Account (minimum balance 25,000 BDT), Fixed Deposit Account (minimum 50,000 BDT), Special Savings Account for students and seniors, and Premium Banking Account for high-net-worth individuals. All accounts come with debit cards and online banking facilities.', ARRAY['account', 'savings', 'current', 'fixed', 'deposit', 'student', 'premium'], 'accounts', 2),
('How can I apply for a credit card?', 'To apply for an EBL credit card: 1) Visit any EBL branch or apply online, 2) Submit required documents (NID, income certificate, bank statement), 3) Minimum income requirement is 30,000 BDT/month, 4) Processing time is 7-10 working days. We offer Classic, Gold, and Platinum cards with various benefits including cashback, reward points, and travel insurance.', ARRAY['credit card', 'apply', 'documents', 'income', 'classic', 'gold', 'platinum'], 'credit cards', 3),
('What are your interest rates?', 'Current EBL interest rates: Savings Account (2-3%), Fixed Deposit (5-7%), Personal Loan (12-16%), Home Loan (7.5-10%), Car Loan (10-14%), Credit Card (24-30% annually). Rates may vary based on loan amount, tenure, and customer profile. Contact us for personalized rates.', ARRAY['interest', 'rates', 'savings', 'deposit', 'loan', 'credit card'], 'rates', 4),
('How do I activate mobile banking?', 'To activate EBL mobile banking: 1) Download EBL Skybanking app, 2) Visit any EBL branch with your account details and NID, 3) Fill the mobile banking application form, 4) Set your PIN and security questions, 5) Activation takes 24 hours. You can transfer money, pay bills, recharge mobile, and check balance 24/7.', ARRAY['mobile banking', 'skybanking', 'app', 'activate', 'pin', 'transfer', 'bills'], 'digital services', 5),
('What documents do I need?', 'Required documents vary by service: Account Opening: NID, 2 passport photos, income certificate. Loan Application: NID, income certificate, bank statements (6 months), trade license (for business). Credit Card: NID, salary certificate, bank statement. Foreign Exchange: NID, passport, visa, air ticket. All documents must be original with photocopies.', ARRAY['documents', 'nid', 'income', 'certificate', 'passport', 'photos', 'bank statement'], 'requirements', 6),
('How do I report a lost card?', 'If your EBL card is lost or stolen: 1) Call our 24/7 hotline immediately: 16227, 2) Report to the nearest police station, 3) Visit any EBL branch with police report and NID, 4) Apply for card replacement (fee: 500 BDT), 5) New card will be issued within 7 working days. Block your card immediately to prevent misuse.', ARRAY['lost card', 'stolen', 'report', 'hotline', '16227', 'replacement', 'block'], 'card services', 7),
('What are your service charges?', 'EBL service charges: ATM withdrawal (other banks): 10 BDT, SMS banking: 2 BDT/SMS, Account maintenance: 100-500 BDT annually, Cheque book: 200 BDT, Card replacement: 500 BDT, Statement request: 100 BDT, Online fund transfer: 5-15 BDT. Many services are free for premium account holders.', ARRAY['service charges', 'fees', 'atm', 'sms', 'maintenance', 'cheque', 'transfer'], 'charges', 8);