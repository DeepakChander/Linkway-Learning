"use client";

import { CharacterSplit } from "@/components/animation";
import { AccordionItem } from "@/components/ui/Accordion";

export default function RefundContent() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <section className="relative pt-32 pb-8 px-6 text-center max-w-4xl mx-auto overflow-hidden">
        {/* Subtle gradient mesh */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/3 w-80 h-80 bg-orange-500/[0.05] rounded-full blur-[120px]" />
          <div className="absolute top-28 right-1/3 w-64 h-64 bg-blue-500/[0.04] rounded-full blur-[100px]" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">
          <CharacterSplit delay={0.1} staggerDelay={0.03} highlightColor="orange">
            Refund Policy
          </CharacterSplit>
        </h1>
        {/* Orange accent line */}
        <div className="mt-6 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
        <p className="mt-4 text-gray-500 text-sm">Last updated: January 2026</p>
      </section>

      <section className="py-12 px-6 max-w-3xl mx-auto">
        <p className="text-gray-400 leading-relaxed mb-10">
          At Linkway Learning, we aim to maintain transparency and fairness
          across all learner policies. Please review this Refund Policy carefully
          before enrolling, as it defines the conditions under which refunds may
          be considered.
        </p>

        <div>
          {/* Section 1 */}
          <AccordionItem title="1. Registration / Booking Fee" defaultOpen>
            <div className="space-y-4">
              <p>
                Any registration, booking, or enrollment fee paid to reserve a
                seat is <span className="text-white font-semibold">strictly non-refundable</span>.
              </p>
              <p>
                This fee covers administrative activities such as onboarding,
                learner verification, LMS setup, and resource allocation.
              </p>
            </div>
          </AccordionItem>

          {/* Section 2 */}
          <AccordionItem title="2. Program Fee & Refund Eligibility Window">
            <div className="space-y-4">
              <p>
                Refunds on the program fee (excluding the registration/booking
                fee) may be considered only if a valid request is raised within
                the defined refund window.
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  The refund eligibility period begins from the date of the{" "}
                  <span className="text-white font-medium">
                    first concept session
                  </span>{" "}
                  of the assigned batch.
                </li>
                <li>
                  Learners must continue attending the program during this
                  period to remain eligible.
                </li>
              </ul>
            </div>
          </AccordionItem>

          {/* Section 3 */}
          <AccordionItem title="3. Mandatory Participation Requirements">
            <div className="space-y-4">
              <p>
                To qualify for a refund, learners must fulfill{" "}
                <span className="text-white font-semibold">all</span> of the
                following conditions:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  Attend all live sessions during the initial learning period.
                  Recorded sessions are not counted toward attendance.
                </li>
                <li>
                  Log in using their registered full name for accurate
                  attendance tracking.
                </li>
                <li>
                  Complete and submit all assignments, assessments, onboarding
                  sessions, and feedback sessions assigned within the first 10
                  days, even if submission deadlines fall later.
                </li>
                <li>Participate actively and in good faith.</li>
              </ul>
              <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                <p className="text-orange-400 font-semibold text-sm">
                  Failure to meet any of these conditions will result in refund
                  ineligibility.
                </p>
              </div>
            </div>
          </AccordionItem>

          {/* Section 4 */}
          <AccordionItem title="4. Refund Request Process">
            <div className="space-y-4">
              <p>
                Refund requests must be submitted in writing to{" "}
                <a
                  href="mailto:support@linkwaylearning.com"
                  className="text-orange-400 hover:underline"
                >
                  support@linkwaylearning.com
                </a>{" "}
                between the{" "}
                <span className="text-white font-semibold">
                  10th and 15th day
                </span>{" "}
                from the official course start date.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-white/10 rounded-lg">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left p-3 text-white font-semibold">
                        Timeline
                      </th>
                      <th className="text-left p-3 text-white font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr>
                      <td className="p-3">Before Day 10</td>
                      <td className="p-3 text-red-400">Not accepted</td>
                    </tr>
                    <tr>
                      <td className="p-3">Day 10 &ndash; Day 15</td>
                      <td className="p-3 text-green-400">
                        Eligible window for submission
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3">After Day 15</td>
                      <td className="p-3 text-red-400">Not accepted</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Refunds may take up to{" "}
                <span className="text-white font-medium">60 days</span> to
                process, though approved requests are typically completed within{" "}
                <span className="text-white font-medium">14 working days</span>.
              </p>
            </div>
          </AccordionItem>

          {/* Section 5 */}
          <AccordionItem title="5. Refund Amount & Applicability">
            <div className="space-y-4">
              <p>
                If a refund request is approved, the refundable amount shall be
                limited to the{" "}
                <span className="text-white font-semibold">
                  program fee actually paid
                </span>{" "}
                by the learner, excluding applicable GST and any registration or
                booking charges.
              </p>
              <p>
                Refunds are applicable only to enrollments made at the standard
                program fee.
              </p>
              <div className="rounded-lg border border-white/10 p-4 space-y-2">
                <h4 className="text-white font-semibold">
                  Not Eligible for Refund
                </h4>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>
                    Programs availed under discounted or subsidised pricing
                  </li>
                  <li>
                    Enrollments completed through installment-based or EMI
                    payment modes
                  </li>
                </ul>
              </div>
              <p>
                Refund processing is subject to the clearance of any dues with
                associated financial or payment partners.
              </p>
            </div>
          </AccordionItem>

          {/* Section 6 */}
          <AccordionItem title="6. Refund Deductions">
            <div className="space-y-4">
              <p>
                If approved, the refund amount will be calculated after
                deducting the following:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-white/10 rounded-lg">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left p-3 text-white font-semibold">
                        Deduction Item
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr>
                      <td className="p-3">Registration / booking fee</td>
                    </tr>
                    <tr>
                      <td className="p-3">GST (as per applicable law)</td>
                    </tr>
                    <tr>
                      <td className="p-3">
                        Payment gateway or processing charges
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3">
                        EMI, subvention, or finance partner charges (if
                        applicable)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3">
                        LMS access and academic resource usage costs
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Refunds are processed only on the{" "}
                <span className="text-white font-semibold">
                  net eligible balance
                </span>
                , if any.
              </p>
            </div>
          </AccordionItem>

          {/* Section 7 */}
          <AccordionItem title="7. Learning Materials & Access">
            <div className="space-y-4">
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  Any physical learning materials must be returned in good
                  condition via registered post before a refund is processed.
                </li>
                <li>
                  Access to LMS and digital learning resources may be revoked
                  after refund approval.
                </li>
                <li>
                  Linkway Learning reserves the right to restrict future
                  enrollments for learners who have received a refund.
                </li>
              </ul>
            </div>
          </AccordionItem>

          {/* Section 8 */}
          <AccordionItem title="8. Technical Issues">
            <div className="space-y-4">
              <p>
                If technical issues prevent compliance with any refund
                condition, an exception may be reviewed only if the issue was
                reported to{" "}
                <a
                  href="mailto:support@linkwaylearning.com"
                  className="text-orange-400 hover:underline"
                >
                  support@linkwaylearning.com
                </a>{" "}
                with valid screenshots and timestamps during the affected
                period.
              </p>
            </div>
          </AccordionItem>

          {/* Section 9 */}
          <AccordionItem title="9. Still Have Questions?">
            <div className="space-y-4">
              <p>
                If you actively complete 10 days of the program and still feel
                it does not meet your expectations, a refund may be considered
                as per this policy.
              </p>
              <p>
                For further assistance, contact{" "}
                <a
                  href="mailto:support@linkwaylearning.com"
                  className="text-orange-400 hover:underline"
                >
                  support@linkwaylearning.com
                </a>
                .
              </p>
            </div>
          </AccordionItem>

          {/* Contact Section */}
          <div className="mt-12 rounded-lg border border-white/10 bg-white/5 p-6 text-center space-y-3">
            <h3 className="text-white text-lg font-semibold">
              Need Help?
            </h3>
            <p className="text-white font-medium">
              Linkway Learning Pvt. Ltd.
            </p>
            <div className="space-y-1">
              <p>
                <span className="text-white font-medium">E-mail:</span>{" "}
                <a
                  href="mailto:support@linkwaylearning.com"
                  className="text-orange-400 hover:underline"
                >
                  support@linkwaylearning.com
                </a>
              </p>
              <p>
                <span className="text-white font-medium">Website:</span>{" "}
                <a
                  href="https://linkwaylearning.com"
                  className="text-orange-400 hover:underline"
                >
                  https://linkwaylearning.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
