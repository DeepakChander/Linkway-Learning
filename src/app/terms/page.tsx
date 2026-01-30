import type { Metadata } from "next";
import TermsPage from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for Linkway Learning's website, platform, and educational programs. Read our complete terms governing enrolment, payments, refunds, intellectual property, and more.",
};

export default function Terms() {
  return <TermsPage />;
}
