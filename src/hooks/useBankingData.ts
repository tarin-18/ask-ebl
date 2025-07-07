import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Demo user ID - in real app this would come from auth
const DEMO_USER_ID = '12345678-1234-1234-1234-123456789012';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  account_number: string | null;
  balance: number;
  savings_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  user_id: string;
  loan_type: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  interest_rate: number;
  monthly_payment: number;
  next_payment_date: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  description: string | null;
  balance_after: number | null;
  transaction_date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  keywords: string[] | null;
  category: string | null;
  created_at: string;
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile', DEMO_USER_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .single();
      
      if (error) throw error;
      return data as Profile;
    }
  });
}

export function useLoans() {
  return useQuery({
    queryKey: ['loans', DEMO_USER_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Loan[];
    }
  });
}

export function useTransactions(limit = 10) {
  return useQuery({
    queryKey: ['transactions', DEMO_USER_ID, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .order('transaction_date', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as Transaction[];
    }
  });
}

export function useFAQs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as FAQ[];
    }
  });
}