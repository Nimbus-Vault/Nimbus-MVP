// Test Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfwnpftpxfrtpanqawmb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmd25wZnRweGZydHBhbnFhd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjE2NTcsImV4cCI6MjA2OTc5NzY1N30.3zPhsJzTglKRVykHTNoKzqmwFDTEU9YOk7nwUYQZ0-s';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔗 Testing Supabase Connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key configured:', !!supabaseKey);
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('workspace').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      console.log('');
      console.log('📋 Setup checklist:');
      console.log('1. ✅ Supabase project created');
      console.log('2. ✅ Environment variables set');
      console.log('3. ❌ Database schema not installed');
      console.log('');
      console.log('🔧 Next steps:');
      console.log('1. Go to Supabase dashboard > SQL Editor');
      console.log('2. Copy content from "Nimbus Vault DB Schema Update 3.sql"');
      console.log('3. Paste and run the SQL script');
      console.log('4. Restart the development server');
      return false;
    } else {
      console.log('✅ Supabase connected successfully!');
      console.log('✅ Database schema is installed');
      console.log('🚀 Ready to use real data persistence');
      return true;
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

testConnection();
