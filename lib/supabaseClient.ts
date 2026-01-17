
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const SUPABASE_URL = 'https://bgudiehufcvdbjaekxyu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndWRpZWh1ZmN2ZGJqYWVreHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDM5MjUsImV4cCI6MjA4NDExOTkyNX0.HjJbxhHaEhP4pDQ3fdYsoXKSmwZnBunzGEiTm_Bpks0';

// Conexão segura ao banco sistemanovo (schema public)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: 'public'
  }
});
