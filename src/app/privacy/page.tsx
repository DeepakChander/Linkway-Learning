import type { Metadata } from "next";
import PrivacyPage from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Linkway Learning's privacy policy. Learn how we collect, use, and protect your personal data.",
  alternates: { canonical: "https://linkwaylearning.com/privacy" },
  robots: { index: false, follow: true },
};

export default function Privacy() {
  return <PrivacyPage />;
}
