import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePopularQuestions = () => {
  return useQuery({
    queryKey: ["popular-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("popular_questions")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (error) {
        console.error("Error fetching popular questions:", error);
        throw error;
      }
      
      return data;
    }
  });
};