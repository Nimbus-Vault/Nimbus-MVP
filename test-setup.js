// Test script to verify Supabase setup
import { isSupabaseConfigured } from './src/lib/supabase.js';

console.log('=== Nimbus Vault Setup Test ===');
console.log('Environment Variables:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || 'Not set');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
console.log('Supabase Configured:', isSupabaseConfigured());

if (isSupabaseConfigured()) {
  console.log('✅ Supabase is configured - will use remote database');
} else {
  console.log('⚠️  Supabase not configured - will use local storage');
}

console.log('\nNext steps:');
if (!isSupabaseConfigured()) {
  console.log('1. Create a Supabase project at https://supabase.com');
  console.log('2. Update .env file with your project credentials');
  console.log('3. Run the database schema in Supabase SQL Editor');
  console.log('4. Restart the development server');
} else {
  console.log('1. Verify database schema is installed');
  console.log('2. Test creating data in the application');
  console.log('3. Check Supabase dashboard for data');
}
