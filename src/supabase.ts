import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("Enviroment variable 'SUPABASE_URL' not found!");
if (!supabaseAnonKey) throw new Error("Enviroment variable 'SUPABASE_ANON_KEY' not found!");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
