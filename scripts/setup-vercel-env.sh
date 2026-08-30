#!/bin/bash

# MASAR Vercel Environment Setup Script
# Run this script to configure Vercel environment variables

echo "🚀 MASAR Vercel Environment Setup"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}Setting environment variables for Vercel...${NC}"
echo ""

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://lsqxohcpgwkoujdcuhmc.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_URL preview <<< "https://lsqxohcpgwkoujdcuhmc.supabase.co"

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDg0NTIsImV4cCI6MjEwMzE4NDQ1Mn0.cWhKaT6Xnbz6MPRGhyffWzrtnhXfpMoOdJ21WKiANTo"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDg0NTIsImV4cCI6MjEwMzE4NDQ1Mn0.cWhKaT6Xnbz6MPRGhyffWzrtnhXfpMoOdJ21WKiANTo"

vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYwODQ1MiwiZXhwIjoyMTAzMTg0NDUyfQ.1Imph0MQtT_jplS_9RnjpOl-oTy5ZKAO9B707l1-0eA"
vercel env add SUPABASE_SERVICE_ROLE_KEY preview <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYwODQ1MiwiZXhwIjoyMTAzMTg0NDUyfQ.1Imph0MQtT_jplS_9RnjpOl-oTy5ZKAO9B707l1-0eA"

vercel env add NEXT_PUBLIC_APP_URL production <<< "https://masar.vercel.app"
vercel env add NEXT_PUBLIC_APP_URL preview <<< "https://masar-git-main.vercel.app"

vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER production <<< "2348141815466"
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER preview <<< "2348141815466"

vercel env add NEXT_PUBLIC_APP_NAME production <<< "MASAR"
vercel env add NEXT_PUBLIC_APP_NAME preview <<< "MASAR"

vercel env add NEXT_PUBLIC_APP_VERSION production <<< "1.0.0"
vercel env add NEXT_PUBLIC_APP_VERSION preview <<< "1.0.0"

echo ""
echo -e "${GREEN}✅ Environment variables configured!${NC}"
echo ""
echo "Next steps:"
echo "1. Run 'vercel --prod' to deploy"
echo "2. Check the deployment at https://masar.vercel.app"
echo ""
