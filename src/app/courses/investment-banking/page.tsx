import type { Metadata } from "next";
import InvestmentBankingPage from "./InvestmentBankingPage";

export const metadata: Metadata = {
  title: "Investment Banking",
  description: "Master financial modeling, valuation, M&A, and deal structuring. Built for those who want to land roles at top investment banks and financial institutions.",
};

export default function Page() {
  return <InvestmentBankingPage />;
}
