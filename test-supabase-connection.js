import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in environment variables');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

console.log('🔍 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection by listing tables
async function testConnection() {
  try {
    console.log('\n📊 Checking database schema...');
    
    // Try to query the workspace table (should exist based on schema)
    const { data, error } = await supabase
      .from('workspace')
      .select('id, name')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('📁 Workspace table accessible');
    
    if (data && data.length > 0) {
      console.log(`📋 Found ${data.length} workspace(s):`, data);
    } else {
      console.log('📋 No workspaces found (database is empty)');
    }
    
    // Test other core tables
    const tables = ['program', 'asset', 'vulnerability_class', 'methodology', 'playbook'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (error) {
          console.log(`⚠️  Table '${table}': ${error.message}`);
        } else {
          console.log(`✅ Table '${table}': accessible`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Details:', error);
    return false;
  }
  
  return true;
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase is properly configured and accessible!');
  } else {
    console.log('\n💥 Supabase connection test failed');
    process.exit(1);
  }
});
