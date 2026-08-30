# MASAR Vercel Deployment Guide

## 🚀 Quick Deploy

### Option 1: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. Connect your GitHub repository to Vercel
2. Import the project `baiitax/Masar-oop`
3. Vercel will auto-detect Next.js framework
4. Configure environment variables (see below)
5. Deploy

---

## 🔐 Environment Variables

### Required Environment Variables

Set these in **Vercel Dashboard → Settings → Environment Variables**:

#### Supabase Configuration (Public)

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lsqxohcpgwkoujdcuhmc.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDg0NTIsImV4cCI6MjEwMzE4NDQ1Mn0.cWhKaT6Xnbz6MPRGhyffWzrtnhXfpMoOdJ21WKiANTo` | Production, Preview, Development |

#### Supabase Configuration (Server-Side Only - CRITICAL)

| Variable | Value | Environment |
|----------|-------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYwODQ1MiwiZXhwIjoyMTAzMTg0NDUyfQ.1Imph0MQtT_jplS_9RnjpOl-oTy5ZKAO9B707l1-0eA` | Production, Preview |

> ⚠️ **WARNING**: The service role key has FULL access to your database. NEVER expose it to the client. Only set it in server-side environment variables.

#### Application Configuration

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_APP_URL` | `https://masar.vercel.app` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://masar-git-main.vercel.app` | Preview |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Development |

#### WhatsApp Integration

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `2348141815466` | Production, Preview, Development |

#### Feature Flags

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_ENABLE_REALTIME` | `true` | Production, Preview |
| `NEXT_PUBLIC_ENABLE_NOTIFICATIONS` | `true` | Production, Preview |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | `true` | Production |

---

## 📋 Pre-Deployment Checklist

### 1. Supabase Setup

- [ ] Supabase project created at `lsqxohcpgwkoujdcuhmc`
- [ ] Database migrations applied (001-016)
- [ ] RLS policies enabled on all tables
- [ ] Storage buckets created:
  - `kyb-documents`
  - `compliance-documents`
  - `inspection-reports`
  - `lab-results`
  - `contracts`
  - `invoices`
  - `audit-evidence`
  - `avatars`
- [ ] Storage policies configured
- [ ] Demo users created via Supabase Auth
- [ ] Seed data applied

### 2. Vercel Configuration

- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Build settings verified
- [ ] Domain configured (if custom domain)

### 3. Security Verification

- [ ] Service role key NOT in client bundle
- [ ] RLS policies tested for each role
- [ ] API routes secured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (via Supabase)

---

## 🔧 Build Configuration

### Next.js Configuration

The project uses Next.js 16.3.2 with Turbopack. Key configurations:

```typescript
// next.config.ts
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lsqxohcpgwkoujdcuhmc.supabase.co'],
  },
  // Turbopack is enabled by default in Next.js 16
}
```

### Build Optimization

- **Static Generation**: 62 pages pre-rendered
- **Dynamic Routes**: API routes and authenticated pages
- **Image Optimization**: Supabase storage images
- **Bundle Size**: Optimized with tree-shaking

---

## 🌐 Custom Domain Setup

### 1. Add Domain in Vercel

1. Go to **Vercel Dashboard → Settings → Domains**
2. Add your domain: `masar.com`
3. Configure DNS records as shown

### 2. DNS Configuration

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### 3. SSL Certificate

Vercel automatically provisions SSL certificates for all domains.

---

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable in **Vercel Dashboard → Analytics**:

- **Web Vitals**: Core Web Vitals monitoring
- **Speed Insights**: Real user monitoring
- **Audience**: Geographic and device data

### Error Monitoring

Consider integrating:

- **Sentry**: For error tracking
- **LogRocket**: For session replay
- **Supabase Dashboard**: For database monitoring

---

## 🔄 CI/CD Pipeline

### Automatic Deployments

Vercel automatically deploys:

- **Production**: Pushes to `main` branch
- **Preview**: Pull requests
- **Development**: Local development with `vercel dev`

### Branch Deployments

| Branch | URL | Purpose |
|--------|-----|---------|
| `main` | `masar.vercel.app` | Production |
| `develop` | `masar-develop.vercel.app` | Staging |
| `feature/*` | `masar-feature-*.vercel.app` | Feature previews |

---

## 🚨 Troubleshooting

### Build Failures

**Error: `next: not found`**
```bash
rm -rf node_modules .next
npm install
npm run build
```

**Error: Environment variable missing**
- Verify all env vars are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Ensure `NEXT_PUBLIC_` prefix for client-side vars

### Runtime Errors

**Error: Supabase connection failed**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check Supabase project is active
- Verify RLS policies allow access

**Error: Authentication not working**
- Check Supabase Auth settings
- Verify redirect URLs in Supabase dashboard
- Ensure `NEXT_PUBLIC_APP_URL` matches deployed URL

### Performance Issues

**Slow page loads**
- Enable Vercel Edge Functions for API routes
- Use Supabase connection pooling
- Implement proper caching strategies

---

## 📈 Scaling Configuration

### Vercel Pro Features

For production workloads, enable:

- **Edge Functions**: Reduce latency globally
- **Image Optimization**: Automatic image compression
- **Analytics**: Real-time performance monitoring
- **Preview Deployments**: Team collaboration

### Database Scaling

Supabase scaling options:

- **Connection Pooling**: Enable PgBouncer
- **Read Replicas**: For read-heavy workloads
- **Point-in-Time Recovery**: For data protection

---

## 🔒 Security Hardening

### Vercel Security

- [ ] Enable **Vercel Firewall** in dashboard
- [ ] Configure **DDoS Protection**
- [ ] Set up **Web Application Firewall (WAF)**
- [ ] Enable **Secure Headers** (configured in vercel.json)

### Application Security

- [ ] Implement rate limiting on API routes
- [ ] Add CSRF protection for forms
- [ ] Enable CSP headers
- [ ] Configure CORS properly
- [ ] Use HTTPS everywhere

### Supabase Security

- [ ] Enable **Row Level Security** on all tables
- [ ] Configure **Storage Policies**
- [ ] Set up **Database Webhooks** for monitoring
- [ ] Enable **Audit Logging**
- [ ] Configure **Backup Schedule**

---

## 📝 Post-Deployment Verification

### 1. Functional Testing

- [ ] Landing page loads correctly
- [ ] Authentication flow works
- [ ] Role-based dashboards accessible
- [ ] Transactions can be created
- [ ] Documents can be uploaded
- [ ] Notifications delivered
- [ ] WhatsApp integration works

### 2. Security Testing

- [ ] RLS policies block unauthorized access
- [ ] API routes return proper error codes
- [ ] Service role key not exposed in client
- [ ] File uploads validated
- [ ] SQL injection prevented

### 3. Performance Testing

- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Database queries optimized
- [ ] Images optimized
- [ ] Bundle size acceptable

---

## 🎯 Production URLs

| Environment | URL |
|-------------|-----|
| Production | `https://masar.vercel.app` |
| Preview | `https://masar-git-main.vercel.app` |
| GitHub | `https://github.com/baiitax/Masar-oop` |
| Supabase | `https://lsqxohcpgwkoujdcuhmc.supabase.co` |

---

## 📞 Support

For deployment issues:

1. Check Vercel build logs
2. Review Supabase logs
3. Check browser console for errors
4. Verify environment variables

---

**MASAR — THE PATH**

Verify. Comply. Inspect. Finance. Settle.

Trust is engineered.
