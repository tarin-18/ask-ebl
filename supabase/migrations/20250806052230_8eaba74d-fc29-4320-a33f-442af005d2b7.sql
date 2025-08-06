-- Create suggested_faqs table for user question suggestions
CREATE TABLE public.suggested_faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  suggested_by_session TEXT NOT NULL, -- We'll use a session ID since there's no user auth
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_response TEXT,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for suggested_faqs
ALTER TABLE public.suggested_faqs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert suggestions
CREATE POLICY "Anyone can suggest FAQs" 
ON public.suggested_faqs 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to view their own suggestions (by session)
CREATE POLICY "Users can view their own suggestions" 
ON public.suggested_faqs 
FOR SELECT 
USING (true); -- For now, allow viewing all suggestions

-- Create index for better performance
CREATE INDEX idx_suggested_faqs_status ON public.suggested_faqs(status);
CREATE INDEX idx_suggested_faqs_session ON public.suggested_faqs(suggested_by_session);