"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "@/components/ui/SectionHeading";
import { ThemeProvider } from "@/lib/theme";
import Image from "next/image";
import { Briefcase, Clock } from "lucide-react";
import { INSTRUCTORS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const accentColors = [
    { gradient: "from-orange-500 to-amber-400", bg: "bg-orange-50", text: "text-orange-600", badge: "bg-orange-500/10 text-orange-700" },
    { gradient: "from-navy-700 to-navy-500", bg: "bg-navy-50", text: "text-navy-700", badge: "bg-navy-500/10 text-navy-800" },
    { gradient: "from-emerald-500 to-teal-400", bg: "bg-emerald-50", text: "text-emerald-600", badge: "bg-emerald-500/10 text-emerald-700" },
    { gradient: "from-violet-500 to-purple-400", bg: "bg-violet-50", text: "text-violet-600", badge: "bg-violet-500/10 text-violet-700" },
];

function getCompany(title: string) {
    const parts = title.split(",");
    return parts.length > 1 ? parts[parts.length - 1].trim() : "";
}

function getRole(title: string) {
    return title.split(",")[0].trim();
}

function InstructorCard({ instructor, index }: { instructor: typeof INSTRUCTORS[number]; index: number }) {
    const color = accentColors[index % accentColors.length];
    const company = getCompany(instructor.title);
    const role = getRole(instructor.title);

    return (
        <div className="group relative w-[340px] md:w-[380px] shrink-0 rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            {/* Top accent */}
            <div className={`h-1 bg-gradient-to-r ${color.gradient}`} />

            {/* Instructor image */}
            <div className={`relative w-full h-56 ${color.bg} overflow-hidden`}>
                <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    className="object-cover object-top"
                />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-lg font-bold text-navy-900 leading-tight mb-1">
                    {instructor.name}
                </h3>
                <p className="text-sm text-gray-600">{role}</p>

                <div className="flex items-center gap-4 mt-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Briefcase className="w-3.5 h-3.5" />
                        {company}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {instructor.experience}
                    </span>
                </div>

                {/* Specialization tags */}
                <div className="flex flex-wrap gap-2">
                    {instructor.specializations.map((spec, j) => (
                        <span
                            key={j}
                            className={`px-3 py-1 text-xs font-medium rounded-full ${color.badge}`}
                        >
                            {spec}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function InfiniteRow({ direction = "left", speed = 50 }: { direction?: "left" | "right"; speed?: number }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    useGSAP(() => {
        const track = trackRef.current;
        if (!track) return;

        requestAnimationFrame(() => {
            const oneSetWidth = track.scrollWidth / 2;

            tweenRef.current = gsap.fromTo(
                track,
                { x: direction === "left" ? 0 : -oneSetWidth },
                {
                    x: direction === "left" ? -oneSetWidth : 0,
                    duration: speed,
                    ease: "none",
                    repeat: -1,
                }
            );
        });

        return () => {
            tweenRef.current?.kill();
        };
    }, { scope: trackRef });

    return (
        <div className="overflow-hidden">
            <div
                ref={trackRef}
                className="flex gap-6 w-max"
                style={{ willChange: "transform" }}
            >
                {[...INSTRUCTORS, ...INSTRUCTORS].map((instructor, i) => (
                    <InstructorCard
                        key={`${instructor.name}-${i}`}
                        instructor={instructor}
                        index={i % INSTRUCTORS.length}
                    />
                ))}
            </div>
        </div>
    );
}

export default function MentorsSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;

        const heading = section.querySelector(".mentor-heading");
        if (heading) {
            gsap.set(heading, { opacity: 0, y: 30 });
            gsap.to(heading, {
                opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
                scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
            });
        }

        const row = section.querySelector(".marquee-row");
        if (row) {
            gsap.set(row, { opacity: 0, y: 40 });
            gsap.to(row, {
                opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out",
                scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none none" },
            });
        }
    }, { scope: sectionRef });

    return (
        <ThemeProvider theme="light">
            <section ref={sectionRef} className="py-24 md:py-32 overflow-hidden relative" style={{ backgroundColor: "#f2f1ee" }}>
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                }} />

                {/* Header */}
                <div className="mentor-heading max-w-3xl mx-auto text-center mb-14 px-6 relative">
                    <SectionHeading
                        label="Learn From The Best"
                        title="Meet Your Mentors"
                        description="Industry veterans from top companies who don't just teach theory — they share real-world playbooks from the trenches."
                        align="center"
                    />
                </div>

                {/* Infinite scroll row */}
                <div className="w-full relative marquee-row">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #f2f1ee, transparent)" }} />
                    <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #f2f1ee, transparent)" }} />

                    <InfiniteRow direction="left" speed={45} />
                </div>
            </section>
        </ThemeProvider>
    );
}
