# MASAR Vercel Environment Setup Guide

## Complete Step-by-Step Configuration for Supabase + Vercel

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Get Supabase Credentials](#get-supabase-credentials)
4. [Vercel Project Setup](#vercel-project-setup)
5. [Configure Environment Variables](#configure-environment-variables)
6. [Database Migrations](#database-migrations)
7. [Storage Configuration](#storage-configuration)
8. [Authentication Setup](#authentication-setup)
9. [Deploy to Production](#deploy-to-production)
10. [Verification Checklist](#verification-checklist)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Prerequisites

Before starting, ensure you have:

- [x] GitHub account with access to `baiitax/Masar-oop`
- [x] Vercel account (free tier works)
- [x] Supabase project created
- [x] Node.js 18+ installed locally

---

## 🔷 Supabase Project Setup

### Step 1: Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Sign in with your account
3. Select your project: `lsqxohcpgwkoujdcuhmc`

### Step 2: Get Project URL

1. Go to **Settings** → **API**
2. Copy the **Project URL**:
   ```
   https://lsqxohcpgwkoujdcuhmc.supabase.co
   ```

### Step 3: Get API Keys

In **Settings** → **API**, you'll find two keys:

#### Anon/Public Key (Safe for Browser)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDg0NTIsImV4cCI6MjEwMzE4NDQ1Mn0.cWhKaT6Xnbz6MPRGhyffWzrtnhXfpMoOdJ21WKiANTo
```

⚠️ **This key is safe to use in browser code.** It respects Row Level Security (RLS) policies.

#### Service Role Key (Server-Side Only)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYwODQ1MiwiZXhwIjoyMTAzMTg0NDUyfQ.1Imph0MQtT_jplS_9RnjpOl-oTy5ZKAO9B707l1-0eA
```

🚨 **CRITICAL: This key BYPASSES all Row Level Security!** 
- NEVER expose it in browser code
- NEVER commit it to Git
- NEVER use it in `NEXT_PUBLIC_*` variables
- ONLY use it in server-side API routes

---

## 🔷 Vercel Project Setup

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import `baiitax/Masar-oop` from GitHub
4. Vercel will auto-detect Next.js framework

### Step 2: Configure Project Settings

- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

---

## 🔷 Configure Environment Variables

### Step 1: Open Environment Variables

1. In Vercel Dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. You'll see three environments:
   - **Production**: Live site (`masar.vercel.app`)
   - **Preview**: PR previews
   - **Development**: Local development

### Step 2: Add Variables One by One

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL

| Field | Value |
|-------|-------|
| **Key** | `NEXT_PUBLIC_SUPABASE_URL` |
| **Value** | `https://lsqxohcpgwkoujdcuhmc.supabase.co` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

Click **"Save"**

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

| Field | Value |
|-------|-------|
| **Key** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Value** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDg0NTIsImV4cCI6MjEwMzE4NDQ1Mn0.cWhKaT6Xnbz6MPRGhyffWzrtnhXfpMoOdJ21WKiANTo` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

Click **"Save"**

#### Variable 3: SUPABASE_SERVICE_ROLE_KEY ⚠️

| Field | Value |
|-------|-------|
| **Key** | `SUPABASE_SERVICE_ROLE_KEY` |
| **Value** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYwODQ1MiwiZXhwIjoyMTAzMTg0NDUyfQ.1Imph0MQtT_jplS_9RnjpOl-oTy5ZKAO9B707l1-0eA` |
| **Environments** | ✅ Production, ✅ Preview, ❌ Development |

Click **"Save"**

#### Variable 4: NEXT_PUBLIC_APP_URL

| Field | Value |
|-------|-------|
| **Key** | `NEXT_PUBLIC_APP_URL` |
| **Value (Production)** | `https://masar.vercel.app` |
| **Value (Preview)** | `https://masar-git-main.vercel.app` |
| **Value (Development)** | `http://localhost:3000` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

Click **"Save"**

#### Variable 5: NEXT_PUBLIC_WHATSAPP_NUMBER

| Field | Value |
|-------|-------|
| **Key** | `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| **Value** | `2348141815466` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

Click **"Save"**

#### Variable 6: NEXT_PUBLIC_APP_NAME

| Field | Value |
|-------|-------|
| **Key** | `NEXT_PUBLIC_APP_NAME` |
| **Value** | `MASAR` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

Click **"Save"**

#### Variable 7: NEXT_PUBLIC_APP_VERSION

| Field | Value |
|-------|-------|
| **Key** | `NEXT_PUBLIC_APP_VERSION` |
| **Value** | `1.0.0` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

Click **"Save"**

---

## 🔷 Environment Variables Summary

### Complete Variable List

| Variable | Type | Production | Preview | Development |
|----------|------|------------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | ✅ | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | ✅ | ✅ | ❌ |
| `NEXT_PUBLIC_APP_URL` | Public | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_APP_NAME` | Public | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_APP_VERSION` | Public | ✅ | ✅ | ✅ |

### Security Rules

```
┌─────────────────────────────────────────────────────────────┐
│                    VARIABLE SECURITY                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  NEXT_PUBLIC_* = Safe for browser                          │
│  ├── Supabase URL                                          │
│  ├── Anon Key (RLS-protected)                              │
│  └── App configuration                                     │
│                                                             │
│  Server-only = NEVER in browser                            │
│  ├── Service Role Key (bypasses RLS!)                      │
│  └── Provider secrets                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔷 Database Migrations

### Step 1: Open Supabase SQL Editor

1. Go to Supabase Dashboard
2. Click **SQL Editor** in the sidebar
3. Click **"New query"**

### Step 2: Run Migrations in Order

Execute each file in sequence:

```sql
-- Migration 001: Extensions and Core Setup
-- Copy contents from: supabase/migrations/001_extensions.sql
-- Paste and click "Run"
```

Continue for all 16 migrations:

| # | File | Purpose |
|---|------|---------|
| 001 | `001_extensions.sql` | PostgreSQL extensions and schemas |
| 002 | `002_profiles.sql` | User profiles |
| 003 | `003_organizations.sql` | Organizations |
| 004 | `004_roles_permissions.sql` | RBAC roles and permissions |
| 005 | `005_memberships.sql` | Organization memberships |
| 006 | `006_trade_core.sql` | Transactions, commodities, lanes |
| 007 | `007_protocol.sql` | Protocol engine, release conditions |
| 008 | `008_kyb.sql` | KYB verification system |
| 009 | `009_compliance.sql` | Compliance and documents |
| 010 | `010_inspection.sql` | Inspection and quality |
| 011 | `011_finance.sql` | Finance and settlements |
| 012 | `012_logistics.sql` | Shipments and logistics |
| 013 | `013_tasks_notifications.sql` | Tasks and notifications |
| 014 | `014_audit.sql` | Audit and exceptions |
| 015 | `015_integrations.sql` | Integrations and invoicing |
| 016 | `016_analytics.sql` | Analytics views |

### Step 3: Apply Seed Data

```sql
-- Copy contents from: supabase/seed.sql
-- Paste and click "Run"
```

---

## 🔷 Storage Configuration

### Step 1: Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Click **"New bucket"** for each:

| Bucket Name | Public | Purpose |
|-------------|--------|---------|
| `kyb-documents` | ❌ No | KYB verification documents |
| `compliance-documents` | ❌ No | Trade compliance documents |
| `inspection-reports` | ❌ No | Inspection reports |
| `lab-results` | ❌ No | Laboratory results |
| `contracts` | ❌ No | Trade contracts |
| `invoices` | ❌ No | Invoices and e-invoices |
| `audit-evidence` | ❌ No | Audit evidence |
| `avatars` | ✅ Yes | User profile pictures |

### Step 2: Configure Storage Policies

For each private bucket, add these policies:

**Policy 1: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'your-bucket-name');
```

**Policy 2: Organization-based Read**
```sql
CREATE POLICY "Users can view own organization files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'your-bucket-name'
  AND (
    -- Users can see files in their organization folder
    (storage.foldername(name))[1] IN (
      SELECT organization_id::text 
      FROM organization_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  )
);
```

---

## 🔷 Authentication Setup

### Step 1: Configure Auth Settings

1. Go to **Authentication** → **Settings**
2. Configure:

**Site URL:**
```
https://masar.vercel.app
```

**Redirect URLs:**
```
https://masar.vercel.app/**
https://masar-git-main.vercel.app/**
http://localhost:3000/**
```

### Step 2: Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Configure:
   - ✅ Enable Email provider
   - ✅ Confirm email (recommended)
   - Set minimum password length: 8

### Step 3: Create Demo Users

1. Go to **Authentication** → **Users**
2. Click **"Add user"** for each:

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

### Step 4: Link Users to Organizations

After creating users, run this SQL to link them:

```sql
-- First, ensure demo organizations exist
INSERT INTO organizations (id, legal_name, organization_type, country_code, country, status, verification_status)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'MASAR Platform', 'ADMIN', 'NG', 'Nigeria', 'active', 'verified'),
  ('00000000-0000-0000-0000-000000000002', 'Al Rajhi Foods', 'BUYER', 'SA', 'Saudi Arabia', 'active', 'verified'),
  ('00000000-0000-0000-0000-000000000003', 'Nigerian Sesame Co.', 'EXPORTER', 'NG', 'Nigeria', 'active', 'verified')
ON CONFLICT (id) DO NOTHING;

-- Link demo users to organizations
INSERT INTO organization_members (organization_id, user_id, role_id, status, is_primary)
SELECT 
  CASE 
    WHEN p.email LIKE '%buyer%' THEN '00000000-0000-0000-0000-000000000002'::uuid
    WHEN p.email LIKE '%exporter%' THEN '00000000-0000-0000-0000-000000000003'::uuid
    ELSE '00000000-0000-0000-0000-000000000001'::uuid
  END as org_id,
  p.auth_user_id,
  r.id,
  'active',
  true
FROM profiles p
CROSS JOIN roles r
WHERE p.email LIKE 'demo.%@masar.local'
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

## 🔷 Deploy to Production

### Step 1: Trigger Deployment

**Option A: Push to GitHub**
```bash
git push origin main
```

Vercel automatically deploys on push to `main`.

**Option B: Manual Deploy**
1. Go to Vercel Dashboard
2. Click **Deployments**
3. Click **"Redeploy"** on latest deployment

### Step 2: Monitor Build

1. Watch the build logs in Vercel
2. Look for:
   - ✓ Build successful
   - ✓ No environment variable errors
   - ✓ All routes generated

### Step 3: Verify Deployment

After deployment completes:

1. **Health Check**: `https://masar.vercel.app/api/v1/health`
2. **Login Page**: `https://masar.vercel.app/auth`
3. **Test Demo Login**: Use any demo account

---

## 🔷 Verification Checklist

### Supabase Configuration

- [ ] Project URL correct
- [ ] Anon key configured
- [ ] Service role key configured (server-side only)
- [ ] All 16 migrations applied
- [ ] Seed data applied
- [ ] Storage buckets created
- [ ] Storage policies configured
- [ ] Demo users created
- [ ] Users linked to organizations
- [ ] Auth redirect URLs configured

### Vercel Configuration

- [ ] Repository connected
- [ ] All 7 environment variables set
- [ ] Production environment has all variables
- [ ] Preview environment has all variables
- [ ] Service role key NOT in Development environment
- [ ] Build successful
- [ ] No errors in deployment logs

### Application Testing

- [ ] Login page loads
- [ ] Demo accounts work
- [ ] Role-based redirects work
- [ ] Dashboard loads with data
- [ ] API endpoints respond
- [ ] Health check returns OK
- [ ] File upload works
- [ ] Notifications work

---

## 🔷 Troubleshooting

### Issue: "supabaseKey is required"

**Cause**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` not set

**Fix**:
1. Check Vercel environment variables
2. Ensure variable name is exact: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy after adding

### Issue: "Invalid API key"

**Cause**: Wrong key or expired key

**Fix**:
1. Copy key again from Supabase Dashboard → Settings → API
2. Update in Vercel
3. Redeploy

### Issue: "Row Level Security policy violation"

**Cause**: User doesn't have access to resource

**Fix**:
1. Check user's organization membership
2. Verify RLS policies are applied
3. Check user's role permissions

### Issue: Build fails with "next: not found"

**Cause**: Node modules not installed

**Fix**:
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Issue: Login redirects to wrong dashboard

**Cause**: User role not set correctly

**Fix**:
1. Check `organization_members` table
2. Verify role assignment
3. Clear browser localStorage
4. Try logging in again

### Issue: Service role key exposed in client

**Cause**: Variable has `NEXT_PUBLIC_` prefix

**Fix**:
1. Remove `NEXT_PUBLIC_` from service role key variable
2. Only use in server-side code (`/api/` routes)
3. Redeploy

---

## 🔷 Local Development Setup

### .env.local File

Create `masar/.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lsqxohcpgwkoujdcuhmc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDg0NTIsImV4cCI6MjEwMzE4NDQ1Mn0.cWhKaT6Xnbz6MPRGhyffWzrtnhXfpMoOdJ21WKiANTo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYwODQ1MiwiZXhwIjoyMTAzMTg0NDUyfQ.1Imph0MQtT_jplS_9RnjpOl-oTy5ZKAO9B707l1-0eA

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MASAR
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_WHATSAPP_NUMBER=2348141815466
```

### Run Locally

```bash
cd masar
npm install
npm run dev
```

Open: http://localhost:3000

---

## 🔷 Security Best Practices

### DO ✅

- Use `NEXT_PUBLIC_*` only for safe, public values
- Keep service role key server-side only
- Use RLS policies on all tables
- Validate all inputs on server
- Use signed URLs for files
- Log all sensitive operations

### DON'T ❌

- Never commit `.env.local` to Git
- Never expose service role key in client
- Never trust frontend role checks
- Never disable RLS
- Never use `SELECT *` in production
- Never store secrets in database tables

---

## 🔷 Quick Reference

### Supabase Keys

```
Project URL:    https://lsqxohcpgwkoujdcuhmc.supabase.co
Anon Key:       eyJhbGciOiJIUzI1NiIs...cWhKaT6Xnbz6MPRGhyffWzrtnhXfpMoOdJ21WKiANTo
Service Role:   eyJhbGciOiJIUzI1NiIs...1Imph0MQtT_jplS_9RnjpOl-oTy5ZKAO9B707l1-0eA
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| CEO | demo.ceo@masar.local | MasarDemo2026! |
| Operations | demo.operations@masar.local | MasarDemo2026! |
| Compliance | demo.compliance@masar.local | MasarDemo2026! |
| Finance | demo.finance@masar.local | MasarDemo2026! |
| Buyer | demo.buyer@masar.local | MasarDemo2026! |
| Exporter | demo.exporter@masar.local | MasarDemo2026! |
| Inspector | demo.inspector@masar.local | MasarDemo2026! |
| Auditor | demo.auditor@masar.local | MasarDemo2026! |

### Production URLs

| Service | URL |
|---------|-----|
| Application | https://masar.vercel.app |
| Health Check | https://masar.vercel.app/api/v1/health |
| Login | https://masar.vercel.app/auth |
| Supabase | https://lsqxohcpgwkoujdcuhmc.supabase.co |

---

## 📞 Support

If you encounter issues:

1. Check Vercel build logs
2. Check Supabase logs (Dashboard → Logs)
3. Check browser console for errors
4. Verify environment variables are set correctly

---

**MASAR — THE PATH**

Verify. Comply. Inspect. Finance. Settle.

Trust is engineered.
