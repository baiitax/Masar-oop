# MASAR Deployment Checklist

## ✅ Pre-Deployment (Complete)

### Code & Configuration
- [x] Next.js 16.3.2 application built
- [x] 69 routes (62 static + 7 dynamic API)
- [x] Supabase client configured
- [x] Environment variables set in `.env.local`
- [x] `vercel.json` configured
- [x] Security headers configured
- [x] API routes created with authentication

### Database Schema
- [x] 16 migration files created
- [x] 60+ tables designed
- [x] Row Level Security policies defined
- [x] Database functions created
- [x] Analytics views created
- [x] Seed data prepared

### Protocol Engine
- [x] Transaction state machine
- [x] KYB automation engine
- [x] Compliance engine
- [x] Inspection integration
- [x] Release engine
- [x] Settlement waterfall
- [x] Audit trail with hash chain

---

## 🚀 Deployment Steps

### Step 1: Supabase Database Setup

#### 1.1 Run Migrations
Go to **Supabase Dashboard → SQL Editor** and execute each migration in order:

```sql
-- Copy and paste each file content:
-- 1. supabase/migrations/001_extensions.sql
-- 2. supabase/migrations/002_profiles.sql
-- 3. supabase/migrations/003_organizations.sql
-- 4. supabase/migrations/004_roles_permissions.sql
-- 5. supabase/migrations/005_memberships.sql
-- 6. supabase/migrations/006_trade_core.sql
-- 7. supabase/migrations/007_protocol.sql
-- 8. supabase/migrations/008_kyb.sql
-- 9. supabase/migrations/009_compliance.sql
-- 10. supabase/migrations/010_inspection.sql
-- 11. supabase/migrations/011_finance.sql
-- 12. supabase/migrations/012_logistics.sql
-- 13. supabase/migrations/013_tasks_notifications.sql
-- 14. supabase/migrations/014_audit.sql
-- 15. supabase/migrations/015_integrations.sql
-- 16. supabase/migrations/016_analytics.sql
```

#### 1.2 Apply Seed Data
```sql
-- Execute: supabase/seed.sql
```

#### 1.3 Create Storage Buckets
Go to **Supabase Dashboard → Storage** and create:

| Bucket Name | Public | Purpose |
|-------------|--------|---------|
| `kyb-documents` | No | KYB verification documents |
| `compliance-documents` | No | Trade compliance documents |
| `inspection-reports` | No | Inspection reports |
| `lab-results` | No | Laboratory results |
| `contracts` | No | Trade contracts |
| `invoices` | No | Invoices and e-invoices |
| `audit-evidence` | No | Audit evidence |
| `avatars` | Yes | User profile pictures |

#### 1.4 Configure Storage Policies
For each private bucket, add policy:
- **Policy name**: `Authenticated users can upload`
- **Allowed operations**: `INSERT`
- **Target roles**: `authenticated`
- **USING expression**: `true`

- **Policy name**: `Users can view own organization files`
- **Allowed operations**: `SELECT`
- **Target roles**: `authenticated`
- **USING expression**: `(storage.foldername(name))[1] = auth.uid()::text OR (storage.foldername(name))[1] IN (SELECT organization_id::text FROM organization_members WHERE user_id = auth.uid()))`

#### 1.5 Create Demo Users
Go to **Supabase Dashboard → Authentication → Users** and create:

| Email | Password | Role |
|-------|----------|------|
| `demo.ceo@masar.local` | `MasarDemo2026!` | CEO |
| `demo.operations@masar.local` | `MasarDemo2026!` | Operations |
| `demo.compliance@masar.local` | `MasarDemo2026!` | Compliance |
| `demo.finance@masar.local` | `MasarDemo2026!` | Trade Finance |
| `demo.buyer@masar.local` | `MasarDemo2026!` | Buyer |
| `demo.exporter@masar.local` | `MasarDemo2026!` | Exporter |
| `demo.inspector@masar.local` | `MasarDemo2026!` | Inspector |
| `demo.auditor@masar.local` | `MasarDemo2026!` | Auditor |

After creating users, run this SQL to set up profiles and memberships:
```sql
-- Link demo users to organizations
INSERT INTO organization_members (organization_id, user_id, role_id, status, is_primary)
SELECT 
  o.id,
  p.auth_user_id,
  r.id,
  'active',
  true
FROM profiles p
CROSS JOIN organizations o
CROSS JOIN roles r
WHERE p.email LIKE 'demo.%@masar.local'
AND o.legal_name = 'MASAR Platform'
AND r.code = CASE 
  WHEN p.email = 'demo.ceo@masar.local' THEN 'CEO'
  WHEN p.email = 'demo.operations@masar.local' THEN 'OPERATIONS'
  WHEN p.email = 'demo.compliance@masar.local' THEN 'COMPLIANCE'
  WHEN p.email = 'demo.finance@masar.local' THEN 'TRADE_FINANCE'
  WHEN p.email = 'demo.buyer@masar.local' THEN 'BUYER_USER'
  WHEN p.email = 'demo.exporter@masar.local' THEN 'EXPORTER_USER'
  WHEN p.email = 'demo.inspector@masar.local' THEN 'INSPECTOR'
  WHEN p.email = 'demo.auditor@masar.local' THEN 'AUDITOR'
END;
```

