// =============================================================================
// Linkway Learning - Master Constants File
// =============================================================================

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface Stat {
  number: number;
  suffix: string;
  label: string;
}

export interface WhoIsThisFor {
  title: string;
  description: string;
}

export interface CurriculumItem {
  phase: string;
  title: string;
  duration: string;
  topics: string[];
}

export interface Project {
  title: string;
  description: string;
}

export interface CaseStudy {
  title: string;
  description: string;
}

export interface CareerOutcomes {
  roles: string[];
  salaryRange: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  slug: string;
  name: string;
  duration: string;
  level: string;
  tagline: string;
  description: string;
  heroDescription: string;
  color: string;
  icon: string;
  whoIsThisFor: WhoIsThisFor[];
  curriculum: CurriculumItem[];
  tools: string[];
  projects: Project[];
  caseStudies?: CaseStudy[];
  careerOutcomes: CareerOutcomes;
  faqs: FAQ[];
}

export interface Testimonial {
  name: string;
  previousRole: string;
  currentRole: string;
  company: string;
  desc: string;
}

export interface Instructor {
  name: string;
  experience: string;
  title: string;
  bio: string;
  specializations: string[];
  image: string;
}

export interface FAQCategory {
  category: string;
  questions: { q: string; a: string }[];
}

export interface ComparisonRow {
  feature: string;
  dataAnalytics: string;
  dataScienceAI: string;
  businessIntelligence: string;
}

export interface ComparisonTable {
  columns: string[];
  rows: ComparisonRow[];
}

export interface FooterLinkGroup {
  category: string;
  links: { label: string; href: string }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
}

