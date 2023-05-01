import { SUPABASE_API_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false }
});
const supabasePublic = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export { supabaseAdmin, supabasePublic };