---

### Step 2: Vercel Deployment

#### 2.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import `baiitax/Masar-oop` from GitHub
4. Vercel will auto-detect Next.js

#### 2.2 Configure Environment Variables
In **Vercel Dashboard → Settings → Environment Variables**, add:

| Variable | Value | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lsqxohcpgwkoujdcuhmc.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDg0NTIsImV4cCI6MjEwMzE4NDQ1Mn0.cWhKaT6Xnbz6MPRGhyffWzrtnhXfpMoOdJ21WKiANTo` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYwODQ1MiwiZXhwIjoyMTAzMTg0NDUyfQ.1Imph0MQtT_jplS_9RnjpOl-oTy5ZKAO9B707l1-0eA` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://masar.vercel.app` | Production |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `2348141815466` | Production, Preview, Development |

#### 2.3 Deploy
Click "Deploy" and wait for build to complete (~2 minutes)

---

### Step 3: Post-Deployment Verification

#### 3.1 Health Check
```bash
curl https://masar.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "MASAR Protocol",
  "version": "1.0.0",
  "timestamp": "2026-08-29T...",
  "environment": "production"
}
```

#### 3.2 Test Authentication
1. Go to `https://masar.vercel.app/auth`
2. Sign in with `demo.ceo@masar.local` / `MasarDemo2026!`
3. Should redirect to executive dashboard

#### 3.3 Test API Endpoints
```bash
# Get auth token first (from browser console after login)
TOKEN="your_auth_token"

# Test notifications
curl -H "Authorization: Bearer $TOKEN" https://masar.vercel.app/api/notifications

# Test search
curl -H "Authorization: Bearer $TOKEN" "https://masar.vercel.app/api/search?q=MASAR"
```

#### 3.4 Test Role-Based Access
- [ ] CEO sees executive dashboard
- [ ] Operations sees operations dashboard
- [ ] Compliance sees KYB and compliance pages
- [ ] Finance sees funding and settlement pages
- [ ] Buyer sees buyer portal
- [ ] Exporter sees exporter portal
- [ ] Auditor sees read-only audit view

#### 3.5 Test RLS Security
- [ ] Buyer cannot see other buyers' transactions
- [ ] Exporter cannot see other exporters' data
- [ ] Unauthorized user cannot access admin pages
- [ ] API returns 401/403 for unauthorized requests

---

## 🔒 Security Verification

### Server-Side Security
- [x] Service role key only in server-side code
- [x] Service role key not in client bundle
- [x] API routes verify authentication
- [x] Webhooks validate signatures
- [x] Idempotency checks on webhooks

### Database Security
- [x] RLS enabled on all sensitive tables
- [x] Policies enforce tenant isolation
- [x] Audit logs are append-only
- [x] Financial records immutable

### Application Security
- [x] Security headers configured
- [x] CORS properly configured
- [x] Input validation on API routes
- [x] SQL injection prevented (Supabase client)

---

## 📊 Monitoring Setup

### Vercel Analytics
1. Go to **Vercel Dashboard → Analytics**
2. Enable Web Vitals
3. Enable Speed Insights

### Supabase Monitoring
1. Go to **Supabase Dashboard → Reports**
2. Monitor database performance
3. Check API usage
4. Review authentication logs

### Error Tracking (Optional)
Consider adding:
- Sentry for error tracking
- LogRocket for session replay

---

## 🎯 Production URLs

| Service | URL |
|---------|-----|
| **Application** | `https://masar.vercel.app` |
| **Preview** | `https://masar-git-main.vercel.app` |
| **GitHub** | `https://github.com/baiitax/Masar-oop` |
| **Supabase** | `https://lsqxohcpgwkoujdcuhmc.supabase.co` |
| **Health Check** | `https://masar.vercel.app/api/health` |

---

## 📞 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| CEO | `demo.ceo@masar.local` | `MasarDemo2026!` |
| Operations | `demo.operations@masar.local` | `MasarDemo2026!` |
| Compliance | `demo.compliance@masar.local` | `MasarDemo2026!` |
| Finance | `demo.finance@masar.local` | `MasarDemo2026!` |
| Buyer | `demo.buyer@masar.local` | `MasarDemo2026!` |
| Exporter | `demo.exporter@masar.local` | `MasarDemo2026!` |
| Inspector | `demo.inspector@masar.local` | `MasarDemo2026!` |
| Auditor | `demo.auditor@masar.local` | `MasarDemo2026!` |

---

## 🎉 Deployment Complete!

Once all steps are verified, the MASAR platform is **LIVE** and ready for:

✅ **Real transactions** between buyers and exporters  
✅ **KYB verification** with sanctions screening  
✅ **Compliance automation** with document management  
✅ **Inspection integration** with quality scoring  
✅ **Finance tracking** with escrow management  
✅ **Release automation** with human approval  
✅ **Settlement processing** with waterfall distribution  
✅ **Complete audit trail** for every action  

---

**MASAR — THE PATH**

Verify. Comply. Inspect. Finance. Settle.

Trust is engineered.
