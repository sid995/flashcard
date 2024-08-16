// hooks/useSupabase.ts
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

export const useSupabase = () => {
  const [instance] = useState(() => {
    if (supabase === null) {
      supabase = createClient();
    }
    return supabase;
  });

  return instance;
};
