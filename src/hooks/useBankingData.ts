import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Get user ID from login_id in database
const getUserIdFromLoginId = async (loginId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('login_id', loginId)
    .single();
  
  if (error || !data) return null;
  return data.user_id;
};

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

export function useProfile(userLoginId: string | null) {
  return useQuery({
    queryKey: ['profile', userLoginId],
    queryFn: async () => {
      if (!userLoginId) {
        throw new Error('Invalid user ID');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('login_id', userLoginId)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userLoginId
  });
}

export function useLoans(userLoginId: string | null) {
  return useQuery({
    queryKey: ['loans', userLoginId],
    queryFn: async () => {
      if (!userLoginId) {
        throw new Error('Invalid user ID');
      }
      
      const userId = await getUserIdFromLoginId(userLoginId);
      if (!userId) throw new Error('User not found');
      
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Loan[];
    },
    enabled: !!userLoginId
  });
}

export function useTransactions(userLoginId: string | null, limit = 10) {
  return useQuery({
    queryKey: ['transactions', userLoginId, limit],
    queryFn: async () => {
      if (!userLoginId) {
        throw new Error('Invalid user ID');
      }
      
      const userId = await getUserIdFromLoginId(userLoginId);
      if (!userId) throw new Error('User not found');
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('transaction_date', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!userLoginId
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