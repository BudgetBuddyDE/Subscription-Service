import dotenv from 'dotenv';
dotenv.config();
import { SupabaseClient, createClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient<any, 'public', any>;

export function getSupabaseInstance() {
    if (!supabaseInstance) {
        const { SUPABASE_ANON_KEY, SUPABASE_URL } = process.env;
        if (!SUPABASE_URL) throw new Error("Enviroment variable 'SUPABASE_URL' not found!");
        if (!SUPABASE_ANON_KEY) throw new Error("Enviroment variable 'SUPABASE_ANON_KEY' not found!");
        const SupabaseUrl = SUPABASE_URL as string;
        const SupabaseAnonKey = SUPABASE_ANON_KEY as string;
        supabaseInstance = createClient(SupabaseUrl, SupabaseAnonKey, {
            auth: { persistSession: false },
        });
    }
    return supabaseInstance;
}

export const supabase = getSupabaseInstance();
