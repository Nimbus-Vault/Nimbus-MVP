import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Supabase client setup
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Helper function for formatting Supabase errors
export function formatError(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.error_description) {
    return error.error_description;
  }

  if (error.details) {
    return error.details;
  }

  return 'An unknown error occurred';
}

// Function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(supabaseUrl && supabaseKey);
};