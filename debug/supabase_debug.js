import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;

if(!SUPABASE_URL || !SUPABASE_ANON_KEY){
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}
if(!EMAIL || !PASSWORD){
  console.error('Missing TEST_EMAIL or TEST_PASSWORD environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main(){
  console.log('Signing in as', EMAIL);
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
  console.log('signInData:', signInData);
  console.log('signInError:', signInError);
  if(signInError){
    console.error('Sign-in failed:', signInError);
    process.exit(1);
  }

  // Ensure the client has the session set so subsequent requests include the access token
  if(signInData?.session){
    const { data: setData, error: setError } = await supabase.auth.setSession(signInData.session);
    console.log('setSession result:', { setData, setError });
    if(setError){
      console.error('setSession failed:', setError);
    }
  }

  const user = signInData?.session?.user || signInData?.user;
  console.log('User object:', user);
  if(!user){
    console.error('No user found in sign-in response');
    process.exit(1);
  }

  const expense = {
    description: 'Debug insert from local script',
    amount: 9.99,
    category: 'Debug',
    date: new Date().toISOString().slice(0,10)
  };

  console.log('Attempting insert with payload, user_id:', user.id);
  const { data: insertData, error: insertError } = await supabase.from('expenses').insert([{ ...expense, user_id: user.id }]).select();
  console.log('insertData:', insertData);
  console.log('insertError:', insertError);
  if(insertError){
    console.error('Insert failed:', insertError);
    process.exit(1);
  }

  console.log('Insert succeeded. Fetching rows for user...');
  const { data: rows, error: rowsErr } = await supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(5);
  console.log('rowsErr:', rowsErr);
  console.log('rows:', rows);
}

main().catch(err => { console.error(err); process.exit(1); });
