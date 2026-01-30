import type { Metadata } from "next";
import DataAnalyticsPage from "./DataAnalyticsPage";

export const metadata: Metadata = {
  title: "Data Analytics",
  description: "Master Excel, SQL, Python, Tableau, Power BI, and ML fundamentals in 6 intensive months. Dedicated Placement Assistance.",
};

export default function Page() {
  return <DataAnalyticsPage />;
}
