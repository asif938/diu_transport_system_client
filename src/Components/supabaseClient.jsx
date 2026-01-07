import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://beoxxmatkgvbaorlqstt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_KIOmUx0ty7ruShVy05QT7w_UiSj_hJ1"; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    fetch: (url, options = {}) =>
      fetch(url, { ...options, cache: "no-store" }),
  },
});
