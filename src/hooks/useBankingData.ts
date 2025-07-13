import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Map 5-digit user IDs to actual database user IDs
const USER_ID_MAP: Record<string, string> = {
  '12345': '12345678-1234-1234-1234-123456789012',
  '67890': '87654321-4321-4321-4321-210987654321',
  '11111': '11111111-1111-1111-1111-111111111111',
  '22222': '22222222-2222-2222-2222-222222222222',
  '33333': '33333333-3333-3333-3333-333333333333'
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
      if (!userLoginId || !USER_ID_MAP[userLoginId]) {
        throw new Error('Invalid user ID');
      }
      
      const dbUserId = USER_ID_MAP[userLoginId];
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', dbUserId)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userLoginId && !!USER_ID_MAP[userLoginId]
  });
}

export function useLoans(userLoginId: string | null) {
  return useQuery({
    queryKey: ['loans', userLoginId],
    queryFn: async () => {
      if (!userLoginId || !USER_ID_MAP[userLoginId]) {
        throw new Error('Invalid user ID');
      }
      
      const dbUserId = USER_ID_MAP[userLoginId];
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', dbUserId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Loan[];
    },
    enabled: !!userLoginId && !!USER_ID_MAP[userLoginId]
  });
}

export function useTransactions(userLoginId: string | null, limit = 10) {
  return useQuery({
    queryKey: ['transactions', userLoginId, limit],
    queryFn: async () => {
      if (!userLoginId || !USER_ID_MAP[userLoginId]) {
        throw new Error('Invalid user ID');
      }
      
      const dbUserId = USER_ID_MAP[userLoginId];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', dbUserId)
        .order('transaction_date', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!userLoginId && !!USER_ID_MAP[userLoginId]
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