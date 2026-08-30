#!/bin/bash

# MASAR Environment Verification Script
# Run this script to verify your environment configuration

echo "🔍 MASAR Environment Verification"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check .env.local file
echo "📁 Checking .env.local file..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ .env.local exists${NC}"
    
    # Check Supabase URL
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=https://lsqxohcpgwkoujdcuhmc.supabase.co" .env.local; then
        echo -e "${GREEN}✓ NEXT_PUBLIC_SUPABASE_URL configured${NC}"
    else
        echo -e "${RED}✗ NEXT_PUBLIC_SUPABASE_URL missing or incorrect${NC}"
    fi
    
    # Check Anon Key
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ" .env.local; then
        echo -e "${GREEN}✓ NEXT_PUBLIC_SUPABASE_ANON_KEY configured${NC}"
    else
        echo -e "${RED}✗ NEXT_PUBLIC_SUPABASE_ANON_KEY missing${NC}"
    fi
    
    # Check Service Role Key
    if grep -q "SUPABASE_SERVICE_ROLE_KEY=eyJ" .env.local; then
        echo -e "${GREEN}✓ SUPABASE_SERVICE_ROLE_KEY configured${NC}"
    else
        echo -e "${YELLOW}⚠ SUPABASE_SERVICE_ROLE_KEY missing (required for server-side operations)${NC}"
    fi
else
    echo -e "${RED}✗ .env.local not found${NC}"
fi

echo ""
echo "🔧 Checking vercel.json..."
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓ vercel.json exists${NC}"
    
    if grep -q "lsqxohcpgwkoujdcuhmc.supabase.co" vercel.json; then
        echo -e "${GREEN}✓ Supabase URL in vercel.json${NC}"
    else
        echo -e "${YELLOW}⚠ Supabase URL not in vercel.json (will use Vercel env vars)${NC}"
    fi
else
    echo -e "${RED}✗ vercel.json not found${NC}"
fi

echo ""
echo "📊 Checking build output..."
if [ -d ".next" ]; then
    echo -e "${GREEN}✓ .next directory exists (build successful)${NC}"
else
    echo -e "${YELLOW}⚠ .next directory not found (run npm run build)${NC}"
fi

echo ""
echo "🗄️ Checking Supabase migrations..."
MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
if [ "$MIGRATION_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ Found $MIGRATION_COUNT migration files${NC}"
else
    echo -e "${YELLOW}⚠ No migration files found${NC}"
fi

echo ""
echo "📦 Checking package.json..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓ package.json exists${NC}"
    
    if grep -q "@supabase/supabase-js" package.json; then
        echo -e "${GREEN}✓ Supabase client library installed${NC}"
    else
        echo -e "${RED}✗ Supabase client library not found${NC}"
    fi
else
    echo -e "${RED}✗ package.json not found${NC}"
fi

echo ""
echo "🔐 Security Checklist..."
echo "────────────────────────"

# Check if service role key is in client code
if grep -r "SUPABASE_SERVICE_ROLE_KEY" src/app/ src/components/ 2>/dev/null | grep -v "server.ts" | grep -v "api/" > /dev/null; then
    echo -e "${RED}✗ WARNING: Service role key may be exposed in client code${NC}"
else
    echo -e "${GREEN}✓ Service role key not found in client code${NC}"
fi

# Check for NEXT_PUBLIC_ prefix on sensitive vars
if grep -r "NEXT_PUBLIC_.*SECRET\|NEXT_PUBLIC_.*SERVICE" .env.local 2>/dev/null > /dev/null; then
    echo -e "${RED}✗ WARNING: Sensitive variable has NEXT_PUBLIC_ prefix${NC}"
else
    echo -e "${GREEN}✓ No sensitive variables with NEXT_PUBLIC_ prefix${NC}"
fi

echo ""
echo "📋 Next Steps:"
echo "──────────────"
echo "1. Set SUPABASE_SERVICE_ROLE_KEY in Vercel Dashboard"
echo "2. Run database migrations in Supabase SQL Editor"
echo "3. Create storage buckets in Supabase"
echo "4. Deploy to Vercel: vercel --prod"
echo "5. Test API endpoints: curl https://your-domain.vercel.app/api/health"
echo ""
echo "📚 See VERCEL_DEPLOYMENT.md for complete instructions"
echo ""
echo "✅ Environment verification complete!"
