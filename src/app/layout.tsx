import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MASAR | مسار — بنية التجارة الموثوقة بين أفريقيا والمملكة العربية السعودية",
    template: "%s | MASAR — مسار"
  },
  description: "منصة مسار للتجارة الموثوقة بين نيجيريا والمملكة العربية السعودية. MASAR - Trusted trade infrastructure for Africa-Saudi Arabia commerce.",
  keywords: "مسار, MASAR, تجارة, نيجيريا, السعودية, سمسم, تصدير, استيراد, Nigeria Saudi Arabia trade, sesame export, commodity trading, trade finance",
  authors: [{ name: "MASAR", url: "https://masar.sa" }],
  metadataBase: new URL("https://masar.sa"),
  openGraph: {
    title: "MASAR | مسار — بنية التجارة الموثوقة",
    description: "منصة مسار للتجارة الموثوقة بين نيجيريا والمملكة العربية السعودية",
    url: "https://masar.sa",
    siteName: "MASAR — مسار",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Kufi+Arabic:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MASAR",
              "alternateName": "مسار",
              "url": "https://masar.sa",
              "description": "The trusted transaction infrastructure for the Saudi–Africa trade corridor",
              "foundingDate": "2026",
              "address": [
                { "@type": "PostalAddress", "addressCountry": "SA", "addressLocality": "Riyadh" },
                { "@type": "PostalAddress", "addressCountry": "NG", "addressLocality": "Lagos" }
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "info@masar.sa",
                "availableLanguage": ["Arabic", "English"]
              }
            })
          }}
        />
      </head>
      <body style={{ direction: 'ltr', textAlign: 'left' }}>
        {children}
      </body>
    </html>
  );
}
