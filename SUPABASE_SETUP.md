# MASAR Supabase Setup Guide

## 🚀 Quick Setup

### Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name:** masar-production
   - **Database Password:** (strong password - save this!)
   - **Region:** Choose closest to your users (e.g., Middle East for Saudi users)
4. Click "Create Project"

### Step 2: Get API Keys

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxxxxxxxxx.supabase.co`
   - **Anon/Public Key:** `eyJhbGciOiJIUzI1NiIs...`
   - **Service Role Key:** `eyJhbGciOiJIUzI1NiIs...` (keep this secret!)

### Step 3: Update Environment Variables

Edit `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Click "Run" to execute

This will create:
- ✅ All database tables
- ✅ Row Level Security policies
- ✅ Database functions
- ✅ Indexes
- ✅ Seed data

### Step 5: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider:
   - ✅ Confirm email: ON
   - ✅ Secure email change: ON
3. (Optional) Enable **Google** provider:
   - Get OAuth credentials from Google Cloud Console
   - Add Client ID and Secret
4. (Optional) Enable **GitHub** provider:
   - Create OAuth App in GitHub Settings
   - Add Client ID and Secret

### Step 6: Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize:
   - **Confirm signup** — Welcome email
   - **Magic Link** — Login link
   - **Change Email Address** — Email change confirmation
   - **Reset Password** — Password reset

### Step 7: Set Up Storage (Optional)

1. Go to **Storage**
2. Create buckets:
   - `documents` — For transaction documents
   - `avatars` — For user avatars
   - `reports` — For inspection reports
3. Set up RLS policies for each bucket

### Step 8: Configure Realtime (Optional)

1. Go to **Database** → **Replication**
2. Enable for tables:
   - `transactions`
   - `notifications`
   - `exceptions`

---

## 🔐 Security Checklist

- [ ] RLS is enabled on all tables
- [ ] Service role key is NOT exposed to client
- [ ] Email confirmation is enabled
- [ ] Password requirements are set (min 8 chars)
- [ ] Rate limiting is configured
- [ ] API keys are rotated regularly

---

## 📊 Database Schema Overview

```
profiles (users)
├── organizations
│   ├── buyers
│   ├── exporters
│   ├── partners
│   └── organization_members
├── transactions
│   ├── transaction_timeline
│   ├── documents
│   ├── inspections
│   │   └── inspection_results
│   ├── shipments
│   ├── finance_requests
│   ├── escrow_instructions
│   ├── settlements
│   ├── invoices
│   ├── exceptions
│   └── risk_assessments
├── rfqs
├── audit_events
├── notifications
└── disputes
```

---

## 🧪 Testing

### Test User Registration

```sql
-- Check if user was created
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Check profile
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;
```

### Test Transaction Creation

```sql
-- Insert test buyer
INSERT INTO organizations (legal_name, trading_name, country, org_type)
VALUES ('Test Buyer Co', 'TestBuyer', 'SA', 'buyer');

-- Insert test transaction
INSERT INTO transactions (masar_id, buyer_id, exporter_id, commodity_id, quantity, contract_value, status)
VALUES ('MASAR-SES-2026-TEST01', 'buyer-uuid', 'exporter-uuid', 'commodity-uuid', '100 MT', 185000, 'DRAFT');
```

---

## 🚀 Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

### Supabase Production Settings

1. **Database:**
   - Enable Point-in-Time Recovery
   - Set up daily backups
   - Configure connection pooling

2. **Auth:**
   - Set Site URL to production domain
   - Add redirect URLs
   - Enable MFA (optional)

3. **API:**
   - Disable unused API endpoints
   - Set up rate limiting
   - Enable CORS for your domain only

---

## 📈 Monitoring

### Supabase Dashboard

- **Database:** Monitor queries, connections, storage
- **Auth:** Track signups, logins, active users
- **API:** Monitor request volume, errors
- **Storage:** Track file uploads, bandwidth

### Custom Monitoring

Add to your app:

```typescript
// Log performance metrics
const startTime = performance.now();
// ... database query
const endTime = performance.now();
console.log(`Query took ${endTime - startTime}ms`);
```

---

## 🆘 Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Check `.env.local` values
   - Restart dev server after changes

2. **"Row Level Security violation"**
   - Check RLS policies
   - Verify user is authenticated

3. **"relation does not exist"**
   - Run schema.sql in SQL Editor
   - Check for typos in table names

4. **"permission denied"**
   - Check user role
   - Verify RLS policies

---

## 📞 Support

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **MASAR Support:** info@masar.sa
