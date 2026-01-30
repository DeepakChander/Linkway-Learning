"use client";

import Image from "next/image";

import Badge from "@/components/ui/Badge";
import { CharacterSplit } from "@/components/animation";
import { ScrollReveal } from "@/components/animation";
import { CrossFlicker } from "@/components/animation";
import { Marquee } from "@/components/animation";
import { ThemeProvider } from "@/lib/theme";

const posts = [
  {
    title: "Data Analyst vs Data Scientist - What's the Actual Difference?",
    category: "Career Tips",
    excerpt:
      "Everyone confuses these two roles. Here's a no-nonsense breakdown of what each one does, what they earn, and which one might suit you better.",
    readTime: "8 min read",
    date: "Jan 2026",
    image: "/images/sections/career-transition.png",
  },
  {
    title: "10 Python Libraries You'll Use Every Single Day in Data",
    category: "Data Science",
    excerpt:
      "Pandas, NumPy, Scikit-learn, PyTorch - these aren't optional anymore. Here's what each one does and why you need to know them.",
    readTime: "10 min read",
    date: "Jan 2026",
    image: "/images/blog/data-science-trends.png",
  },
  {
    title: "Your Portfolio Is Your Resume Now - Here's How to Build One",
    category: "Career Tips",
    excerpt:
      "Recruiters don't care about your coursework. They want to see what you've built. Here's how to put together a portfolio that actually lands interviews.",
    readTime: "7 min read",
    date: "Jan 2026",
    image: "/images/blog/learning-tips.png",
  },
  {
    title: "So You Want to Be an AI Engineer - Here's the Honest Roadmap",
    category: "AI",
    excerpt:
      "Linear algebra, transformers, deployment pipelines - it's a lot. We mapped out the full journey so you know exactly what to learn and in what order.",
    readTime: "12 min read",
    date: "Jan 2026",
    image: "/images/sections/abstract-data-flow.png",
  },
  {
    title: "Why Every Company Is Suddenly Hiring BI Analysts",
    category: "Business Intelligence",
    excerpt:
      "Business Intelligence isn't a buzzword anymore - it's a hiring priority. Here's why companies are investing in BI and what that means for your career.",
    readTime: "6 min read",
    date: "Jan 2026",
    image: "/images/courses/business-intelligence.png",
  },
];

const categoryColor: Record<string, "orange" | "default" | "glass" | "navy"> = {
  "Career Tips": "orange",
  "Data Science": "navy",
  AI: "glass",
  "Business Intelligence": "default",
};

const categories = [
  "Data Science", "AI", "Career Tips", "Business Intelligence",
  "Python", "Machine Learning", "SQL", "Analytics", "Portfolio", "Interview Prep",
];

export default function BlogPage() {
  return (
    <ThemeProvider theme="light">
      <div className="min-h-screen bg-white text-navy-900">
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-6 text-center max-w-5xl mx-auto overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/[0.05] rounded-full blur-[120px]" />
            <div className="absolute top-40 right-1/4 w-80 h-80 bg-blue-500/[0.04] rounded-full blur-[100px]" />
          </div>

          <CrossFlicker position="top-left" color="orange" size="sm" delay={0.3} />
          <CrossFlicker position="top-right" color="orange" size="sm" delay={0.5} />

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-navy-900">
            <CharacterSplit delay={0.1} staggerDelay={0.025} effect="blur" highlightColor="orange">
              Insights &amp; Resources
            </CharacterSplit>
          </h1>
          <p className="mt-6 text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Practical reads on data careers, tools, and the stuff nobody teaches you in college.
          </p>
          <div className="mt-8 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
        </section>

        {/* Category Marquee */}
        <section className="py-6 border-y border-gray-200">
          <Marquee speed={30} pauseOnHover gap={6}>
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-orange-50 text-orange-600 border border-orange-200 whitespace-nowrap"
              >
                {cat}
              </span>
            ))}
          </Marquee>
        </section>

        {/* Blog Grid */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                  <article className="group rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:border-orange-300 hover:shadow-[0_8px_30px_rgba(249,115,22,0.1)] transition-all duration-300 h-full flex flex-col">
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge variant={categoryColor[post.category] || "default"}>
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="text-lg font-bold text-navy-900 group-hover:text-orange-500 transition-colors mb-3 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <span>{post.date}</span>
                          <span>&middot;</span>
                          <span>{post.readTime}</span>
                        </div>
                        <span className="text-gray-400 text-xs font-medium">
                          Coming soon
                        </span>
                      </div>
                    </div>
                  </article>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
}
