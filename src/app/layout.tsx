import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import SmoothScroll from "@/components/animation/SmoothScroll";
import PageTransition from "@/components/animation/PageTransition";
import AgentationProvider from "@/components/dev/AgentationProvider";
import EnquiryProvider from "@/components/providers/EnquiryProvider";
import PurchaseProvider from "@/components/providers/PurchaseProvider";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://linkwaylearning.com"),
  title: {
    default: "Linkway Learning - India's #1 Data, AI & Business Training Institute",
    template: "%s | Linkway Learning",
  },
  description:
    "Transform your career with industry-driven programs in Data Analytics, Data Science & AI, Business Analytics, and Investment Banking. 100% placement. Mentors from Google, Amazon & Microsoft.",
  keywords: [
    "data analytics course",
    "data science course",
    "AI course India",
    "business analytics program",
    "investment banking course",
    "100% placement",
    "Linkway Learning",
    "data analytics training",
    "online data science course",
    "best data analytics institute India",
    "data analyst placement",
    "machine learning course",
    "Power BI course",
    "Python for data science",
    "SQL course online",
  ],
  authors: [{ name: "Linkway Learning", url: "https://linkwaylearning.com" }],
  creator: "Linkway Learning",
  publisher: "Linkway Learning",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://linkwaylearning.com",
  },
  openGraph: {
    title: "Linkway Learning - India's #1 Data, AI & Business Training Institute",
    description:
      "100% placement. Mentors from Google, Amazon & Microsoft. Launch your dream career today.",
    type: "website",
    locale: "en_IN",
    siteName: "Linkway Learning",
    url: "https://linkwaylearning.com",
    images: [
      {
        url: "/images/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "Linkway Learning - India's leading Data, AI and Business Training Institute",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkway Learning - India's #1 Data, AI & Business Training Institute",
    description:
      "100% placement. Mentors from Google, Amazon & Microsoft. Launch your dream career today.",
    images: ["/images/og/og-default.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <GoogleAnalytics />
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-navy-900 text-white antialiased`}>
        <EnquiryProvider>
          <PurchaseProvider>
            <SmoothScroll>
              <Navbar />
              <PageTransition>
                <main>{children}</main>
              </PageTransition>
              <Footer />
              <WhatsAppButton />
              <AgentationProvider />
            </SmoothScroll>
          </PurchaseProvider>
        </EnquiryProvider>
      </body>
    </html>
  );
}
