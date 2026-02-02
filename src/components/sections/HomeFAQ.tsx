"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import { AccordionItem } from "@/components/ui/Accordion";
import { ThemeProvider } from "@/lib/theme";

const faqs = [
  {
    q: "What exactly is Linkway Learning?",
    a: "Linkway Learning is an industry-driven learning organization that equips learners with in-demand data skills and supports them in securing relevant job opportunities.",
  },
  {
    q: "Why should I choose Linkway Learning?",
    a: "Linkway Learning offers small class sizes, practical hands-on attack simulations, Microsoft-recognized certification, and a strong focus on job placements.",
  },
  {
    q: "Are flexible payment or financial options available?",
    a: "Yes, no-cost EMI and financing options are available to make the program affordable for everyone.",
  },
  {
    q: "What kind of career assistance is provided?",
    a: "You'll receive help with resume preparation, practice interviews, alumni referrals, and access to 400+ hiring partners to support job placements.",
  },
  {
    q: "Will I receive a certificate after completing the program?",
    a: "You'll receive a Linkway Learning certificate and a Microsoft-recognized certificate after completion.",
  },
  {
    q: "What is the mode of instruction for the classes?",
    a: "All classes are 100% live and highly interactive, led by experienced instructors. Batch sizes are intentionally kept small to ensure personalized attention and meaningful interaction. Each session is also recorded for future reference.",
  },
  {
    q: "Do I need prior technical or coding knowledge to enroll?",
    a: "No prior technical background is required. The program is designed to support beginners as well as professionals from non-technical backgrounds.",
  },
  {
    q: "Is there any support provided beyond the classroom sessions?",
    a: "Yes, learners receive continuous academic support, including doubt-solving sessions and mentorship throughout the course.",
  },
];

export default function HomeFAQ() {
  return (
    <ThemeProvider theme="light">
      <section className="py-12 md:py-16 bg-[#f2f1ee]">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading
            label="Got Questions?"
            title="Frequently Asked Questions"
            description="Straight answers. No corporate fluff."
            align="center"
          />

          <div className="mt-12">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} title={faq.q}>
                {faq.a}
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>
    </ThemeProvider>
  );
}
