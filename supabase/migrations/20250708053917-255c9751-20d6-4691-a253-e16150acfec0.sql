-- Add 5 new users with banking data (corrected UUIDs)
INSERT INTO public.profiles (user_id, full_name, account_number, balance, savings_balance) VALUES
('11111111-2222-3333-4444-555555555555', 'Ahmed Rahman Khan', '2001234567', 156780.25, 89450.00),
('22222222-3333-4444-5555-666666666666', 'Fatima Sultana', '2001234568', 234567.50, 125300.75),
('33333333-4444-5555-6666-777777777777', 'Mohammad Ali Hasan', '2001234569', 98765.30, 56890.20),
('44444444-5555-6666-7777-888888888888', 'Rashida Begum', '2001234570', 345123.80, 198765.45),
('55555555-6666-7777-8888-999999999999', 'Karim Uddin Ahmed', '2001234571', 287654.90, 167432.15);

-- Add loan data for new users
INSERT INTO public.loans (user_id, loan_type, total_amount, paid_amount, remaining_amount, interest_rate, monthly_payment, next_payment_date) VALUES
('11111111-2222-3333-4444-555555555555', 'Car Loan', 1200000.00, 480000.00, 720000.00, 11.50, 18500.00, '2024-08-12'),
('11111111-2222-3333-4444-555555555555', 'Personal Loan', 300000.00, 120000.00, 180000.00, 14.25, 8900.00, '2024-08-05'),
('22222222-3333-4444-5555-666666666666', 'Home Loan', 3500000.00, 875000.00, 2625000.00, 9.25, 42300.00, '2024-08-20'),
('33333333-4444-5555-6666-777777777777', 'Education Loan', 800000.00, 160000.00, 640000.00, 8.75, 12800.00, '2024-08-18'),
('44444444-5555-6666-7777-888888888888', 'Business Loan', 1800000.00, 540000.00, 1260000.00, 12.50, 32500.00, '2024-08-25'),
('55555555-6666-7777-8888-999999999999', 'Car Loan', 950000.00, 285000.00, 665000.00, 11.75, 16200.00, '2024-08-08');

-- Add transaction history for new users
INSERT INTO public.transactions (user_id, transaction_type, amount, description, balance_after) VALUES
-- Ahmed Rahman Khan transactions
('11111111-2222-3333-4444-555555555555', 'Credit', 35000.00, 'Salary Deposit', 156780.25),
('11111111-2222-3333-4444-555555555555', 'Debit', -2500.00, 'ATM Withdrawal', 154280.25),
('11111111-2222-3333-4444-555555555555', 'Debit', -1200.00, 'Online Shopping', 153080.25),
('11111111-2222-3333-4444-555555555555', 'Credit', 3700.00, 'Investment Return', 156780.25),

-- Fatima Sultana transactions
('22222222-3333-4444-5555-666666666666', 'Credit', 42000.00, 'Business Income', 234567.50),
('22222222-3333-4444-5555-666666666666', 'Debit', -5000.00, 'Utility Bills', 229567.50),
('22222222-3333-4444-5555-666666666666', 'Debit', -1800.00, 'Grocery Shopping', 227767.50),
('22222222-3333-4444-5555-666666666666', 'Credit', 6800.00, 'Freelance Payment', 234567.50),

-- Mohammad Ali Hasan transactions
('33333333-4444-5555-6666-777777777777', 'Credit', 28000.00, 'Salary Deposit', 98765.30),
('33333333-4444-5555-6666-777777777777', 'Debit', -1500.00, 'Medical Bills', 97265.30),
('33333333-4444-5555-6666-777777777777', 'Debit', -500.00, 'Transport', 96765.30),
('33333333-4444-5555-6666-777777777777', 'Credit', 2000.00, 'Bonus', 98765.30),

-- Rashida Begum transactions
('44444444-5555-6666-7777-888888888888', 'Credit', 55000.00, 'Property Rent', 345123.80),
('44444444-5555-6666-7777-888888888888', 'Debit', -8000.00, 'Home Maintenance', 337123.80),
('44444444-5555-6666-7777-888888888888', 'Debit', -2500.00, 'Insurance Premium', 334623.80),
('44444444-5555-6666-7777-888888888888', 'Credit', 10500.00, 'Fixed Deposit Maturity', 345123.80),

-- Karim Uddin Ahmed transactions
('55555555-6666-7777-8888-999999999999', 'Credit', 48000.00, 'Business Revenue', 287654.90),
('55555555-6666-7777-8888-999999999999', 'Debit', -3500.00, 'Office Rent', 284154.90),
('55555555-6666-7777-8888-999999999999', 'Debit', -1200.00, 'Fuel Expenses', 282954.90),
('55555555-6666-7777-8888-999999999999', 'Credit', 4700.00, 'Client Payment', 287654.90);

-- Add 11 new FAQs including card services and other banking topics
INSERT INTO public.faqs (question, answer, keywords, category) VALUES
('What are the card services?', 'Eastern Bank offers comprehensive card services: 1) Debit Cards: Visa/Mastercard with ATM, POS, and online transaction facilities 2) Credit Cards: Various categories including Classic, Gold, Platinum with cashback and reward points 3) Prepaid Cards: For controlled spending and gifting 4) Corporate Cards: For business expenses 5) Student Cards: Special rates for students 6) Card Security: 24/7 fraud monitoring, SMS alerts, and instant card blocking via mobile app or hotline 16236.', ARRAY['card', 'debit', 'credit', 'services', 'visa', 'mastercard', 'prepaid'], 'Card Services'),