// -----------------------------------------------------------------------------
// 1. NAV_LINKS
// -----------------------------------------------------------------------------

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Courses",
    href: "/courses",
    children: [
      { label: "Data Analytics", href: "/courses/data-analytics" },
      { label: "Business Analytics", href: "/courses/business-analytics" },
      { label: "Data Science and AI", href: "/courses/data-science-ai" },
      { label: "Agentic AI & Prompt Engineering", href: "/courses/agentic-ai" },
      { label: "Investment Banking", href: "/courses/investment-banking" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const satisfies NavLink[];

// -----------------------------------------------------------------------------
// 2. STATS
// -----------------------------------------------------------------------------

export const STATS: Stat[] = [
  { number: 500, suffix: "+", label: "Careers Transformed" },
  { number: 400, suffix: "+", label: "Hiring Partners" },
  { number: 85, suffix: "%", label: "Average Salary Hike" },
  { number: 100, suffix: "%", label: "100% Placement" },
] as const satisfies Stat[];

// -----------------------------------------------------------------------------
// 3. COURSES
// -----------------------------------------------------------------------------

export const COURSES: Course[] = [
  // -------------------------------------------------------------------------
  // Course 1 - Data Analytics Accelerator
  // -------------------------------------------------------------------------
  {
    id: "course-data-analytics",
    slug: "data-analytics",
    name: "Data Analytics Accelerator",
    duration: "6 Months",
    level: "Beginner to Advanced",
    tagline: "From spreadsheets to strategic insights - fast.",
    description:
      "A comprehensive 6-month program designed to take you from spreadsheet basics to advanced machine learning. Master the tools, techniques, and thinking that drive data-driven decisions across industries.",
    heroDescription:
      "Launch your analytics career in just 6 months. Learn Excel, SQL, Python, R, Tableau, Power BI, and machine learning - with hands-on projects and 100% placement.",
    color: "#4F46E5",
    icon: "BarChart3",
    whoIsThisFor: [
      {
        title: "Fresh Graduates",
        description:
          "Kickstart your career with in-demand analytics skills that employers actively seek.",
      },
      {
        title: "Career Switchers",
        description:
          "Transition from any background into data analytics with a structured, beginner-friendly roadmap.",
      },
      {
        title: "Working Professionals",
        description:
          "Upskill to add data analytics capabilities to your existing domain expertise and accelerate your growth.",
      },
    ],
    curriculum: [
      {
        phase: "Phase 1",
        title: "Foundations",
        duration: "Weeks 1–8",
        topics: [
          "Excel for Analytics - functions, charts, dashboards, forecasting",
          "Tableau & Power BI - interactive dashboards, storyboards, visual best practices",
          "Python & R Programming - basics, data structures, key libraries (NumPy, Pandas)",
        ],
      },
      {
        phase: "Phase 2",
        title: "Core Analysis",
        duration: "Weeks 9–16",
        topics: [
          "Statistics & Hypothesis Testing - descriptive stats, probability, inferential statistics, ANOVA",
          "Data Analysis & Visualization - NumPy, Pandas, Matplotlib, Seaborn for deep analysis",
          "Data Cleaning & Feature Engineering - handling missing values, outliers, encoding categorical data",
        ],
      },
      {
        phase: "Phase 3",
        title: "Machine Learning",
        duration: "Weeks 17–24",
        topics: [
          "Supervised Learning - linear & logistic regression, classification, decision trees, random forests, gradient boosting",
          "Unsupervised Learning - K-means clustering, hierarchical clustering, PCA",
          "Time Series & Recommender Systems - ARIMA, SARIMA, collaborative & content-based filtering",
          "Big Data & SQL - MySQL, Spark fundamentals, PySpark for large-scale data processing",
        ],
      },
    ],
    tools: [
      "Excel",
      "MySQL",
      "Tableau",
      "Power BI",
      "Python",
      "R",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Seaborn",
      "Jupyter",
      "Colab",
      "Scikit-learn",
      "Git",
      "SQL",
      "PySpark",
    ],
    projects: [
      {
        title: "Sales Dashboard",
        description:
          "Build an interactive sales performance dashboard using Excel and Power BI, combining pivot tables with dynamic visuals to surface revenue trends and regional performance.",
      },
      {
        title: "Customer Segmentation",
        description:
          "Use Python clustering algorithms and Tableau to segment customers by behaviour, demographics, and purchase patterns - delivering actionable marketing insights.",
      },
      {
        title: "Predictive Analytics Model",
        description:
          "Develop a Scikit-learn pipeline to predict business outcomes, including data preprocessing, model selection, hyperparameter tuning, and evaluation.",
      },
      {
        title: "End-to-End Data Pipeline",
        description:
          "Design and implement a complete data pipeline using SQL and Python - from raw data extraction and cleaning to transformation and automated reporting.",
      },
    ],
    careerOutcomes: {
      roles: [
        "Data Analyst",
        "Business Analyst",
        "BI Analyst",
        "Data Engineer",
        "Database Administrator",
      ],
      salaryRange: "₹6-12 LPA",
    },
    faqs: [
      {
        question: "Do I need a technical background to join this course?",
        answer:
          "Not at all. The Data Analytics Accelerator is designed for absolute beginners. We start from the basics of Excel and progress step-by-step to advanced machine learning concepts. Many of our successful graduates come from non-technical backgrounds.",
      },
      {
        question: "What kind of projects will I work on?",
        answer:
          "You will work on four industry-grade projects including a Sales Dashboard in Excel & Power BI, Customer Segmentation using Python & Tableau, a Predictive Analytics Model with Scikit-learn, and an End-to-End Data Pipeline with SQL & Python.",
      },
      {
        question: "Is this course enough to land a data analyst job?",
        answer:
          "Yes. The curriculum covers every skill that hiring managers look for - Excel, SQL, Python, Tableau/Power BI, statistics, and machine learning. Combined with our 100% placement, you will be fully prepared.",
      },
      {
        question: "How much time do I need to dedicate per week?",
        answer:
          "We recommend 15–20 hours per week. This includes live sessions, self-paced practice, and project work. The schedule is designed for working professionals and students alike.",
      },
      {
        question: "Will I get a certificate on completion?",
        answer:
          "Yes. Upon completing all modules, projects, and assessments, you will receive an industry-recognised Linkway Learning certificate that you can showcase on LinkedIn and your resume.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Course 2 - Data Science & AI Mastery
  // -------------------------------------------------------------------------
  {
    id: "course-data-science-ai",
    slug: "data-science-ai",
    name: "Data Science & AI Mastery",
    duration: "12 Months",
    level: "Zero to Expert",
    tagline: "Master the full AI lifecycle - from data to deployment.",
    description:
      "An intensive 12-month program that takes you from zero to expert across the entire data science and AI landscape. From Python fundamentals to deploying production-grade ML models, this program covers it all.",
    heroDescription:
      "Become a complete data scientist and AI engineer in 12 months. Master Python, machine learning, deep learning, NLP, Generative AI, MLOps, and cloud deployment - with 7+ real-world projects and 100% placement.",
    color: "#7C3AED",
    icon: "Brain",
    whoIsThisFor: [
      {
        title: "Aspiring Data Scientists",
        description:
          "Build a world-class foundation in data science and AI from the ground up, with no prior experience required.",
      },
      {
        title: "Software Engineers",
        description:
          "Transition into AI/ML roles by adding deep learning, NLP, and MLOps skills to your engineering toolkit.",
      },
      {
        title: "Analytics Professionals",
        description:
          "Advance from analysis to building and deploying intelligent systems that drive business value at scale.",
      },
    ],
    curriculum: [
      {
        phase: "Module 1",
        title: "Foundations of Data Science",
        duration: "6 Weeks",
        topics: [
          "Excel for data exploration and business analysis",
          "Python programming - variables, data structures, functions, OOP",
          "R programming - statistical computing and visualisation",
          "Statistics - descriptive, inferential, probability distributions",
          "Data Visualization - Matplotlib, Seaborn, Plotly fundamentals",
        ],
      },
      {
        phase: "Module 2",
        title: "Data Wrangling & Analysis",
        duration: "5 Weeks",
        topics: [
          "Data Cleaning - handling missing data, duplicates, inconsistencies",
          "Data Transformation - merging, reshaping, aggregation with Pandas",
          "Feature Engineering - creating predictive features from raw data",
          "Exploratory Data Analysis (EDA) - systematic data investigation",
          "Data Pipelines - building automated ETL workflows",
        ],
      },
      {
        phase: "Module 3",
        title: "ML & Predictive Modeling",
        duration: "6 Weeks",
        topics: [
          "Supervised Learning - regression, classification, SVMs, ensemble methods",
          "Unsupervised Learning - clustering, dimensionality reduction, anomaly detection",
          "Model Selection - cross-validation, hyperparameter tuning, bias-variance tradeoff",
          "Advanced Techniques - SHAP values, ensemble stacking, XGBoost, LightGBM",
        ],
      },
      {
        phase: "Module 4",
        title: "AI Applications: Deep Learning & NLP",
        duration: "7 Weeks",
        topics: [
          "Neural Networks - perceptrons, backpropagation, activation functions, optimisers",
          "CNNs - image classification, object detection, transfer learning",
          "RNNs & LSTMs - sequence modeling, text generation, attention mechanisms",
          "NLP - tokenisation, embeddings, BERT, GPT, transformer architectures",
          "Generative AI - GANs, diffusion models, LLM fine-tuning, prompt engineering",
        ],
      },
      {
        phase: "Module 5",
        title: "Advanced Systems",
        duration: "5 Weeks",
        topics: [
          "Time Series Analysis - ARIMA, SARIMA, Prophet, seasonal decomposition",
          "Recommender Systems - collaborative filtering, content-based, hybrid approaches",
          "SQL & Databases - advanced queries, window functions, stored procedures",
          "Big Data - Hadoop ecosystem, Spark, PySpark, distributed computing",
        ],
      },
      {
        phase: "Module 6",
        title: "MLOps & Deployment",
        duration: "5 Weeks",
        topics: [
          "Cloud Platforms - AWS SageMaker, GCP Vertex AI, Azure ML fundamentals",
          "Model Serving - Flask, FastAPI, REST APIs for ML models",
          "Containerisation - Docker for reproducible ML environments",
          "CI/CD for ML - automated training, testing, and deployment pipelines",
          "Monitoring - model drift detection, performance tracking, A/B testing in production",
        ],
      },
      {
        phase: "Module 7",
        title: "Specializations & Career Launchpad",
        duration: "6 Weeks",
        topics: [
          "Domain Specialization - Finance, Healthcare, E-commerce, HR analytics",
          "Capstone Projects - end-to-end industry projects with mentorship",
          "Resume Building - ATS-optimised profiles, portfolio creation",
          "Interview Preparation - technical rounds, case studies, HR strategies",
        ],
      },
    ],
    tools: [
      "Excel",
      "MySQL",
      "NoSQL",
      "Tableau",
      "Power BI",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Seaborn",
      "Jupyter",
      "Colab",
      "Python",
      "R",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "NLTK",
      "Statsmodels",
      "SpaCy",
      "SAS",
      "SciPy",
      "Scrapy",
      "Flask",
      "FastAPI",
      "Hadoop",
      "Spark",
      "Git",
      "AWS",
      "GCP",
      "Azure",
      "Docker",
      "MongoDB",
      "Plotly",
      "XGBoost",
      "MLflow",
      "HuggingFace",
    ],
    projects: [
      {
        title: "Sentiment Analysis Engine",
        description:
          "Build an NLP pipeline to classify product reviews as positive, negative, or neutral using BERT and fine-tuned transformer models.",
      },
      {
        title: "Credit Scoring Model",
        description:
          "Develop a production-grade credit risk model using ensemble methods, feature engineering, and SHAP-based explainability.",
      },
      {
        title: "Fraud Detection Pipeline",
        description:
          "Design a real-time fraud detection system using anomaly detection, class imbalance techniques, and streaming data processing.",
      },
      {
        title: "Recommendation System",
        description:
          "Build a hybrid recommendation engine combining collaborative filtering and content-based approaches for personalised suggestions.",
      },
      {
        title: "Spam Detection Classifier",
        description:
          "Create an NLP-based spam classifier using tokenisation, TF-IDF, and deep learning for accurate email and message filtering.",
      },
      {
        title: "Market Basket Analysis",
        description:
          "Apply association rule mining (Apriori, FP-Growth) on retail data to uncover product affinities and cross-sell opportunities.",
      },
      {
        title: "End-to-End ML Deployment",
        description:
          "Take a trained model from notebook to production - build a REST API with FastAPI, containerise with Docker, and deploy to AWS with CI/CD.",
      },
    ],
    caseStudies: [
      {
        title: "Tesla - Supply Chain Risk Prediction",
        description:
          "Analyse supply chain data to predict disruption risks and optimise inventory management using time-series and ML models.",
      },
      {
        title: "Google Ads - NLP Keyword Optimisation",
        description:
          "Apply NLP techniques to optimise keyword targeting and ad relevance scoring for improved campaign performance.",
      },
      {
        title: "Quora - Insincere Questions Detection",
        description:
          "Build a text classification model to identify insincere or toxic questions using deep learning and NLP.",
      },
      {
        title: "Uber - Trip Duration Prediction",
        description:
          "Predict trip durations using geospatial features, traffic patterns, and ensemble machine learning models.",
      },
      {
        title: "Amazon - Demand Forecasting",
        description:
          "Forecast product demand across categories using time-series analysis, Prophet, and gradient boosting.",
      },
      {
        title: "Netflix - Recommendation Engine",
        description:
          "Explore how collaborative filtering and deep learning power Netflix's personalised content recommendations.",
      },
      {
        title: "Waymo - Traffic Sign Recognition",
        description:
          "Apply CNNs and transfer learning to recognise and classify traffic signs from autonomous vehicle camera feeds.",
      },
    ],
    careerOutcomes: {
      roles: [
        "Data Scientist",
        "ML Engineer",
        "AI Engineer",
        "NLP Engineer",
        "Data Architect",
        "MLOps Engineer",
      ],
      salaryRange: "₹8-18 LPA",
    },
    faqs: [
      {
        question:
          "Is this course suitable for someone with no programming experience?",
        answer:
          "Absolutely. Module 1 starts from scratch with Python and R fundamentals. Our step-by-step approach ensures that even complete beginners build a strong foundation before advancing to complex AI topics.",
      },
      {
        question: "How is this different from the Data Analytics Accelerator?",
        answer:
          "The Data Analytics Accelerator focuses on analytics tools and techniques over 6 months. This program goes far beyond - covering deep learning, NLP, Generative AI, MLOps, and cloud deployment over 12 months, preparing you for data scientist and AI engineer roles.",
      },
      {
        question: "What makes the capstone projects stand out?",
        answer:
          "Our capstone projects are modelled on real industry challenges from companies like Tesla, Google, Netflix, and Amazon. You work end-to-end - from problem definition to deployment - building a portfolio that hiring managers recognise.",
      },
      {
        question: "Will I learn Generative AI and LLMs?",
        answer:
          "Yes. Module 4 covers Generative AI in depth, including GANs, diffusion models, LLM fine-tuning, and prompt engineering. You will gain hands-on experience with HuggingFace transformers and build your own generative applications.",
      },
      {
        question: "What placement support is provided?",
        answer:
          "100% placement.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Course 3 - Business Intelligence & Strategy
  // -------------------------------------------------------------------------
  {
    id: "course-business-intelligence",
    slug: "business-intelligence",
    name: "Business Intelligence & Strategy",
    duration: "12 Months",
    level: "Professional Upskilling",
    tagline: "Turn data into decisions that move businesses forward.",
    description:
      "A 12-month professional program designed for business leaders, managers, and professionals who want to harness data for strategic decision-making - without needing to become full-time data scientists.",
    heroDescription:
      "Become a data-driven business leader in 12 months. Master Power BI, Tableau, SQL, predictive analytics, and AI strategy - with executive-level projects and career acceleration support.",
    color: "#0891B2",
    icon: "TrendingUp",
    whoIsThisFor: [
      {
        title: "Business Managers & Leads",
        description:
          "Make smarter, faster decisions by learning to extract insights from data and build compelling dashboards.",
      },
      {
        title: "Marketing & Operations Professionals",
        description:
          "Add analytics and BI skills to your domain expertise to drive measurable outcomes across campaigns and processes.",
      },
      {
        title: "Entrepreneurs & Consultants",
        description:
          "Leverage data to refine strategy, identify market opportunities, and communicate insights to stakeholders.",
      },
    ],
    curriculum: [
      {
        phase: "Module 1",
        title: "Data Foundations for Business",
        duration: "6 Weeks",
        topics: [
          "Excel Power-User - advanced formulas, macros, scenario analysis",
          "Business Dashboards - designing executive-ready visual reports",
          "Python Automation - automating repetitive business tasks with scripts",
          "KPI Design - defining, tracking, and reporting on key performance indicators",
        ],
      },
      {
        phase: "Module 2",
        title: "Business Data Management",
        duration: "5 Weeks",
        topics: [
          "CRM Data Cleaning - standardising customer data for reliable analysis",
          "Market Trend EDA - exploring industry and competitor data systematically",
          "Automated Reporting - building scheduled reports that update themselves",
          "Data Quality Frameworks - ensuring accuracy, completeness, and consistency",
        ],
      },
      {
        phase: "Module 3",
        title: "Predictive Business Analytics",
        duration: "6 Weeks",
        topics: [
          "Sales Forecasting - predicting revenue using regression and time-series models",
          "Churn Prediction - identifying at-risk customers before they leave",
          "Market Segmentation - grouping customers for targeted strategies",
          "A/B Testing - designing and analysing experiments for data-driven decisions",
          "ROI Modeling - quantifying the return on marketing, product, and operational investments",
        ],
      },
      {
        phase: "Module 4",
        title: "AI for Business Leaders",
        duration: "7 Weeks",
        topics: [
          "Neural Networks - understanding AI from a no-code, strategic perspective",
          "AI in Marketing & Operations - real use cases for automation and personalisation",
          "Generative AI for Business - leveraging ChatGPT, Copilot, and AI tools for productivity",
          "AI Ethics & Governance - responsible AI adoption, bias awareness, compliance",
        ],
      },
      {
        phase: "Module 5",
        title: "Enterprise Data Systems",
        duration: "5 Weeks",
        topics: [
          "Revenue Forecasting - advanced models for financial planning",
          "SQL for Business - querying databases to answer strategic questions",
          "Data Warehouse Concepts - understanding data lakes, warehouses, and marts",
          "Dashboard Automation - Power BI Service, Tableau Server, scheduled refreshes",
        ],
      },
      {
        phase: "Module 6",
        title: "From Insight to Production",
        duration: "5 Weeks",
        topics: [
          "Cloud BI - AWS QuickSight, Power BI Service, Looker for enterprise reporting",
          "Automated Reports - building self-refreshing executive dashboards",
          "Data Governance - security, access control, compliance frameworks",
          "Stakeholder Communication - presenting data stories to C-suite audiences",
        ],
      },
      {
        phase: "Module 7",
        title: "Specialization & Career Growth",
        duration: "6 Weeks",
        topics: [
          "Domain BI - Finance, Healthcare, Retail, and HR business intelligence",
          "Executive Capstone - end-to-end BI project with strategic recommendations",
          "Interview Preparation - case study walkthroughs, stakeholder simulations",
          "Leadership in Analytics - building and managing data-driven teams",
        ],
      },
    ],
    tools: [
      "Power BI",
      "Tableau",
      "Looker",
      "Excel",
      "SQL",
      "Python",
      "R",
      "Google Analytics",
      "AWS QuickSight",
      "Azure",
      "NumPy",
      "Pandas",
    ],
    projects: [
      {
        title: "Revenue Optimisation Dashboard",
        description:
          "Build an interactive Power BI dashboard that tracks revenue streams, identifies growth opportunities, and surfaces actionable insights for the leadership team.",
      },
      {
        title: "Customer Churn Analysis",
        description:
          "Analyse customer behaviour data to predict churn risk, segment at-risk customers, and recommend targeted retention strategies.",
      },
      {
        title: "Supply Chain Analytics",
        description:
          "Create a comprehensive supply chain monitoring dashboard that tracks inventory levels, supplier performance, and delivery metrics.",
      },
      {
        title: "Executive KPI Dashboard",
        description:
          "Design a C-suite-ready dashboard combining financial, operational, and customer metrics with drill-down capabilities and automated alerts.",
      },
      {
        title: "Market Segmentation Study",
        description:
          "Apply clustering and RFM analysis to segment a customer base, profile each segment, and develop tailored marketing strategies.",
      },
      {
        title: "Pricing Strategy Model",
        description:
          "Build a data-driven pricing model that analyses elasticity, competitor positioning, and willingness-to-pay to recommend optimal price points.",
      },
    ],
    careerOutcomes: {
      roles: [
        "Business Analyst",
        "BI Analyst",
        "Analytics Manager",
        "Strategy Consultant",
        "Data Analyst",
      ],
      salaryRange: "₹7-15 LPA",
    },
    faqs: [
      {
        question: "Do I need coding experience for this course?",
        answer:
          "No. While we introduce Python and SQL, the focus is on business applications. You will learn to use these tools at a practical level - writing queries and automating tasks - without needing to become a software developer.",
      },
      {
        question: "How is this different from the Data Science & AI course?",
        answer:
          "This program is designed for business professionals. Instead of building ML models from scratch, you learn to leverage AI strategically, build executive dashboards, and drive data-informed decisions. The focus is on business impact, not engineering.",
      },
      {
        question: "Is this suitable for senior professionals and managers?",
        answer:
          "Absolutely. The curriculum is specifically designed for professionals who make or influence business decisions. Many of our students are team leads, managers, and directors looking to add data-driven strategy to their leadership toolkit.",
      },
      {
        question: "What tools will I master?",
        answer:
          "You will become proficient in Power BI, Tableau, Looker, Excel (advanced), SQL, Python for automation, Google Analytics, and cloud BI platforms like AWS QuickSight and Azure.",
      },
      {
        question: "Can I do this alongside a full-time job?",
        answer:
          "Yes. The program is structured for working professionals with weekend live sessions and flexible self-paced content. Most students dedicate 12–15 hours per week comfortably alongside their jobs.",
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// 4. TESTIMONIALS
// -----------------------------------------------------------------------------

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aditya Srivastava",
    previousRole: "Full-Stack Developer",
    currentRole: "Junior Data Scientist",
    company: "Globussoft",
    desc: "Transitioned from full-stack development into data science through structured learning and hands-on projects. Currently working on real-world computer vision and forecasting problems.",
  },
  {
    name: "Arpit Jain",
    previousRole: "Hospitality Professional",
    currentRole: "Business Analyst",
    company: "EaseMyTrip",
    desc: "Moved from the hospitality domain into business analytics by building strong SQL and analytical skills. Now analyzing booking trends and customer behavior to drive business decisions.",
  },
  {
    name: "Junaid Khan",
    previousRole: "Operations & Banking",
    currentRole: "Business Analyst",
    company: "Razorpay",
    desc: "Transitioned from operations and banking into business analytics. Currently contributing to data-driven initiatives in a fast-paced fintech environment.",
  },
  {
    name: "Rajeev Chauhan",
    previousRole: "Operations Executive",
    currentRole: "Business Research Analyst",
    company: "EXL",
    desc: "Shifted from operations roles into analytics and business research. Now supporting strategic decision-making through data analysis in a global tech organization.",
  },
  {
    name: "Rehan Siddiqui",
    previousRole: "Non-Tech Background",
    currentRole: "Data Analyst",
    company: "Amazon",
    desc: "Transitioned into data analytics by gaining hands-on experience with Tableau, Power BI, and real business datasets. Currently solving practical business problems using data.",
  },
  {
    name: "Shivani Rawat",
    previousRole: "Operations & Product",
    currentRole: "Business Analyst",
    company: "Booking.com",
    desc: "Moved from operations and product functions into IT business analysis. Now working on requirement analysis and process improvements for digital travel solutions.",
  },
  {
    name: "Shalendra Gupta",
    previousRole: "Sales Executive",
    currentRole: "Business Analyst",
    company: "Vishal Mega Mart",
    desc: "Transitioned from sales into business analytics by mastering Excel and Power BI. Currently supporting retail strategy with data-driven insights.",
  },
  {
    name: "Syed Nehal",
    previousRole: "HR & Accounting",
    currentRole: "Data Analyst",
    company: "Safegraph",
    desc: "Shifted from HR and accounting into data analytics through project-based learning. Now working as a hybrid data analyst in a global organization.",
  },
  {
    name: "Vansh Pathak",
    previousRole: "Accounting Intern",
    currentRole: "Reporting Analyst",
    company: "Accenture",
    desc: "Moved from accounting internships into reporting and analytics. Currently delivering business reports using SQL and Excel.",
  },
];

// -----------------------------------------------------------------------------
// 5. HIRING_PARTNERS
// -----------------------------------------------------------------------------

export const HIRING_PARTNERS: string[] = [
  "Amazon", "Google", "Razorpay", "Booking.com", "Accenture",
  "EXL", "EaseMyTrip", "Globussoft", "Safegraph", "Vishal Mega Mart",
  "TCS", "Tech Mahindra", "Saint-Gobain", "BNY Mellon", "Turing",
  "IDFC First Bank", "AXA", "Juniper Networks", "iOPEX", "Fractal",
  "Sony Pictures", "AT&T", "SpringWorks", "Uptime AI", "MUFG",
  "MiQ", "HUL", "Deloitte", "Genpact", "Sprinklr",
  "Bandhan Bank", "GlobalLogic", "Tiger Analytics", "Wipro", "Epsilon",
  "Fujitsu", "PlanSource", "Siemens", "Paytm", "Citi",
] as const satisfies string[];

// -----------------------------------------------------------------------------
// 6. INSTRUCTORS
// -----------------------------------------------------------------------------

export const INSTRUCTORS: Instructor[] = [
  {
    name: "Akshat Khandelwal",
    experience: "5+ years",
    title: "Senior Finance BI Developer, Autodesk",
    image: "/images/instructors/akshat-khandelwal.jpeg",
    bio: "Business Analyst and Finance BI professional with over 5+ years of experience in data analytics and business intelligence. Currently a Senior Finance BI Developer at Autodesk, he specializes in Power BI, Python, and SQL to deliver insightful dashboards and data-driven solutions. With prior experience at Allen Digital, Akshat brings strong analytical thinking and a results-focused approach to business problem-solving.",
    specializations: ["Power BI", "Python", "SQL", "Finance BI"],
  },
  {
    name: "Prabhat Sinha",
    experience: "9+ years",
    title: "Data Scientist, Cognizant",
    image: "/images/instructors/prabhat-sinha.jpeg",
    bio: "Data Scientist with 9+ years of experience at Cognizant, specializing in Python, Exploratory Data Analysis, and advanced analytics. He has worked on transforming complex data into actionable insights, supporting data-driven decision-making across projects. Known for his strong analytical thinking, problem-solving skills, and ability to deliver scalable, business-focused solutions through data.",
    specializations: ["Python", "EDA", "Advanced Analytics"],
  },
  {
    name: "Heena Arora",
    experience: "3+ years",
    title: "Associate Data Scientist, PwC (ex-Amazon)",
    image: "/images/instructors/heena-arora.jpeg",
    bio: "Associate Data Scientist at PwC with experience in image analytics using Python and SQL. She works on analyzing visual data and building data-driven insights to support business requirements. Has prior experience at Amazon, where she handled international processes and stakeholder queries, strengthening her analytical and problem-solving skills.",
    specializations: ["Data Science", "Image Analytics", "Python", "SQL"],
  },
  {
    name: "Anand Tripathi",
    experience: "1+ year",
    title: "Data Analyst, Google",
    image: "/images/instructors/anand-tripathi.jpeg",
    bio: "Data Analyst at Google with hands-on experience in analyzing data to support product and business decisions. Skilled in working with large datasets, deriving actionable insights, and collaborating with cross-functional teams. Known for strong analytical thinking and a structured, problem-solving approach.",
    specializations: ["Data Analytics", "Big Data", "Product Analytics"],
  },
];

// -----------------------------------------------------------------------------
// 7. FAQS
// -----------------------------------------------------------------------------

export const FAQS: FAQCategory[] = [
  {
    category: "General",
    questions: [
      {
        q: "What is Linkway Learning?",
        a: "Linkway Learning is a career-focused data science and analytics institute that provides industry-aligned courses, hands-on projects, and 100% placement. We help learners transition into high-growth data careers through structured programs taught by industry practitioners.",
      },
      {
        q: "Who are the instructors?",
        a: "Our instructors are experienced industry professionals from companies like PwC, Amazon, and leading AI firms. Each instructor has 3–8+ years of hands-on experience in their specialisation and brings real-world project insights into every session.",
      },
      {
        q: "What is the mode of learning?",
        a: "We offer a blended learning model - live instructor-led sessions combined with self-paced content, recorded lectures, hands-on labs, and 1-on-1 mentorship. Weekend batches are available for working professionals.",
      },
      {
        q: "Is there a community or peer network?",
        a: "Yes. Every student gets access to our active alumni and peer community on Slack and LinkedIn. You can collaborate on projects, share opportunities, and network with 500+ data professionals across industries.",
      },
    ],
  },
  {
    category: "Courses",
    questions: [
      {
        q: "How do I choose the right course?",
        a: "If you want to enter analytics quickly, choose the 6-month Data Analytics Accelerator. If you want a comprehensive AI/ML career, choose the 12-month Data Science & AI Mastery. If you are a business professional looking to leverage data strategically, choose Business Intelligence & Strategy. Our counsellors can help you decide based on your background and goals.",
      },
      {
        q: "Can I switch between courses after enrolling?",
        a: "Yes, you can upgrade or switch courses within the first 4 weeks of enrolment. Our team will help you transition smoothly and adjust your learning path accordingly.",
      },
      {
        q: "Are the courses self-paced or scheduled?",
        a: "Each course has a structured schedule with live sessions, but all lectures are recorded and available for replay. Project deadlines are flexible, and you can access course material anytime during and after the program.",
      },
      {
        q: "Do I get lifetime access to course materials?",
        a: "Yes. Once enrolled, you get lifetime access to all recorded sessions, notes, assignments, and project resources. You also receive access to any future curriculum updates at no additional cost.",
      },
    ],
  },
  {
    category: "Placement",
    questions: [
      {
        q: "What is the placement rate at Linkway?",
        a: "100% placement.",
      },
      {
        q: "What companies hire from Linkway?",
        a: "Our 400+ hiring partners include TCS, Deloitte, Google, Amazon, IBM, Flipkart, Infosys, Wipro, Paytm, Siemens, Citi, and many more. Students are placed across startups, mid-sized companies, and Fortune 500 organisations.",
      },
      {
        q: "What is the average salary hike after the program?",
        a: "Our graduates see an average salary hike of 85%. Depending on the course and prior experience, salary ranges are ₹6–12 LPA for Data Analytics, ₹8–18 LPA for Data Science & AI, and ₹7–15 LPA for Business Intelligence roles.",
      },
    ],
  },
  {
    category: "Pricing",
    questions: [
      {
        q: "What are the fee structures for the courses?",
        a: "Course fees vary by program. Please contact our admissions team or book a free counselling session to get detailed fee information, available discounts, and scholarship options.",
      },
      {
        q: "Are there EMI options available?",
        a: "Yes, we offer flexible EMI options with 0% interest through our financing partners. You can spread your payments over 6, 9, or 12 months depending on the program.",
      },
      {
        q: "Is there a refund policy?",
        a: "Yes. If you wish to withdraw within the first 14 days of the program, you are eligible for a full refund. After 14 days, partial refunds are available based on the stage of completion. Full details are shared during enrolment.",
      },
      {
        q: "Are there scholarships or early-bird discounts?",
        a: "Yes, we offer early-bird discounts, group enrolment discounts, and merit-based scholarships. Reach out to our admissions team to learn about current offers and eligibility criteria.",
      },
    ],
  },
  {
    category: "Certification",
    questions: [
      {
        q: "Will I receive a certificate on completion?",
        a: "Yes. Upon successfully completing all modules, projects, and assessments, you will receive an industry-recognised Linkway Learning certificate. This can be added to your LinkedIn profile and resume.",
      },
      {
        q: "Is the certificate recognised by employers?",
        a: "Absolutely. Our certificates are well-recognised across the industry, backed by our hiring partner network. More importantly, the hands-on projects and portfolio you build during the program serve as the strongest proof of your skills to employers.",
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// 8. COMPARISON_TABLE
// -----------------------------------------------------------------------------

export const COMPARISON_TABLE: ComparisonTable = {
  columns: [
    "Feature",
    "Data Analytics Accelerator",
    "Data Science & AI Mastery",
    "Business Intelligence & Strategy",
  ],
  rows: [
    {
      feature: "Duration",
      dataAnalytics: "6 Months",
      dataScienceAI: "12 Months",
      businessIntelligence: "12 Months",
    },
    {
      feature: "Level",
      dataAnalytics: "Beginner to Advanced",
      dataScienceAI: "Zero to Expert",
      businessIntelligence: "Professional Upskilling",
    },
    {
      feature: "Focus",
      dataAnalytics: "Analytics & Visualization",
      dataScienceAI: "Full AI/ML Lifecycle",
      businessIntelligence: "Business Strategy & BI",
    },
    {
      feature: "Python & R",
      dataAnalytics: "Yes",
      dataScienceAI: "Yes (Advanced)",
      businessIntelligence: "Yes (Business focus)",
    },
    {
      feature: "SQL & Databases",
      dataAnalytics: "MySQL, PySpark",
      dataScienceAI: "MySQL, NoSQL, Hadoop, Spark",
      businessIntelligence: "SQL, Data Warehouses",
    },
    {
      feature: "Excel",
      dataAnalytics: "Yes",
      dataScienceAI: "Yes",
      businessIntelligence: "Advanced (Power-User)",
    },
    {
      feature: "Tableau / Power BI",
      dataAnalytics: "Yes",
      dataScienceAI: "Yes",
      businessIntelligence: "Yes + Looker",
    },
    {
      feature: "Machine Learning",
      dataAnalytics: "Supervised & Unsupervised",
      dataScienceAI: "Advanced ML + Deep Learning",
      businessIntelligence: "Predictive Analytics",
    },
    {
      feature: "Deep Learning & NLP",
      dataAnalytics: "No",
      dataScienceAI: "CNNs, RNNs, Transformers, BERT, GPT",
      businessIntelligence: "AI Concepts (No-code)",
    },
    {
      feature: "Generative AI",
      dataAnalytics: "No",
      dataScienceAI: "GANs, LLM Fine-tuning",
      businessIntelligence: "Business AI Tools",
    },
    {
      feature: "MLOps & Deployment",
      dataAnalytics: "No",
      dataScienceAI: "Docker, CI/CD, Cloud",
      businessIntelligence: "Cloud BI Platforms",
    },
    {
      feature: "Projects",
      dataAnalytics: "4 Projects",
      dataScienceAI: "7 Projects + 7 Case Studies",
      businessIntelligence: "6 Projects",
    },
    {
      feature: "Salary Range",
      dataAnalytics: "₹6-12 LPA",
      dataScienceAI: "₹8-18 LPA",
      businessIntelligence: "₹7-15 LPA",
    },
    {
      feature: "Target Roles",
      dataAnalytics: "Data Analyst, BI Analyst",
      dataScienceAI: "Data Scientist, ML Engineer, AI Engineer",
      businessIntelligence: "Business Analyst, Analytics Manager",
    },
    {
      feature: "100% Placement",
      dataAnalytics: "Yes - 100%",
      dataScienceAI: "Yes - 100%",
      businessIntelligence: "Yes - 100%",
    },
  ],
};

// -----------------------------------------------------------------------------
// 9. FOOTER_LINKS
// -----------------------------------------------------------------------------

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    category: "Programs",
    links: [
      { label: "Data Analytics", href: "/courses/data-analytics" },
      { label: "Business Analytics", href: "/courses/business-analytics" },
      { label: "Data Science and AI", href: "/courses/data-science-ai" },
      { label: "Agentic AI & Prompt Engineering", href: "/courses/agentic-ai" },
      { label: "Investment Banking", href: "/courses/investment-banking" },
      { label: "Compare Courses", href: "/courses/compare" },
    ],
  },
  {
    category: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Hiring Partners", href: "/hiring-partners" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    category: "Resources",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Curriculum Download", href: "/resources/curriculum" },
      { label: "Free Masterclass", href: "/resources/masterclass" },
      { label: "Career Guide", href: "/resources/career-guide" },
    ],
  },
  {
    category: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

// -----------------------------------------------------------------------------
// 10. BLOG_POSTS
// -----------------------------------------------------------------------------

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "data-analyst-vs-data-scientist-which-career-is-right",
    title: "Data Analyst vs Data Scientist - Which Career Path Is Right for You?",
    excerpt:
      "Confused between data analytics and data science? We break down the skills, salaries, roles, and growth trajectories to help you pick the path that aligns with your goals.",
    category: "Career Guide",
    date: "2025-12-15",
    readTime: "8 min read",
  },
  {
    slug: "top-python-libraries-for-data-science-2026",
    title: "Top 15 Python Libraries Every Data Scientist Must Know in 2026",
    excerpt:
      "From NumPy and Pandas to HuggingFace and LangChain - a practical guide to the Python libraries powering modern data science and AI workflows.",
    category: "Technical",
    date: "2025-12-28",
    readTime: "10 min read",
  },
  {
    slug: "how-to-build-data-science-portfolio",
    title: "How to Build a Data Science Portfolio That Gets You Hired",
    excerpt:
      "Hiring managers share what they actually look for in candidate portfolios. Learn how to showcase your projects, code, and thinking to stand out from the crowd.",
    category: "Career Guide",
    date: "2026-01-05",
    readTime: "7 min read",
  },
  {
    slug: "generative-ai-transforming-business-2026",
    title: "How Generative AI Is Transforming Business in 2026",
    excerpt:
      "From automated reporting to AI-powered customer engagement - explore the real-world business applications of Generative AI and what it means for your career.",
    category: "Industry Trends",
    date: "2026-01-12",
    readTime: "9 min read",
  },
  {
    slug: "sql-interview-questions-data-roles",
    title: "30 SQL Interview Questions You Must Practice for Data Roles",
    excerpt:
      "A curated list of SQL questions asked at top companies like Google, Amazon, and Flipkart - with explanations, sample queries, and tips to ace your technical rounds.",
    category: "Interview Prep",
    date: "2026-01-20",
    readTime: "12 min read",
  },
];
