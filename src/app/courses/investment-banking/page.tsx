import type { Metadata } from "next";
import CoursePageTemplate from "@/components/sections/CoursePageTemplate";

export const metadata: Metadata = {
  title: "Investment Banking",
  description: "Master financial modeling, valuation, M&A, and deal structuring. Built for those who want to land roles at top investment banks and financial institutions.",
};

export default function InvestmentBankingPage() {
  return (
    <CoursePageTemplate
      animationVariant="orano"
      name="Investment Banking"
      duration="9 Months"
      level="Beginner to Advanced"
      tagline="Break into the world of high-stakes finance."
      heroDescription="Master financial modeling, valuation, M&A, and deal structuring. This program is built for those who want to land roles at top investment banks, PE firms, and financial institutions - with the skills and portfolio to back it up."
      color="#F59E0B"
      whoIsThisFor={[
        { title: "Finance Graduates", description: "You studied finance but college didn't teach you how to build a real DCF model or structure a deal. This will." },
        { title: "Career Switchers", description: "Coming from engineering, consulting, or operations? IB firms love diverse backgrounds - you just need the technical finance skills." },
        { title: "CA/CFA Aspirants", description: "Complement your accounting or CFA prep with hands-on modeling and valuation skills that make you immediately employable." },
        { title: "Working Professionals", description: "Already in finance but want to move to the buy-side or advisory? Level up your modeling and deal skills." },
      ]}
      curriculum={[
        {
          phase: "Module 1",
          title: "Financial Foundations",
          duration: "5 Weeks",
          topics: [
            "Accounting fundamentals - P&L, balance sheet, cash flow statement, financial ratios",
            "Excel for finance - advanced formulas, financial functions, keyboard shortcuts, modeling best practices",
            "Corporate finance essentials - time value of money, cost of capital, capital structure",
            "Financial statement analysis - ratio analysis, trend analysis, peer benchmarking",
          ],
        },
        {
          phase: "Module 2",
          title: "Valuation & Financial Modeling",
          duration: "6 Weeks",
          topics: [
            "DCF modeling - free cash flow projection, WACC calculation, terminal value, sensitivity analysis",
            "Comparable company analysis - selecting comps, normalizing financials, valuation multiples",
            "Precedent transactions - deal sourcing, premium analysis, synergy valuation",
            "LBO modeling - deal structure, debt schedules, returns analysis, exit scenarios",
          ],
        },
        {
          phase: "Module 3",
          title: "M&A and Deal Structuring",
          duration: "6 Weeks",
          topics: [
            "M&A process - deal origination, due diligence, negotiation, closing",
            "Merger models - accretion/dilution analysis, pro forma financials, synergy modeling",
            "Deal structuring - stock vs cash, earnouts, contingent consideration",
            "Private equity fundamentals - fund structure, portfolio management, value creation",
          ],
        },
        {
          phase: "Module 4",
          title: "Industry & Sector Analysis",
          duration: "5 Weeks",
          topics: [
            "Technology sector - SaaS metrics, unit economics, growth vs profitability analysis",
            "Healthcare & pharma - pipeline valuation, regulatory analysis, DCF adjustments",
            "Financial services - bank valuation, insurance modeling, fintech analysis",
            "Infrastructure & energy - project finance, commodity modeling, regulatory frameworks",
          ],
        },
        {
          phase: "Module 5",
          title: "Data & Analytics for Finance",
          duration: "5 Weeks",
          topics: [
            "SQL for financial data - querying financial databases, building data pipelines",
            "Python for finance - quantitative analysis, portfolio optimization, risk modeling",
            "Power BI for finance - building financial dashboards, automated reporting",
            "Data-driven investing - screening models, factor analysis, quantitative strategies",
          ],
        },
        {
          phase: "Module 6",
          title: "Career Preparation",
          duration: "5 Weeks",
          topics: [
            "Pitch book creation - company profiles, market overviews, deal recommendations",
            "Technical interview prep - valuation questions, brain teasers, market sizing",
            "Behavioral interview prep - fit questions, deal walk-throughs, why IB",
            "Networking strategy - LinkedIn optimization, informational interviews, alumni outreach",
            "Capstone project - full deal analysis and pitch presentation",
          ],
        },
      ]}
      tools={["Excel", "Power BI", "SQL", "Python", "Tableau", "Capital IQ", "Bloomberg Terminal", "Refinitiv", "PitchBook", "Git"]}
      projects={[
        { title: "Full DCF Valuation Model", description: "Build a comprehensive DCF model for a publicly traded company with scenario analysis, sensitivity tables, and football field valuation." },
        { title: "M&A Deal Analysis", description: "Analyze a real M&A transaction - build merger model, assess accretion/dilution, and present strategic rationale." },
        { title: "LBO Model", description: "Structure and model a leveraged buyout with multiple debt tranches, management rollover, and exit analysis." },
        { title: "Sector Research Report", description: "Produce a professional equity research report covering industry dynamics, competitive landscape, and investment thesis." },
        { title: "Investment Pitch Book", description: "Create a full pitch book recommending a strategic transaction to a client, including valuation, deal structure, and risk analysis." },
      ]}
      careerOutcomes={{
        roles: ["Investment Banking Analyst", "Financial Analyst", "Equity Research Associate", "PE Associate", "Corporate Finance Analyst", "M&A Analyst"],
        salaryRange: "₹8-16 LPA",
      }}
      faqs={[
        { question: "Do I need a finance background?", answer: "No. We start from accounting fundamentals and build up. Many of our top performers come from engineering, commerce, or even non-finance backgrounds." },
        { question: "Is this program relevant for Indian IB roles?", answer: "Absolutely. The curriculum covers both global and India-specific deal structures, regulations, and market dynamics. Our hiring partners include Indian and international banks." },
        { question: "How hands-on is the program?", answer: "Extremely. You'll build 5+ full financial models, analyze real deals, and create pitch books. By the end, your portfolio demonstrates you can do the actual work of an IB analyst." },
        { question: "What kind of placement support do you offer?", answer: "Resume building, mock technical and behavioral interviews, networking coaching, and direct introductions to hiring partners at banks, PE firms, and advisory boutiques." },
        { question: "Can I do this alongside a full-time job?", answer: "Yes. We offer flexible scheduling with evening and weekend sessions. All classes are recorded, and you can work through the material at your own pace." },
      ]}
    />
  );
}