('How to report a lost or stolen card?', 'To report lost/stolen card: 1) Call our 24/7 hotline 16236 immediately 2) Use Mobile Banking App - go to Card Services > Block Card 3) Visit nearest branch with NID 4) Online Banking - Login > Card Management > Block Card. Your card will be blocked instantly to prevent misuse. Replacement card will be issued within 3-5 working days.', ARRAY['lost card', 'stolen card', 'block card', 'report', 'emergency'], 'Card Services'),

('What are the foreign exchange rates today?', 'Current foreign exchange rates (indicative): USD 1 = ৳109.50, EUR 1 = ৳118.75, GBP 1 = ৳138.20, SAR 1 = ৳29.15, AED 1 = ৳29.85. Rates are updated multiple times daily. For live rates and currency exchange, visit any branch or check our mobile app. We offer competitive rates for remittance and foreign currency exchange.', ARRAY['exchange rate', 'forex', 'usd', 'euro', 'pound', 'foreign currency', 'remittance'], 'Foreign Exchange'),

('How to get a bank statement?', 'You can get bank statements through: 1) Mobile Banking App - Account > Statements > Select period and download PDF 2) Internet Banking - Account Summary > Download Statement 3) ATM - Select Mini Statement option 4) Branch visit with account details 5) Request via SMS by sending STMT<space>Account Number to 16236. Statements available for up to 2 years.', ARRAY['statement', 'account statement', 'download', 'transaction history', 'pdf'], 'Account Services'),

('What are the minimum balance requirements?', 'Minimum balance requirements: Current Account - ৳10,000, Savings Account - ৳5,000, Student Account - ৳1,000, Senior Citizen Account - ৳2,000, Salary Account - ৳1,000, Premium Account - ৳100,000. Charges apply if balance falls below minimum: ৳200-500 depending on account type. Maintain required balance to avoid charges.', ARRAY['minimum balance', 'charges', 'account types', 'balance requirement'], 'Account Services'),

('How to apply for a checkbook?', 'To apply for checkbook: 1) Visit any branch with account details and NID 2) Fill checkbook application form 3) Pay applicable charges (৳150-300 depending on account type) 4) Checkbook ready in 2-3 working days 5) Also apply via Mobile Banking App > Services > Checkbook Request. Maximum 50 leaves per checkbook. Handle with care and report immediately if lost.', ARRAY['checkbook', 'cheque book', 'apply', 'request', 'charges'], 'Account Services'),

('What are the investment options available?', 'Investment options at Eastern Bank: 1) Fixed Deposits: 5.5%-7.5% return based on tenure 2) DPS (Monthly Savings): 6%-8% annual return 3) Mutual Funds: Equity and bond funds 4) Government Bonds: 4%-6% secure returns 5) Corporate Bonds: Higher returns with moderate risk 6) Foreign Currency Deposits: USD, EUR deposits 7) Gold Investment Scheme. Consult our investment advisors for personalized portfolio.', ARRAY['investment', 'fixed deposit', 'dps', 'mutual fund', 'bonds', 'portfolio'], 'Investment Services'),

('How to activate SMS banking?', 'To activate SMS Banking: 1) Send ACT<space>Account Number to 16236 2) Visit branch with NID and account details 3) Use Mobile Banking App > Settings > SMS Services 4) Call 16236 and request activation. Once active, get balance by sending BAL to 16236, mini statement by sending STMT, and transaction alerts automatically. Charges: ৳3 per SMS.', ARRAY['sms banking', 'activate', 'text banking', 'balance inquiry', 'alerts'], 'Mobile Banking'),

('What are the education loan benefits?', 'Education Loan benefits: 1) No collateral required up to ৳500,000 2) Competitive interest rates starting from 8% 3) Flexible repayment terms up to 10 years 4) Moratorium period during study + 6 months 5) Covers tuition fees, accommodation, books, laptop 6) Available for local and international education 7) Quick processing within 7-10 days 8) Parent/guardian as co-applicant accepted.', ARRAY['education loan', 'student loan', 'study', 'benefits', 'moratorium', 'collateral'], 'Loan Services'),

('How to open a joint account?', 'To open joint account: 1) All account holders must be present during opening 2) Required documents: NID/Passport of all holders, photographs, nominee details 3) Choose operation type: Either or Survivor, Joint operation required 4) Minimum deposit as per account type 5) All holders get separate debit cards and checkbooks 6) Any holder can operate account unless restrictions specified 7) Account accessible via mobile/internet banking by all holders.', ARRAY['joint account', 'multiple holders', 'either or survivor', 'operation', 'family account'], 'Account Opening'),

('What are the business banking services?', 'Business Banking services: 1) Current Account with overdraft facility 2) Trade Finance: LC, Bank Guarantee, Bill Discounting 3) Cash Management: Collection services, payroll management 4) Business Loans: Term loans, working capital, equipment financing 5) Corporate Cards for expense management 6) Treasury Services: Foreign exchange, hedging 7) Online Business Banking platform 8) Dedicated relationship manager for businesses above ৳10 crore turnover.', ARRAY['business banking', 'trade finance', 'cash management', 'corporate', 'overdraft', 'working capital'], 'Business Services');