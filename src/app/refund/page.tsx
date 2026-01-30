import type { Metadata } from "next";
import RefundContent from "./RefundContent";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Linkway Learning's refund policy. Understand our refund eligibility, process, deductions, and timelines.",
};

export default function Refund() {
  return <RefundContent />;
}
