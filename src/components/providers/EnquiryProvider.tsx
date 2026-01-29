"use client";

import { EnquiryModalProvider } from "@/components/forms/EnquiryModal";

export default function EnquiryProvider({ children }: { children: React.ReactNode }) {
  return <EnquiryModalProvider>{children}</EnquiryModalProvider>;
}
