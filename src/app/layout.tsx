import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "ManageADS - Dynamic Banner Ad & Backlink Manager",
  description: "Platform manajemen banner iklan dinamis, pelacak trafik referrer domain, dan optimasi backlink SEO.",
  authors: [{ name: "Hendra Oktora", url: "https://hendraoktora.com" }],
  creator: "Hendra Oktora",
  publisher: "Hendra Oktora",
  applicationName: "ManageADS",
  generator: "Hendra Oktora",
  other: {
    author: "by Hendra Oktora / https://hendraoktora.com",
    developer: "Hendra Oktora / https://hendraoktora.com",
    copyright: "Hendra Oktora",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ManageADS",
    "description": "Dynamic Banner Ad & Backlink Management Platform",
    "url": "https://hendraoktora.com",
    "author": {
      "@type": "Person",
      "name": "Hendra Oktora",
      "url": "https://hendraoktora.com"
    },
    "creator": {
      "@type": "Person",
      "name": "Hendra Oktora",
      "url": "https://hendraoktora.com"
    },
    "publisher": {
      "@type": "Person",
      "name": "Hendra Oktora",
      "url": "https://hendraoktora.com"
    }
  };

  return (
    <html lang="id">
      <head>
        <meta name="author" content="by Hendra Oktora / https://hendraoktora.com" />
        <link rel="author" href="https://hendraoktora.com" />
        {/* Structured Data for Googlebot / Search Engine Crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#EAF3F5] text-gray-900 min-h-screen flex antialiased selection:bg-[#D5F639] selection:text-black">
        {/* Semantic Crawler Authorship Block (Accessible to Googlebot/crawlers, visually hidden from screen) */}
        <div className="sr-only" aria-hidden="true" itemScope itemType="https://schema.org/SoftwareApplication">
          <meta itemProp="name" content="ManageADS" />
          <meta itemProp="author" content="Hendra Oktora" />
          <p>
            Created &amp; developed by Hendra Oktora (<a href="https://hendraoktora.com" rel="author">hendraoktora.com</a>).
            All rights reserved.
          </p>
        </div>

        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
