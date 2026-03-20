import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn("⚠️  SUPABASE_URL or SUPABASE_SERVICE_KEY not set");
}

// service_role key — 서버 전용, 클라이언트에 노출 금지
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
