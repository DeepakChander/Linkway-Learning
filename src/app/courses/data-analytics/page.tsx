import type { Metadata } from "next";
import CoursePageTemplate from "@/components/sections/CoursePageTemplate";

export const metadata: Metadata = {
  title: "Data Analytics Accelerator",
  description: "Master Excel, SQL, Python, Tableau, Power BI, and ML fundamentals in 6 intensive months. Dedicated Placement Assistance.",
};

export default function DataAnalyticsPage() {
  return (
    <CoursePageTemplate
      animationVariant="orano"
      name="Data Analytics Accelerator"
      duration="6 Months"
      level="Beginner to Advanced"
      tagline="Go from spreadsheets to strategic thinking - in 6 months."
      heroDescription="You'll learn Excel, SQL, Python, Tableau, Power BI, and the basics of Machine Learning - all by working on real business problems. By the end, you'll have a portfolio that speaks for itself and placement assistance that backs it up."
      color="#3B82F6"
      whoIsThisFor={[
        { title: "Career Switchers", description: "Coming from a non-tech background? That's exactly who this was built for. We start from scratch and build up." },
        { title: "Fresh Graduates", description: "College didn't teach you what companies actually need. This will. No coding experience required." },
        { title: "Working Professionals", description: "Learn without quitting your job. We have weekend batches, flexible deadlines, and every class is recorded." },
        { title: "Entrepreneurs", description: "Stop guessing and start knowing. You'll learn to read your own numbers and make smarter business calls." },
      ]}
      curriculum={[
        {
          phase: "Phase 1",
          title: "Foundations",
          duration: "Weeks 1-8",
          topics: [
            "Excel for Analytics - functions, charts, dashboards, forecasting models",
            "Tableau & Power BI - interactive dashboards, storyboards, business reports",
            "Python & R Programming - basics, data structures, functions, libraries",
          ],
        },
        {
          phase: "Phase 2",
          title: "Core Analysis",
          duration: "Weeks 9-16",
          topics: [
            "Statistics & Hypothesis Testing - descriptive, probability, inferential, ANOVA",
            "Data Analysis & Visualization - NumPy, Pandas, Matplotlib, Seaborn",
            "Data Cleaning & Feature Engineering - missing values, outliers, encoding, feature creation",
          ],
        },
        {
          phase: "Phase 3",
          title: "Machine Learning",
          duration: "Weeks 17-24",
          topics: [
            "Supervised Learning - regression, classification, decision trees, random forests, boosting",
            "Unsupervised Learning - K-means, hierarchical clustering, PCA",
            "Time Series & Recommender Systems - ARIMA, SARIMA, recommendation algorithms",
            "Big Data & SQL - MySQL, Spark, PySpark basics",
          ],
        },
      ]}
      tools={["Excel", "MySQL", "Tableau", "Power BI", "Python", "R", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Jupyter", "Google Colab", "Scikit-learn", "Git", "SQL", "PySpark", "Statsmodels", "SciPy"]}
      projects={[
        { title: "Sales Performance Dashboard", description: "Build an interactive Excel + Power BI dashboard analyzing multi-channel sales data with forecasting." },
        { title: "Customer Segmentation Analysis", description: "Use Python + Tableau to segment e-commerce customers by behavior, value, and demographics." },
        { title: "Predictive Analytics Model", description: "Build a Scikit-learn model to predict customer churn using real telecom industry data." },
        { title: "End-to-End Data Pipeline", description: "Design a complete pipeline from SQL data extraction through Python cleaning to visual dashboard output." },
      ]}
      careerOutcomes={{
        roles: ["Data Analyst", "Business Analyst", "BI Analyst", "Data Engineer", "Database Administrator", "Analytics Consultant"],
        salaryRange: "₹6-12 LPA",
      }}
      faqs={[
        { question: "Do I need to know coding?", answer: "Nope. We literally start from the basics - Excel, then SQL, then Python. Everything is taught step by step with exercises, so you're never lost." },
        { question: "What's the schedule like?", answer: "Both weekday and weekend batches are available. Everything is live with a real instructor, and every session gets recorded in case you miss one." },
        { question: "How does placement assistance work?", answer: "Yes. Finish the assignments and projects, and we guarantee up to 10 interviews with companies from our hiring network. We don't stop until you're placed." },
        { question: "Can I pay in EMIs?", answer: "Yes - 0% interest EMI starting at ₹5,500/month. We want cost to be the last thing holding you back." },
        { question: "What certifications do I get?", answer: "A Linkway Learning completion certificate plus prep for the Microsoft Azure AI Fundamentals certification exam." },
      ]}
    />
  );
}
