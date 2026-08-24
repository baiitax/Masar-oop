# MASAR — مسار
## Concierge Trade Corridor Operating System
### Nigeria → Saudi Arabia

<div align="center">

![MASAR Logo](public/favicon.svg)

**البنية التحتية الموثوقة للتجارة بين أفريقيا والمملكة العربية السعودية**

**The Trusted Trade Infrastructure for Africa–Saudi Commerce**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-gold)](#)

</div>

---

## 🌍 Overview

MASAR is a comprehensive trade corridor operating system designed to facilitate trusted commodity trade between Nigeria and Saudi Arabia. The platform provides end-to-end transaction management, compliance orchestration, independent inspection coordination, and secure settlement services.

### Key Features

- **Bilingual Support** — Full Arabic (RTL) and English (LTR) interface
- **Glassmorphism Design** — Modern, premium UI with glass effects
- **Transaction Management** — Complete transaction lifecycle tracking
- **Compliance OS** — Export and import documentation management
- **Clearance Score** — Proprietary 0-100 scoring system
- **MASAR Trust Score** — Exporter reliability scoring
- **Document Vault** — Secure document repository with hash verification
- **Inspection Control** — Independent inspection orchestration
- **Finance Workspace** — Trade finance coordination
- **Shipment Tracking** — End-to-end shipment monitoring
- **Audit Trail** — Complete audit logging with four-eyes control
- **Role-Based Access** — Strict RBAC with separation of duties

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/masar.git
cd masar

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.
Open [http://localhost:3000/auth](http://localhost:3000/auth) for login/register.
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the operations center.

---

## 📁 Project Structure

```
masar/
├── public/                 # Static assets
│   ├── favicon.svg        # MASAR favicon
│   ├── robots.txt         # SEO robots file
│   ├── sitemap.xml        # SEO sitemap
│   └── site.webmanifest   # PWA manifest
├── src/
│   ├── app/
│   │   ├── auth/          # Login/Register page
│   │   ├── dashboard/     # Operations center
│   │   │   ├── audit/     # Audit trail
│   │   │   ├── buyers/    # Buyer management
│   │   │   ├── compliance/# Compliance OS
│   │   │   ├── documents/ # Document vault
│   │   │   ├── exporters/ # Exporter management
│   │   │   ├── finance/   # Finance workspace
│   │   │   ├── inspections/# Inspection control
│   │   │   ├── rfq/       # RFQ & Deal Room
│   │   │   ├── shipments/ # Shipment tracking
│   │   │   └── transactions/# Transaction management
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   ├── dashboard/     # Dashboard components
│   │   └── shared/        # Shared UI components
│   └── lib/
│       └── data.ts        # Mock data & utilities
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

---

## 🎨 Design System

### Glassmorphism

The platform uses a premium glassmorphism design language:

- **Glass Cards** — Semi-transparent backgrounds with blur effects
- **Glass Inputs** — Frosted glass input fields
- **Glass Sidebar** — Dark glass navigation
- **Glass Buttons** — Gold gradient buttons with glass effect

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| MASAR Navy | `#0A1628` | Primary dark |
| MASAR Gold | `#C8A951` | Accent, CTAs |
| Saudi Green | `#006C35` | Saudi elements |
| Glass White | `rgba(255,255,255,0.1)` | Glass effects |

### Typography

- **English** — Inter
- **Arabic** — Noto Kufi Arabic

---

## 🔐 Security Features

- **256-bit SSL Encryption** — All data encrypted in transit
- **Two-Factor Authentication (2FA)** — MFA support with authenticator apps
- **Password Strength Enforcement** — Real-time password strength validation
- **Session Management** — 30-minute timeout with activity monitoring
- **Rate Limiting** — Brute force protection
- **CAPTCHA Integration** — After 3 failed attempts
- **Role-Based Access Control** — Strict RBAC with separation of duties
- **Four-Eyes Control** — Critical actions require multiple approvals
- **Audit Trail** — Complete logging of all privileged actions

---

## 🌐 Bilingual Support

The platform fully supports Arabic and English:

- **RTL Layout** — Complete right-to-left support for Arabic
- **Dynamic Language Switching** — Toggle between languages
- **Cultural Adaptation** — Saudi cultural elements and patterns
- **SEO Optimization** — Hreflang tags, structured data in both languages

---

## 📊 Transaction States

```
DRAFT → RFQ_OPEN → COUNTERPARTIES_VERIFIED → COMMERCIAL_AGREEMENT
→ CONTRACT_EXECUTED → COMPLIANCE_IN_PROGRESS → CLEARANCE_READY
→ INSPECTION_PENDING → INSPECTION_PASSED → FINANCING_APPROVED
→ FUNDS_SECURED → SHIPMENT_RELEASED → IN_TRANSIT
→ PORT_VERIFICATION → RELEASE_ELIGIBLE → FUNDS_RELEASED
→ SETTLED → COMPLETED
```

---

## 🏗️ Version Roadmap

### V0 — Concierge (Current)
- Manual transaction execution
- Compliance orchestration
- Inspection coordination
- Settlement management

### V1 — Automated Trust Rail (Q1-Q2 2027)
- Automated KYB/KYC
- Automated document verification
- Compliance engine
- Inspection API integration
- ZATCA e-invoicing

### V2 — Network Density
- Multi-corridor support
- Partner APIs
- Advanced analytics
- AI-powered risk engine

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Contact

- **Email**: info@masar.sa
- **Riyadh**: الرياض، المملكة العربية السعودية
- **Lagos**: Lagos, Nigeria

---

<div align="center">

**مسار — البنية التحتية الموثوقة للتجارة**

**MASAR — The Trusted Trade Infrastructure**

</div>
