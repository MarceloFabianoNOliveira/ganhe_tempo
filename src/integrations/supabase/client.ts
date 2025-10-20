
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eecddvzcmcufielioybt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlY2RkdnpjbWN1ZmllbGlveWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDk5MDUsImV4cCI6MjA2NTU4NTkwNX0.TxXuQ_xGF9rRw8eYATts6GNrUhrG5EJZkx6BoigYUzo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
