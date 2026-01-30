import type { Metadata } from "next";
import CoursePageTemplate from "@/components/sections/CoursePageTemplate";

export const metadata: Metadata = {
  title: "Business Intelligence & Strategy",
  description: "Master BI tools, predictive analytics, and AI-powered decision-making. Designed for professionals, MBAs, and business leaders who want to lead with data.",
};

export default function BusinessIntelligencePage() {
  return (
    <CoursePageTemplate
      animationVariant="redbull"
      name="Business Intelligence & Strategy"
      duration="12 Months"
      level="Professional Upskilling"
      tagline="For the people who need data to make better calls."
      heroDescription="You don't need a CS degree to lead with data. This program teaches you BI tools, predictive analytics, and AI-powered decision-making - all designed for professionals and business leaders who want to stop guessing and start knowing."
      color="#F5892A"
      whoIsThisFor={[
        { title: "Working Professionals", description: "You've seen decisions made on gut feelings and it frustrates you. This program makes you the person your team turns to when they need answers backed by data." },
        { title: "MBA Graduates", description: "Your business sense is sharp, but your data skills aren't. Add Power BI, SQL, and predictive analytics to your MBA and watch how fast doors open." },
        { title: "Managers & Team Leads", description: "Stop relying on hunches. Learn to build dashboards, track KPIs, and present data stories that actually change how your company operates." },
        { title: "Career Pivoters", description: "Coming from ops, marketing, or finance? This is analytics for business people - no one expects you to become an engineer." },
      ]}
      curriculum={[
        {
          phase: "Module 1",
          title: "Data Foundations for Business",
          duration: "6 Weeks",
          topics: [
            "Excel power-user mastery - advanced formulas, pivot tables, macros, business modeling",
            "Business dashboards - designing KPI frameworks, executive scorecards, real-time reporting",
            "Python for business automation - data extraction, report generation, email automation",
            "KPI design & metrics strategy - defining, measuring, and tracking business outcomes",
          ],
        },
        {
          phase: "Module 2",
          title: "Business Data Management",
          duration: "5 Weeks",
          topics: [
            "CRM data cleaning - standardizing customer records, deduplication, data quality audits",
            "Market trend EDA - exploratory analysis of industry data, competitor benchmarking",
            "Automated reporting pipelines - scheduled reports, alert systems, stakeholder dashboards",
            "Data governance basics - data cataloging, quality standards, access policies",
          ],
        },
        {
          phase: "Module 3",
          title: "Predictive Business Analytics",
          duration: "6 Weeks",
          topics: [
            "Sales forecasting - time series models, seasonal adjustment, pipeline prediction",
            "Customer churn prediction - logistic regression, survival analysis, retention modeling",
            "Market segmentation - RFM analysis, clustering, persona development",
            "A/B testing & experimentation - statistical significance, test design, ROI measurement",
            "ROI modeling - cost-benefit analysis, attribution modeling, budget optimization",
          ],
        },
        {
          phase: "Module 4",
          title: "AI for Business Leaders",
          duration: "7 Weeks",
          topics: [
            "Neural networks - conceptual understanding for non-engineers, business applications",
            "AI in marketing & operations - recommendation engines, demand forecasting, process automation",
            "Generative AI for business - ChatGPT integration, content automation, AI-powered workflows",
            "AI ethics & governance - bias detection, responsible AI frameworks, regulatory compliance",
          ],
        },
        {
          phase: "Module 5",
          title: "Enterprise Data Systems",
          duration: "5 Weeks",
          topics: [
            "Revenue forecasting - multi-variable models, scenario planning, financial projections",
            "Product recommendation strategy - understanding and leveraging recommendation systems",
            "SQL for business - querying production databases, creating business views, stored procedures",
            "Data warehousing - star schema, ETL processes, dimensional modeling concepts",
            "Dashboard automation - scheduled refreshes, embedded analytics, self-service BI",
          ],
        },
        {
          phase: "Module 6",
          title: "From Insight to Production",
          duration: "5 Weeks",
          topics: [
            "Cloud BI platforms - AWS QuickSight, Power BI Service, Google Looker Studio",
            "Automated report distribution - email subscriptions, Slack integrations, mobile dashboards",
            "Data governance & compliance - GDPR awareness, data security, audit trails",
            "Stakeholder management - presenting to C-suite, data storytelling, executive summaries",
          ],
        },
        {
          phase: "Module 7",
          title: "Specialization & Career Growth",
          duration: "6 Weeks",
          topics: [
            "Finance BI - P&L dashboards, cash flow forecasting, investor reporting",
            "Healthcare BI - patient outcome tracking, operational efficiency, compliance dashboards",
            "Retail BI - inventory optimization, store performance, omnichannel analytics",
            "HR analytics - workforce planning, attrition modeling, engagement scoring",
            "Executive capstone - end-to-end BI strategy for a real business challenge",
            "Interview prep - case study practice, portfolio presentation, mock interviews",
          ],
        },
      ]}
      tools={["Power BI", "Tableau", "Looker", "Excel", "SQL", "Python", "R", "Google Analytics", "AWS QuickSight", "Azure", "NumPy", "Pandas", "Matplotlib", "Jupyter", "Git"]}
      projects={[
        { title: "Revenue Optimization Dashboard", description: "Design a C-suite-ready Power BI dashboard that tracks revenue streams, identifies growth levers, and provides automated weekly insights across business units." },
        { title: "Customer Churn Reduction Strategy", description: "Build a predictive churn model, identify at-risk segments, and present a data-backed retention strategy with projected ROI to stakeholders." },
        { title: "Supply Chain Analytics Platform", description: "Create an end-to-end analytics platform tracking supplier performance, delivery timelines, and inventory costs with automated anomaly detection." },
        { title: "Executive KPI Dashboard", description: "Build a multi-department KPI tracking system with drill-down capabilities, trend analysis, and automated alerting for metric deviations." },
        { title: "Market Segmentation Study", description: "Conduct a full market segmentation analysis using clustering and RFM techniques, delivering actionable personas and targeting recommendations." },
        { title: "Dynamic Pricing Strategy Model", description: "Develop a data-driven pricing model that adjusts recommendations based on demand elasticity, competitor pricing, and seasonal trends." },
      ]}
      careerOutcomes={{
        roles: ["Business Analyst", "BI Analyst", "Analytics Manager", "Strategy Consultant", "Data Analyst", "BI Developer"],
        salaryRange: "₹7-15 LPA",
      }}
      faqs={[
        { question: "Do I need a technical background?", answer: "Not at all. This was built for business people. You'll learn SQL and Python, but always in a business context - think querying sales data or automating reports, not writing backend systems." },
        { question: "How is this different from an MBA analytics elective?", answer: "An MBA elective scratches the surface. This is 12 months of building real dashboards, working with real datasets, and mastering production-grade BI tools. You'll graduate with a portfolio, not just theory." },
        { question: "Can I do this while working full-time?", answer: "That's exactly who it's designed for. Evening and weekend sessions, recorded classes, flexible deadlines. Most of our learners work full-time throughout the program." },
        { question: "What tools will I actually know?", answer: "Power BI, Tableau, Looker, advanced Excel, SQL, and Python for analytics. Plus cloud BI platforms like AWS QuickSight and Google Looker Studio." },
        { question: "What kind of career support do I get?", answer: "Career coaching, LinkedIn optimization, mock case study interviews, and direct intros to hiring partners in analytics, consulting, and strategy. We don't stop until you land the right role." },
      ]}
    />
  );
}
