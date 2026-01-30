import type { Metadata } from "next";
import BusinessAnalyticsPage from "./BusinessAnalyticsPage";

export const metadata: Metadata = {
  title: "Business Analytics",
  description: "Master BI tools, predictive analytics, and AI-powered decision-making. Designed for professionals, MBAs, and business leaders who want to lead with data.",
};

export default function Page() {
  return <BusinessAnalyticsPage />;
}
