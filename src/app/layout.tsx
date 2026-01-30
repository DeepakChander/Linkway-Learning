import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyCtaBar from "@/components/layout/StickyCtaBar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import SmoothScroll from "@/components/animation/SmoothScroll";
import PageTransition from "@/components/animation/PageTransition";
import AgentationProvider from "@/components/dev/AgentationProvider";
import EnquiryProvider from "@/components/providers/EnquiryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Linkway Learning - Your Link to Mastery",
    template: "%s | Linkway Learning",
  },
  description:
    "Transform your career with industry-driven programs in Data Analytics, Data Science & AI, and Business Intelligence. Dedicated Placement Assistance.",
  keywords: [
    "data analytics course",
    "data science course",
    "AI course",
    "business intelligence",
    "placement assistance",
    "Linkway Learning",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Linkway Learning - Your Link to Mastery",
    description: "Transform your career with industry-driven programs. Dedicated Placement Assistance.",
    type: "website",
    locale: "en_IN",
    siteName: "Linkway Learning",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-navy-900 text-white antialiased`}>
        <EnquiryProvider>
          <SmoothScroll>
            <Navbar />
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
            <Footer />
            <StickyCtaBar />
            <WhatsAppButton />
            <AgentationProvider />
          </SmoothScroll>
        </EnquiryProvider>
      </body>
    </html>
  );
}
