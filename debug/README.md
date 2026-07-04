Debugging Supabase locally

1) Install dependencies:

```bash
cd supabase-passbook
npm install
```

2) Run the debug script with environment variables (do NOT use production credentials):

```bash
SUPABASE_URL="https://<your-project>.supabase.co" \
SUPABASE_ANON_KEY="<anon-key>" \
TEST_EMAIL="test@example.com" \
TEST_PASSWORD="secret" \
  node debug/supabase_debug.js
```

On Windows (PowerShell):

```powershell
$env:SUPABASE_URL = 'https://<your-project>.supabase.co'
$env:SUPABASE_ANON_KEY = '<anon-key>'
$env:TEST_EMAIL = 'test@example.com'
$env:TEST_PASSWORD = 'secret'
node debug/supabase_debug.js
```

The script will sign in, attempt to insert a test expense and print responses and errors to help diagnose 403/RLS issues.
