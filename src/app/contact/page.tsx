"use client";

import { useState } from "react";
import KineticText from "@/components/animation/KineticText";
import ScrollReveal from "@/components/animation/ScrollReveal";
import { ScrollTextReveal, BorderGlow, CharacterSplit, CrossFlicker } from "@/components/animation";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const steps = [
    {
      step: "01",
      title: "Drop Us a Message",
      desc: "Fill out the form or ping us on WhatsApp - whatever's easier.",
    },
    {
      step: "02",
      title: "We'll Call You Back",
      desc: "A counselor will help you figure out which program and batch fits best.",
    },
    {
      step: "03",
      title: "You're In",
      desc: "Pick a payment plan, get onboarded, and start building your data career.",
    },
  ];

  const inputClass =
    "w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-colors";

  return (
    <main className="min-h-screen bg-navy-900 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 text-center max-w-5xl mx-auto overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/3 w-96 h-96 bg-orange-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute top-32 right-1/4 w-72 h-72 bg-blue-600/[0.06] rounded-full blur-[100px]" />
        </div>

        {/* UNIQUE: KineticText with scaleUp - zoom-in effect */}
        <KineticText
          text="Let's Talk About Your Future"
          as="h1"
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          animation="scaleUp"
        />
        {/* UNIQUE: ScrollTextReveal subtitle - scroll-scrubbed word reveal */}
        <div className="mt-6 max-w-2xl mx-auto">
          <ScrollTextReveal className="text-gray-400 text-lg md:text-xl" tag="p">
            Whether you have a question or you're ready to jump in - we're here. No pressure, just honest guidance.
          </ScrollTextReveal>
        </div>
        {/* Orange accent line */}
        <div className="mt-8 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 max-w-2xl mx-auto">
        <ScrollReveal>
          {submitted ? (
            <Card variant="accent" className="text-center py-12">
              <div className="text-5xl mb-4">&#10003;</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Inquiry Sent!
              </h3>
              <p className="text-gray-400">
                Thank you, {form.name}. Our team will get back to you within 24
                hours.
              </p>
            </Card>
          ) : (
            <BorderGlow glowColor="orange" glowIntensity="subtle">
              <Card>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 93156 47113"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Course Interested In
                    </label>
                    <select
                      name="course"
                      value={form.course}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="" className="bg-navy-900">
                        Select a course
                      </option>
                      <option value="data-analytics" className="bg-navy-900">
                        Data Analytics
                      </option>
                      <option value="data-science-ai" className="bg-navy-900">
                        Data Science &amp; AI
                      </option>
                      <option
                        value="business-intelligence"
                        className="bg-navy-900"
                      >
                        Business Intelligence
                      </option>
                      <option value="not-sure" className="bg-navy-900">
                        Not Sure Yet
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your goals..."
                      className={inputClass + " resize-none"}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    Send Inquiry
                  </Button>
                </form>
              </Card>
            </BorderGlow>
          )}
        </ScrollReveal>
      </section>

      {/* How to Enroll */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <ScrollReveal>
          <SectionHeading
            label="How It Works"
            title="Three Steps. That's It."
          />
        </ScrollReveal>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <Card className="h-full text-center">
                <div className="text-4xl font-bold text-orange-500/30 mb-4">
                  <CharacterSplit
                    delay={0.3 + i * 0.2}
                    staggerDelay={0.05}
                    highlightColor="orange"
                  >
                    {s.step}
                  </CharacterSplit>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {s.title}
                </h3>
                <p className="text-gray-400">{s.desc}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Direct Contact */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <ScrollReveal>
          <SectionHeading label="Reach Out" title="Direct Contact" />
        </ScrollReveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <ScrollReveal delay={0.1}>
            <div className="relative">
              <CrossFlicker
                position="top-right"
                color="orange"
                size="sm"
                delay={0.2}
              />
              <Card className="h-full">
                <div className="text-orange-400 text-2xl mb-3">&#9993;</div>
                <h4 className="text-white font-semibold mb-1">Email</h4>
                <a
                  href="mailto:hello@linkwaylearning.com"
                  className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                >
                  hello@linkwaylearning.com
                </a>
              </Card>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="relative">
              <CrossFlicker
                position="top-right"
                color="orange"
                size="sm"
                delay={0.4}
              />
              <Card className="h-full">
                <div className="text-orange-400 text-2xl mb-3">&#9742;</div>
                <h4 className="text-white font-semibold mb-1">Phone</h4>
                <p className="text-gray-400 text-sm">+91-93156-47113</p>
              </Card>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="relative">
              <CrossFlicker
                position="top-right"
                color="orange"
                size="sm"
                delay={0.6}
              />
              <Card className="h-full">
                <div className="text-orange-400 text-2xl mb-3">&#128172;</div>
                <h4 className="text-white font-semibold mb-1">WhatsApp</h4>
                <a
                  href="https://wa.me/919315647113"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Message us on WhatsApp
                </a>
              </Card>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div className="relative">
              <CrossFlicker
                position="top-right"
                color="orange"
                size="sm"
                delay={0.8}
              />
              <Card className="h-full">
                <div className="text-orange-400 text-2xl mb-3">&#127970;</div>
                <h4 className="text-white font-semibold mb-1">Office</h4>
                <p className="text-gray-400 text-sm">
                  D-23, Sector-59, Noida, 201301, UP
                </p>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
