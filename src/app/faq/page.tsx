import type { Metadata } from "next";
import FAQPage from "./FAQContent";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Linkway Learning's programs, placement assistance, pricing, and certification.",
};

export default function FAQ() {
  return <FAQPage />;
}
