"use client";

import { PurchaseModalProvider } from "@/components/forms/PurchaseModal";

export default function PurchaseProvider({ children }: { children: React.ReactNode }) {
  return <PurchaseModalProvider>{children}</PurchaseModalProvider>;
}
