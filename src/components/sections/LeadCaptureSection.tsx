"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, UserCheck, TrendingUp, Route, GraduationCap } from "lucide-react";
import ScrollReveal from "@/components/animation/ScrollReveal";
import { useEnquiryModal } from "@/components/forms/EnquiryModal";

export default function LeadCaptureSection() {
    const { openEnquiry } = useEnquiryModal();

    return (
        <section className="py-16 md:py-20 px-6 relative overflow-hidden bg-white border-t border-gray-100">

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Lead Capture - Modern Minimalist Cards + Button */}
                <div className="max-w-5xl mx-auto">
                    <ScrollReveal>
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 text-orange-600 mb-4 border border-orange-200 bg-orange-50 px-3 py-1 rounded-full">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold tracking-wide uppercase">Free Career Consultation</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 leading-tight">
                                Confused About Where <span className="text-orange-500">to Start?</span>
                            </h2>
                            <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
                                Talk to someone who&apos;s been in your shoes. Our mentors will map out the right path for you.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Feature Cards Grid */}
                    <ScrollReveal delay={0.1}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {[
                                { icon: UserCheck, label: "1-on-1 Profile Review", desc: "Honest assessment of where you stand" },
                                { icon: TrendingUp, label: "Salary Projection", desc: "Realistic earning potential mapped out" },
                                { icon: Route, label: "Custom Learning Path", desc: "A plan that fits your schedule & goals" },
                                { icon: GraduationCap, label: "Scholarship Options", desc: "EMI & financial aid you qualify for" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-orange-200 rounded-2xl p-5 text-center transition-colors hover:shadow-lg hover:shadow-orange-500/5"
                                >
                                    <div className="w-10 h-10 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                                        <item.icon className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-navy-900 mb-1">{item.label}</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </ScrollReveal>

                    {/* CTA Button + Social Proof */}
                    <ScrollReveal delay={0.15}>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-3 text-sm text-gray-400 mb-6">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <img key={i} src={`/images/avatars/avatar-${i}.svg`} alt="Student" className="w-7 h-7 rounded-full border-2 border-white bg-gray-100" />
                                    ))}
                                </div>
                                <p className="text-xs">450+ students booked sessions this month</p>
                            </div>

                            <button
                                onClick={openEnquiry}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold px-8 py-3.5 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25 cursor-pointer"
                            >
                                Book My Free Session
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <p className="text-xs text-gray-400 mt-3">No spam. Your data is safe with us.</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
