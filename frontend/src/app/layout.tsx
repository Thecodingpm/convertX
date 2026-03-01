import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://smartconvertx.online";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "smartconvertx – Free Online File Converter | PDF, Image & Video Tools",
    template: "%s | smartconvertx",
  },
  description:
    "Free online file converter with 40+ tools. Convert PDF to Word, compress images, resize photos, extract audio, create QR codes and more. No signup, no watermarks, instant results.",
  keywords: [
    "free file converter",
    "pdf to word",
    "compress pdf online",
    "resize image online",
    "jpg to png converter",
    "merge pdf online",
    "convert video online",
    "image compressor",
    "qr code generator",
    "extract audio from video",
    "free pdf tools",
    "mp3 to wav",
    "pdf to excel",
    "no signup converter",
    "smartconvertx",
  ],
  authors: [{ name: "smartconvertx" }],
  creator: "smartconvertx",
  publisher: "smartconvertx",
  verification: {
    google: "LD-gC1W9-hFwjHuit-njbPZrPu-lgrgqZAaY8MlTPg0",
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
  openGraph: {
    type: "website",
    siteName: "smartconvertx",
    title: "smartconvertx – Free Online File Converter",
    description:
      "40+ free tools for PDF, image, audio & video conversion. No signup required. Files deleted after 1 hour.",
    url: BASE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "smartconvertx – Free Online File Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "smartconvertx – Free Online File Converter",
    description:
      "40+ free tools. No signup. Convert PDF, images, audio & video instantly.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8087069235637059"
          crossOrigin="anonymous"
        ></script>
        {/* JSON-LD: WebSite Schema for Google Sitelinks Searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "smartconvertx",
              url: BASE_URL,
              description:
                "Free online file converter with 40+ tools. Convert PDF, images, audio and video.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${BASE_URL}/tools?search={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* JSON-LD: Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "smartconvertx",
              url: BASE_URL,
              logo: `${BASE_URL}/icon.png`,
              description:
                "smartconvertx provides 40+ free online file conversion tools for PDF, images, audio and video.",
              sameAs: [],
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main style={{ minHeight: "calc(100vh - 64px - 80px)" }}>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
