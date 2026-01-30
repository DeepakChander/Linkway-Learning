import type { Metadata } from "next";
import CoursePageTemplate from "@/components/sections/CoursePageTemplate";

export const metadata: Metadata = {
  title: "Agentic AI & Prompt Engineering",
  description: "Master the art of building autonomous AI agents. Learn prompt engineering, LangChain, and agentic workflows to build AI systems that think, plan, and execute.",
};

export default function AgenticAIPage() {
  return (
    <CoursePageTemplate
      animationVariant="activetheory"
      name="Agentic AI & Prompt Engineering"
      duration="6 Months"
      level="Intermediate to Advanced"
      tagline="Build autonomous AI agents that think and execute."
      heroDescription="Learn to design, build, and deploy AI agents that think, plan, and execute. From prompt engineering fundamentals to agentic workflows with LangChain and OpenAI - this is the future of AI, and you'll be building it."
      color="#8B5CF6"
      whoIsThisFor={[
        { title: "Software Developers", description: "You already code. Now learn to build AI agents that automate complex workflows, reason through problems, and interact with APIs autonomously." },
        { title: "Data Scientists", description: "Take your ML skills to the next level. Build agents that combine your models with real-world decision-making and tool usage." },
        { title: "AI Enthusiasts", description: "You've used ChatGPT. Now learn to build systems like it. From prompt engineering to multi-agent orchestration." },
        { title: "Product Managers", description: "Understand what's possible with agentic AI so you can design better products and lead AI-first teams." },
      ]}
      curriculum={[
        {
          phase: "Module 1",
          title: "Prompt Engineering Foundations",
          duration: "4 Weeks",
          topics: [
            "Prompt design principles - zero-shot, few-shot, chain-of-thought, role-based prompting",
            "LLM fundamentals - tokens, temperature, context windows, model selection",
            "OpenAI API mastery - completions, chat, embeddings, function calling",
            "Prompt optimization - iterative refinement, evaluation metrics, A/B testing prompts",
          ],
        },
        {
          phase: "Module 2",
          title: "Building with LangChain",
          duration: "5 Weeks",
          topics: [
            "LangChain fundamentals - chains, agents, memory, callbacks",
            "RAG systems - retrieval augmented generation, vector databases, document loaders",
            "Tool usage - building custom tools, API integration, web browsing agents",
            "Memory systems - conversation memory, entity memory, summary memory",
          ],
        },
        {
          phase: "Module 3",
          title: "Agentic AI Architecture",
          duration: "5 Weeks",
          topics: [
            "Agent design patterns - ReAct, Plan-and-Execute, Tree of Thought",
            "Multi-agent systems - orchestration, delegation, agent communication",
            "Autonomous workflows - task decomposition, self-correction, goal-driven agents",
            "Safety and guardrails - output validation, content filtering, rate limiting",
          ],
        },
        {
          phase: "Module 4",
          title: "Advanced Applications",
          duration: "5 Weeks",
          topics: [
            "Code generation agents - automated coding, testing, and debugging workflows",
            "Data analysis agents - autonomous data exploration, visualization, and reporting",
            "Customer support agents - multi-turn conversations, escalation, knowledge base integration",
            "Research agents - web search, document synthesis, fact-checking workflows",
          ],
        },
        {
          phase: "Module 5",
          title: "Production Deployment",
          duration: "5 Weeks",
          topics: [
            "Deployment strategies - Docker, cloud hosting, serverless architectures",
            "Monitoring and observability - LangSmith, logging, performance tracking",
            "Cost optimization - token management, caching, model routing",
            "Capstone project - end-to-end agentic AI system for a real business problem",
            "Interview prep - portfolio presentation, technical interviews, mock sessions",
          ],
        },
      ]}
      tools={["Python", "LangChain", "OpenAI", "Docker", "AWS", "Pinecone", "ChromaDB", "FastAPI", "Streamlit", "LangSmith", "Git", "VS Code", "Jupyter"]}
      projects={[
        { title: "Intelligent Research Agent", description: "Build an autonomous research agent that searches the web, synthesizes information from multiple sources, and generates comprehensive reports." },
        { title: "AI-Powered Code Assistant", description: "Create a coding agent that understands codebases, generates code, writes tests, and debugs issues autonomously." },
        { title: "Multi-Agent Customer Support System", description: "Design a multi-agent system with specialized agents for routing, answering, and escalating customer queries." },
        { title: "RAG-Powered Knowledge Base", description: "Build a retrieval-augmented generation system that answers questions from company documents with cited sources." },
        { title: "Autonomous Data Analysis Pipeline", description: "Create an agent that takes raw datasets, performs exploratory analysis, generates visualizations, and writes insight reports." },
      ]}
      careerOutcomes={{
        roles: ["AI Engineer", "Prompt Engineer", "LLM Developer", "AI Solutions Architect", "ML Engineer", "AI Product Manager"],
        salaryRange: "₹10-20 LPA",
      }}
      faqs={[
        { question: "Do I need prior AI experience?", answer: "You should be comfortable with Python programming. Some exposure to ML concepts helps but isn't required - we cover the AI fundamentals you need." },
        { question: "What makes this different from a generic AI course?", answer: "This is entirely focused on building autonomous AI agents - not just using APIs. You'll learn architecture patterns, multi-agent orchestration, and production deployment that most courses don't cover." },
        { question: "Will I build real projects?", answer: "Absolutely. Every module includes hands-on projects, and the capstone is a full production-grade agentic AI system you can showcase to employers." },
        { question: "How current is the curriculum?", answer: "We update the curriculum monthly. You'll learn the latest tools and frameworks - LangChain, OpenAI function calling, multi-agent patterns - as the field evolves." },
        { question: "What career support is provided?", answer: "Portfolio reviews, mock technical interviews, LinkedIn optimization, and direct introductions to companies hiring AI engineers. We work with you until you land the right role." },
      ]}
    />
  );
}
