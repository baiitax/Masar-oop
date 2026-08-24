import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MASAR | مسار — بنية التجارة الموثوقة بين أفريقيا والمملكة العربية السعودية",
    template: "%s | MASAR — مسار"
  },
  description: "منصة مسار للتجارة الموثوقة بين نيجيريا والمملكة العربية السعودية. توثيق المصدرين والمستوردين، فحص مستقل، تسوية آمنة، وتمويل تجاري. MASAR - Trusted trade infrastructure for Africa-Saudi Arabia commerce.",
  keywords: [
    "مسار", "MASAR", "تجارة", "نيجيريا", "السعودية", "سمسم", "تصدير", "استيراد",
    "تجارة أفريقية", "تجارة سعودية", "منصة تجارية", "تمويل تجاري", "فحص بضائع",
    "Nigeria Saudi Arabia trade", "sesame export", "commodity trading", "trade finance",
    "Africa Saudi commerce", "verified trade", "escrow settlement", "compliance platform",
    "سمسم نيجيري", "تجارة السمسم", "تصدير سمسم", "استيراد سمسم السعودية",
    "منصة مسار للتجارة", "بنية تجارية موثوقة", "تجارة عبر الحدود"
  ],
  authors: [{ name: "MASAR", url: "https://masar.sa" }],
  creator: "MASAR",
  publisher: "MASAR",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://masar.sa"),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/en",
      "ar": "/ar",
    },
  },
  openGraph: {
    title: "MASAR | مسار — بنية التجارة الموثوقة بين أفريقيا والمملكة العربية السعودية",
    description: "منصة مسار للتجارة الموثوقة. توثيق المصدرين والمستوردين، فحص مستقل، تسوية آمنة، وتمويل تجاري بين نيجيريا والسعودية.",
    url: "https://masar.sa",
    siteName: "MASAR — مسار",
    locale: "ar_SA",
    alternateLocale: ["en_US", "en_GB"],
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MASAR — منصة مسار للتجارة الموثوقة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MASAR | مسار — بنية التجارة الموثوقة",
    description: "منصة مسار للتجارة الموثوقة بين نيجيريا والمملكة العربية السعودية",
    images: ["/og-image.png"],
    creator: "@MASAR_Trade",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "business",
  classification: "Trade Platform",
  other: {
    "msapplication-TileColor": "#0A1628",
    "theme-color": "#0A1628",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Kufi+Arabic:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MASAR",
              "alternateName": "مسار",
              "url": "https://masar.sa",
              "logo": "https://masar.sa/logo.png",
              "description": "منصة مسار للتجارة الموثوقة بين نيجيريا والمملكة العربية السعودية",
              "foundingDate": "2026",
              "founders": [
                {
                  "@type": "Person",
                  "name": "MASAR Founding Team"
                }
              ],
              "address": [
                {
                  "@type": "PostalAddress",
                  "addressCountry": "SA",
                  "addressLocality": "Riyadh",
                  "addressRegion": "Riyadh",
                  "name": "المقر الرئيسي — الرياض، المملكة العربية السعودية"
                },
                {
                  "@type": "PostalAddress",
                  "addressCountry": "NG",
                  "addressLocality": "Lagos",
                  "addressRegion": "Lagos",
                  "name": "مكتب نيجيريا — لاغوس"
                }
              ],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "email": "info@masar.sa",
                  "availableLanguage": ["Arabic", "English"]
                }
              ],
              "sameAs": [
                "https://twitter.com/MASAR_Trade",
                "https://linkedin.com/company/masar-trade"
              ],
              "areaServed": [
                {
                  "@type": "Country",
                  "name": "Saudi Arabia"
                },
                {
                  "@type": "Country",
                  "name": "Nigeria"
                }
              ],
              "knowsAbout": [
                "International Trade",
                "Commodity Trading",
                "Trade Finance",
                "Sesame Export",
                "Africa Saudi Arabia Commerce"
              ]
            })
          }}
        />
        
        {/* Structured Data - WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MASAR — مسار",
              "url": "https://masar.sa",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://masar.sa/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "inLanguage": ["ar-SA", "en-US"]
            })
          }}
        />
        
        {/* Structured Data - BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "الرئيسية",
                  "item": "https://masar.sa"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "كيف يعمل",
                  "item": "https://masar.sa#how-it-works"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "للمستوردين السعوديين",
                  "item": "https://masar.sa#for-buyers"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "للمصدرين النيجيريين",
                  "item": "https://masar.sa#for-exporters"
                }
              ]
            })
          }}
        />
        
        {/* Structured Data - Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "serviceType": "Trade Corridor Operating System",
              "provider": {
                "@type": "Organization",
                "name": "MASAR"
              },
              "areaServed": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 23.8859,
                  "longitude": 45.0792
                },
                "geoRadius": "5000 km"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "خدمات مسار التجارية",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "توثيق المصدرين والمستوردين",
                      "description": "فحص شامل وتوثيق كامل للمصدرين والمستوردين"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "تنسيق الامتثال",
                      "description": "إدارة كاملة لوثائق التصدير والاستيراد"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "فحص مستقل",
                      "description": "فحص جودة مستقل بواسطة شركاء معتمدين"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "تسوية آمنة",
                      "description": "إدارة التسوية المالية عبر بنوك مرخصة"
                    }
                  }
                ]
              }
            })
          }}
        />
        
        {/* Structured Data - FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "ما هي منصة مسار؟",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "مسار هي البنية التحتية للتجارة الموثوقة بين أفريقيا والمملكة العربية السعودية. نوفر طبقة معاملات مسؤولة تغطي توثيق المصدرين والمستوردين،تنسيق الامتثال، الفحص المستقل، وتسوية التسوية."
                  }
                },
                {
                  "@type": "Question",
                  "name": "كيف أبدأ التجارة عبر مسار؟",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ابدأ بإنشاء حساب على المنصة، ثم أكمل عملية التوثيق (KYB/KYC). بعد الموافقة، يمكنك إنشاء طلب عرض أسعار (RFQ) والبدء في торговتك الأولى."
                  }
                },
                {
                  "@type": "Question",
                  "name": "ما هي السلع المتاحة على مسار؟",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "حالياً نركز على تجارة السمسم النيجيري الفاخر كسلع شاطئية. خططنا تشمل التوسع إلى سلع أخرى مثل الكاجو وزبدة الشيا."
                  }
                },
                {
                  "@type": "Question",
                  "name": "هل مسار منصة آمنة؟",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "نعم، مسار مبنية على مبادئ الأمان المتقدمة. نستخدم التشفير، التدقيق المستمر، ونظام الأربعة عيون لضمان عدم وجود معاملة يمكن أن تتم بواسطة شخص واحد."
                  }
                }
              ]
            })
          }}
        />
        
        {/* Hreflang tags for language variants */}
        <link rel="alternate" hrefLang="ar" href="https://masar.sa/ar" />
        <link rel="alternate" hrefLang="en" href="https://masar.sa/en" />
        <link rel="alternate" hrefLang="x-default" href="https://masar.sa" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
