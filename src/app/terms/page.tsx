import type { Metadata } from "next";
import TermsPage from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using Linkway Learning's website and educational programs.",
};

export default function Terms() {
  return <TermsPage />;
}
