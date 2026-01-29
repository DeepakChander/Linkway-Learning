import type { Metadata } from "next";
import CoursePageTemplate from "@/components/sections/CoursePageTemplate";

export const metadata: Metadata = {
  title: "Data Science & AI Mastery",
  description: "From Python fundamentals to deploying production ML models. Build neural networks, NLP systems, and generative AI applications across 7 comprehensive modules.",
};

export default function DataScienceAIPage() {
  return (
    <CoursePageTemplate
      animationVariant="activetheory"
      name="Data Science & AI Mastery"
      duration="12 Months"
      level="Zero to Expert"
      tagline="From your first Python script to deploying ML in production."
      heroDescription="This is the full ride - Python, statistics, machine learning, deep learning, NLP, generative AI, and production deployment across 7 modules. You'll graduate knowing how to build AI systems that actually run in the real world."
      color="#F5892A"
      whoIsThisFor={[
        { title: "Future Data Scientists", description: "You know data is where the world is heading. This program takes you from the fundamentals all the way to building production AI systems." },
        { title: "Developers Who Want AI Skills", description: "You can already code. Now add ML, deep learning, and MLOps to your toolkit and become the person companies fight to hire." },
        { title: "Career Changers", description: "Doesn't matter what you did before. This 12-month program teaches everything from scratch - no prior ML experience needed." },
        { title: "AI Enthusiasts", description: "If you're fascinated by neural networks, NLP, and generative AI, this is where you go from reading about it to actually building it." },
      ]}
      curriculum={[
        {
          phase: "Module 1",
          title: "Foundations of Data Science",
          duration: "6 Weeks",
          topics: [
            "Excel mastery for rapid data exploration and prototyping",
            "Python & R programming - data structures, OOP, functional programming",
            "Statistics & probability - distributions, hypothesis testing, Bayesian thinking",
            "Visualization tools - Tableau, Power BI, Matplotlib, Seaborn, Plotly",
          ],
        },
        {
          phase: "Module 2",
          title: "Data Wrangling & Analysis",
          duration: "5 Weeks",
          topics: [
            "Data cleaning - handling missing data, duplicates, inconsistent formats at scale",
            "Data transformation - normalization, encoding, binning, log transforms",
            "Feature engineering - domain-driven feature creation, polynomial features, interaction terms",
            "Exploratory data analysis - statistical profiling, correlation analysis, distribution study",
            "Automated data pipelines - building reproducible ETL workflows in Python",
          ],
        },
        {
          phase: "Module 3",
          title: "ML & Predictive Modeling",
          duration: "6 Weeks",
          topics: [
            "Supervised learning - linear/logistic regression, SVMs, decision trees, random forests, gradient boosting (XGBoost, LightGBM)",
            "Unsupervised learning - K-means, DBSCAN, hierarchical clustering, PCA, t-SNE",
            "Model selection & evaluation - cross-validation, hyperparameter tuning, bias-variance tradeoff",
            "Advanced topics - SHAP explainability, ensemble methods, imbalanced data techniques",
          ],
        },
        {
          phase: "Module 4",
          title: "AI Applications: Deep Learning & NLP",
          duration: "7 Weeks",
          topics: [
            "Neural networks fundamentals - perceptrons, backpropagation, activation functions, optimizers",
            "CNNs - image classification, object detection, transfer learning (ResNet, VGG)",
            "RNNs & LSTMs - sequence modeling, text generation, time series with deep learning",
            "NLP - tokenization, word embeddings, BERT, GPT architectures, HuggingFace Transformers",
            "Generative AI - GANs, variational autoencoders, large language models, prompt engineering",
          ],
        },
        {
          phase: "Module 5",
          title: "Advanced Systems",
          duration: "5 Weeks",
          topics: [
            "Time series forecasting - ARIMA, SARIMA, Prophet, deep learning approaches",
            "Recommender systems - collaborative filtering, content-based, hybrid approaches",
            "SQL & databases - advanced queries, joins, window functions, NoSQL (MongoDB)",
            "Big data - Hadoop ecosystem, Apache Spark, PySpark, distributed computing fundamentals",
          ],
        },
        {
          phase: "Module 6",
          title: "MLOps & Deployment",
          duration: "5 Weeks",
          topics: [
            "Cloud platforms - AWS SageMaker, GCP Vertex AI, Azure ML Studio",
            "Model deployment - Flask APIs, FastAPI, containerization with Docker",
            "CI/CD for ML - GitHub Actions, MLflow experiment tracking, model versioning",
            "Monitoring & maintenance - data drift detection, model retraining strategies, A/B testing",
          ],
        },
        {
          phase: "Module 7",
          title: "Specialisations & Career Launchpad",
          duration: "6 Weeks",
          topics: [
            "Domain specialisations - Finance (credit scoring, fraud), Healthcare (diagnostics, drug discovery), E-commerce (personalization), HR (attrition prediction)",
            "Capstone project - end-to-end ML system from problem definition to deployed product",
            "Career launchpad - resume building, portfolio review, mock interviews, hiring partner introductions",
          ],
        },
      ]}
      tools={["Excel", "MySQL", "NoSQL", "Tableau", "Power BI", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Jupyter", "Google Colab", "Python", "R", "Scikit-learn", "Imbalanced-learn", "TensorFlow", "PyTorch", "NLTK", "Statsmodels", "SpaCy", "SAS", "SciPy", "Scrapy", "Flask", "FastAPI", "Hadoop", "Apache Spark", "Git", "AWS", "GCP", "Azure", "Docker", "MongoDB", "Plotly", "XGBoost", "HuggingFace"]}
      projects={[
        { title: "Sentiment Analysis of Tweets", description: "Build an NLP pipeline using BERT and HuggingFace Transformers to classify tweet sentiment in real-time, with a Flask API for live inference." },
        { title: "Credit Scoring & Loan Default Prediction", description: "Develop an XGBoost-powered credit risk model on banking data with SHAP explainability, class imbalance handling, and production-ready scoring." },
        { title: "Fraud Detection Pipeline", description: "Engineer a real-time fraud detection system using anomaly detection, ensemble methods, and automated alerting on streaming transaction data." },
        { title: "Product Recommendation System", description: "Build a hybrid recommender engine combining collaborative filtering and content-based methods, deployed as a scalable microservice." },
        { title: "Spam & Phishing Detection", description: "Create a multi-model NLP classifier that detects spam emails and phishing URLs using text features, URL analysis, and deep learning." },
        { title: "Market Basket Analysis", description: "Apply association rule mining and clustering on retail transaction data to uncover purchase patterns and optimize cross-selling strategies." },
        { title: "End-to-End ML Deployment", description: "Take a model from Jupyter notebook to production: Docker containerization, FastAPI serving, CI/CD with GitHub Actions, and monitoring with MLflow." },
      ]}
      caseStudies={[
        { company: "Tesla", title: "Supply Chain Risk Prediction", description: "Predict supply chain disruptions using time series and external signals. Model risk scores for 200+ component suppliers.", focus: ["Time Series", "Risk Modeling", "XGBoost"] },
        { company: "Google Ads", title: "NLP Keyword Optimization", description: "Classify and cluster ad keywords using NLP to improve bid strategies and ad relevance scoring.", focus: ["NLP", "Clustering", "BERT"] },
        { company: "Quora", title: "Insincere Question Detection", description: "Build a deep learning classifier to identify toxic and insincere questions at scale using LSTM and attention mechanisms.", focus: ["Deep Learning", "NLP", "LSTM"] },
        { company: "Uber", title: "Trip Duration Prediction", description: "Predict ride durations using geospatial features, traffic data, and gradient boosting with real-time feature engineering.", focus: ["Geospatial ML", "Feature Engineering", "LightGBM"] },
        { company: "Amazon", title: "Demand Forecasting", description: "Forecast product demand across warehouses using Prophet and deep learning, optimizing inventory allocation.", focus: ["Forecasting", "Prophet", "Neural Networks"] },
        { company: "Netflix", title: "Content Recommendation Engine", description: "Design a hybrid recommendation system combining matrix factorization and deep collaborative filtering.", focus: ["Recommender Systems", "Deep Learning", "A/B Testing"] },
        { company: "Waymo", title: "Traffic Sign Classification", description: "Build a CNN-based traffic sign classifier using transfer learning with data augmentation and model compression.", focus: ["Computer Vision", "CNNs", "Transfer Learning"] },
      ]}
      careerOutcomes={{
        roles: ["Data Scientist", "ML Engineer", "AI Engineer", "NLP Engineer", "Data Architect", "MLOps Engineer"],
        salaryRange: "₹8-18 LPA",
      }}
      faqs={[
        { question: "Can a complete beginner do this?", answer: "Yes. Module 1 starts with Excel and basic Python. No prior ML or programming experience needed. By month 3, you'll be building real ML models." },
        { question: "How is this different from Data Analytics?", answer: "Data Analytics focuses on visualization and reporting. This goes way deeper - deep learning, NLP, generative AI, MLOps, cloud deployment. It's for people who want to build AI, not just look at dashboards." },
        { question: "What's the capstone project like?", answer: "You build a full ML system end-to-end: define the problem, collect data, train models, deploy a production API, and set up monitoring. Past students have built fraud detectors, medical image classifiers, and chatbots." },
        { question: "Do you cover generative AI?", answer: "Yes - GANs, LLMs, prompt engineering, fine-tuning with HuggingFace. You'll build actual generative AI applications, not just talk about them." },
        { question: "What about placement support?", answer: "Resume reviews, LinkedIn optimization, mock technical interviews, and direct introductions to 40+ hiring partners. We guarantee at least 10 interview opportunities after you complete the program." },
      ]}
    />
  );
}
