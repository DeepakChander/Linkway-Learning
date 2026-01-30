"use client";

import { LineMaskReveal } from "@/components/animation";
import { AccordionItem } from "@/components/ui/Accordion";

/* ────────────────────────────────────────────────────────────────
   Plain-language note component
   ──────────────────────────────────────────────────────────────── */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-orange-500/20 bg-orange-500/[0.05] px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1">
        What this means
      </p>
      <p className="text-sm text-gray-400 leading-relaxed">{children}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Section data
   ──────────────────────────────────────────────────────────────── */
const sections: {
  title: string;
  content: React.ReactNode;
}[] = [
  /* 1 ─ About the Service ──────────────────────────────────────── */
  {
    title: "1. About the Linkway Learning Service",
    content: (
      <>
        <p className="mb-3">
          Linkway Learning Private Limited (&quot;Linkway Learning,&quot;
          &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) offers advanced
          professional training programs and skill-building courses
          (&quot;Programs&quot;) in Data Analytics, Data Science &amp; AI,
          Business Intelligence, and related disciplines. When you successfully
          complete a Program (as determined by Linkway Learning), you will
          receive a certificate of completion (&quot;Certificate&quot;). If you
          do not complete a Program, you may receive a certificate of
          attendance.
        </p>
        <p className="mb-3">Please note the following important points:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>
            <strong>Linkway Learning Programs Are Not Accredited:</strong>{" "}
            Linkway Learning is not a UGC-recognised university or AICTE
            approved institution. We do not grant formal degrees. The
            Certificate you receive is not a formal degree.
          </li>
          <li>
            <strong>No Academic Credit:</strong> Completing a Program does not
            earn you academic credit that is recognised by universities,
            colleges, or other educational institutions.
          </li>
          <li>
            <strong>No Guarantee of Employment:</strong> Completing a Program
            may help you build your skills and knowledge, but we do not promise
            or guarantee that you will get a job or a promotion as a result.
            Placement statistics reflect outcomes among eligible graduates who
            completed all program requirements. Final hiring decisions rest with
            employers.
          </li>
          <li>
            <strong>Do Your Own Work:</strong> All work you submit (such as
            assignments, quizzes, assessments, and projects) must be your own,
            unless we specifically allow you to work with others.
          </li>
          <li>
            <strong>Do Not Share Your Work:</strong> You may not share your work
            with others or do work for someone else, unless we give you
            permission to collaborate or share.
          </li>
          <li>
            <strong>No Cheating:</strong> You must not cheat or act dishonestly
            to improve your results or affect the results of other students.
          </li>
          <li>
            <strong>Program Changes:</strong> You cannot change your Program
            after enrolling unless Linkway Learning gives you permission. If the
            change is allowed, additional fees may apply.
          </li>
        </ul>
        <Note>
          When you finish a Linkway Learning program, you&apos;ll get a
          certificate showing you completed it. This certificate is NOT the same
          as a university degree, and it won&apos;t count as academic credit. We
          do not guarantee employment, but we offer dedicated placement
          assistance. You must do all your own work without cheating, and you
          can&apos;t switch to a different program after you enrol unless Linkway
          Learning says it&apos;s okay.
        </Note>
      </>
    ),
  },

  /* 2 ─ Your Responsibilities ──────────────────────────────────── */
  {
    title: "2. Your Responsibilities",
    content: (
      <>
        <p className="mb-3">
          To participate in a Linkway Learning Program, you must first register
          for an account. During registration, you will need to provide personal
          information such as your name, email address, phone number, and
          educational background. Linkway Learning will use this information
          according to our Privacy Policy, available at:{" "}
          <a
            href="/privacy"
            className="text-orange-400 underline hover:text-orange-300"
          >
            linkwaylearning.com/privacy
          </a>
          . It is your responsibility to ensure that all information you provide
          is true, accurate, and complete. If your information changes, you must
          update it promptly.
        </p>
        <p className="mb-3">
          As part of creating your account, you may be asked to choose a
          username and password. Linkway Learning can refuse or revoke your
          chosen username for any reason, including if it is offensive,
          impersonates someone else, is illegal, or could cause confusion. You
          are responsible for keeping your credentials confidential and must not
          share, transfer, or resell your account to anyone else.
        </p>
        <p className="mb-3 font-semibold text-gray-200">
          YOU ARE ENTIRELY RESPONSIBLE FOR MAINTAINING THE CONFIDENTIALITY OF
          YOUR LOGIN CREDENTIALS AND FOR ANY AND ALL ACTIVITIES THAT ARE
          CONDUCTED THROUGH YOUR ACCOUNT.
        </p>
        <p className="mb-3">
          To maintain a safe and respectful community, you agree not to use the
          Linkway Learning Service to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>
            Violate any local, state, national, or international law or
            regulation, including the Information Technology Act, 2000, and the
            Digital Personal Data Protection Act, 2023.
          </li>
          <li>
            Send or post any material that is abusive, harassing, defamatory,
            vulgar, obscene, hateful, or otherwise objectionable.
          </li>
          <li>Stalk, harass, bully, or harm another person.</li>
          <li>
            Send unsolicited or unauthorised advertising, spam, or other forms
            of solicitation.
          </li>
          <li>
            Knowingly transmit any viruses, malware, spyware, or other harmful
            software.
          </li>
          <li>
            Attempt to defeat or interfere with any security features of the
            Service.
          </li>
          <li>
            Impersonate any person or entity, or misrepresent your affiliation
            with someone else.
          </li>
          <li>
            Disrupt or interfere with the Service, its servers or networks, or
            ignore any rules or policies related to the Service.
          </li>
          <li>
            Use any automated systems (such as robots, spiders, or offline
            readers) to access the Service.
          </li>
        </ul>
        <Note>
          To study with Linkway Learning, you need to create an account with
          your real information and keep it up to date. You must keep your login
          credentials secure because you&apos;re responsible for everything that
          happens in your account. Follow Linkway Learning&apos;s rules — be
          respectful, don&apos;t do anything illegal or harmful, don&apos;t
          share your account, don&apos;t spam or bully people, and don&apos;t
          disrupt the experience for fellow students.
        </Note>
      </>
    ),
  },

  /* 3 ─ Fees, Payment, Refunds ─────────────────────────────────── */
  {
    title: "3. Fees, Payment, Refunds & Cancellation",
    content: (
      <>
        <h3 className="text-lg font-semibold text-gray-200 mb-2">
          Payment Responsibility
        </h3>
        <p className="mb-3">
          You are required to pay the current tuition fees for any Program you
          enrol in, as published on the Linkway Learning website or communicated
          to you at the time of enrolment (&quot;Tuition Fees&quot;).
        </p>

        <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
          How to Pay
        </h3>
        <p className="mb-3">
          You must pay your Tuition Fees using one of the payment methods we
          provide. All payments must be made in Indian Rupees (INR), unless we
          agree otherwise. We accept payments through UPI, net banking, debit
          cards, credit cards, and approved EMI partners.
        </p>

        <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
          EMI &amp; Instalment Options
        </h3>
        <p className="mb-3">
          To make our courses accessible, Linkway Learning offers EMI and
          instalment payment options through third-party financing partners. You
          can choose to pay your full Tuition Fees up front or opt for recurring
          payments. If you choose recurring payments, you authorise Linkway
          Learning or its financing partner to automatically charge the
          applicable instalment to your payment method as per the agreed
          schedule.
        </p>
        <p className="mb-3">
          If you select a payment option through a third-party lender or EMI
          provider, additional processing fees and interest may apply. This
          means you may end up paying more overall for the program. If you take
          a loan to pay for your course, you are responsible for repaying the
          full loan amount plus interest, minus any refunds you may receive.
        </p>

        <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
          Ongoing Payment Obligation
        </h3>
        <p className="mb-3">
          You are required to pay your full Tuition Fees regardless of which
          payment method or schedule you use, and even if you pause your
          studies, do not use the Service, or do not finish the Program. Failure
          to pay will result in the loss of access to all Linkway Learning
          Services, including program content, mentor support, and placement
          assistance.
        </p>

        <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
          Taxes
        </h3>
        <p className="mb-3">
          Tuition Fees are inclusive of applicable Goods and Services Tax (GST)
          unless stated otherwise. You are responsible for any additional taxes,
          duties, or government charges that may apply.
        </p>

        <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
          Cancellation &amp; Full Refund
        </h3>
        <p className="mb-3">
          You are entitled to cancel your enrolment and receive a full (100%)
          refund of the Tuition Fees paid by you, provided you cancel within 14
          calendar days of the date of course commencement or the date of your
          first payment, whichever is later.
        </p>
        <p className="mb-3">
          To cancel your enrolment or withdraw from the Program, you must send a
          written request to{" "}
          <a
            href="mailto:support@linkwaylearning.com"
            className="text-orange-400 underline hover:text-orange-300"
          >
            support@linkwaylearning.com
          </a>{" "}
          or submit a withdrawal request through our platform.
        </p>

        <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
          Pro-Rata Refund Policy
        </h3>
        <p className="mb-3">
          If you withdraw after the 14-day cancellation period and before
          completing 60% of your enrolment period, you are eligible for a
          pro-rata refund calculated as follows:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-300 mb-3">
          <li>
            Determine the total Tuition Fees for your enrolment period.
          </li>
          <li>
            Divide by the number of calendar days in your enrolment period to
            get the daily charge.
          </li>
          <li>
            Multiply the daily charge by the number of days between the Program
            Start Date and the Withdrawal Date.
          </li>
          <li>
            Subtract the amount owed for instruction received (step 3) from the
            total Tuition Fees you have paid.
          </li>
        </ol>
        <p className="mb-3">
          If you complete more than 60% of your enrolment period, you are not
          eligible for any refund. Linkway Learning does not refund any
          additional fees or interest charged by third-party financing
          providers. Refunds will be issued within 15 business days of your
          cancellation or withdrawal date.
        </p>

        <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
          Enrolment Periods per Program
        </h3>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-sm text-left border border-white/10">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="px-4 py-2 font-medium text-gray-300">
                  Program
                </th>
                <th className="px-4 py-2 font-medium text-gray-300">
                  Duration (Calendar Days)
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              <tr className="border-b border-white/5">
                <td className="px-4 py-2">Data Analytics Accelerator</td>
                <td className="px-4 py-2">180</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-2">Data Science &amp; AI Mastery</td>
                <td className="px-4 py-2">365</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-2">
                  Business Intelligence &amp; Strategy
                </td>
                <td className="px-4 py-2">365</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Note>
          You must pay the full cost of your program. You can pay all at once or
          use EMI/instalment options. If you cancel within 14 days of starting,
          you get a full refund. After 14 days but before 60% of the program,
          you get a pro-rata refund. After 60%, no refund. If you use a loan or
          EMI from a financing partner, extra fees and interest may apply.
          Refunds are processed within 15 business days.
        </Note>
      </>
    ),
  },

  /* 4 ─ Placement Assistance ───────────────────────────────────── */
  {
    title: "4. Placement Assistance",
    content: (
      <>
        <p className="mb-3">
          Linkway Learning offers dedicated placement assistance to eligible
          graduates who successfully complete their Program and meet all program
          requirements. This assistance includes resume reviews, mock
          interviews, interview preparation, and introductions to our hiring
          partners.
        </p>
        <p className="mb-3">
          Placement assistance is provided on a best-effort basis. While we
          strive to help every graduate find suitable employment, we do not
          guarantee job placement, a specific salary, or employment within a
          particular timeframe. Placement statistics shared on our website
          reflect outcomes among eligible graduates who actively participated in
          the placement process.
        </p>
        <p className="mb-3">
          To remain eligible for placement assistance, you must:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-3">
          <li>Complete 100% of the Program curriculum and projects.</li>
          <li>
            Maintain a minimum passing score as determined by Linkway Learning.
          </li>
          <li>
            Actively participate in the placement process, including attending
            scheduled interviews and responding to communications within
            specified timelines.
          </li>
          <li>
            Submit all required documents (resume, portfolio, certifications) as
            requested.
          </li>
        </ul>
        <Note>
          Linkway Learning helps you find a job through resume support, mock
          interviews, and hiring partner introductions — but we cannot guarantee
          you will get hired. You must complete the full program and actively
          participate in placement activities to be eligible.
        </Note>
      </>
    ),
  },

  /* 5 ─ Ownership of Content ───────────────────────────────────── */
  {
    title: "5. Ownership of Linkway Learning Content",
    content: (
      <>
        <p className="mb-3">
          All content on the Linkway Learning Service — including videos,
          recordings, text, graphics, software, curriculum materials, quizzes,
          projects, and interactive features (collectively, the
          &quot;Content&quot;) — and all trademarks, logos, and brand elements
          (the &quot;Marks&quot;) are owned by Linkway Learning Private Limited
          or its licensors and are protected under the Copyright Act, 1957, the
          Trade Marks Act, 1999, and other applicable intellectual property laws
          of India and international treaties.
        </p>
        <p className="mb-3">What You Can and Cannot Do:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>
            You are only allowed to use the Service and its content for your own
            personal educational use.
          </li>
          <li>
            You may not copy, download, record, upload, publish, broadcast,
            sell, modify, translate, reverse engineer, or otherwise use any part
            of the Service or its content for any commercial or unauthorised
            purpose.
          </li>
          <li>
            You must follow all copyright and trademark notices and respect any
            restrictions that come with the content.
          </li>
          <li>
            You are not allowed to remove, change, or bypass any copyright,
            trademark, or other legal notices or digital rights management
            tools.
          </li>
        </ul>
        <Note>
          All videos, lessons, images, and logos belong to Linkway Learning and
          are protected by law. You can only use materials for your own learning
          — you cannot copy, share, sell, or change them unless Linkway Learning
          gives you written permission.
        </Note>
      </>
    ),
  },

  /* 6 ─ User Content ───────────────────────────────────────────── */
  {
    title: "6. User Content",
    content: (
      <>
        <p className="mb-3">
          Linkway Learning allows you to post and share content such as work
          samples, project submissions, messages, and comments (collectively,
          &quot;User Content&quot;). Content you post may be visible to other
          users of the Service.
        </p>
        <p className="mb-3">
          When you submit User Content, you grant Linkway Learning a
          non-exclusive, royalty-free, transferable, worldwide licence to
          display, distribute, store, reproduce, edit, and create derivative
          works from your content for the purposes of operating, promoting, and
          improving the Service.
        </p>

        <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
          Use of Your Name and Image
        </h3>
        <p className="mb-3">
          Linkway Learning may use your name, photograph, job title, and
          testimonial in its promotional materials — including the website,
          social media, and marketing channels — to advertise and promote its
          services. If you wish to withdraw this consent, contact us at{" "}
          <a
            href="mailto:support@linkwaylearning.com"
            className="text-orange-400 underline hover:text-orange-300"
          >
            support@linkwaylearning.com
          </a>
          .
        </p>

        <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
          Your Responsibilities
        </h3>
        <p className="mb-3">
          You guarantee that you own or have the rights to share your User
          Content, and that your content does not violate anyone else&apos;s
          rights, including intellectual property rights, privacy rights, or any
          applicable laws.
        </p>
        <p className="mb-3">
          Linkway Learning does not pre-review User Content but may review and
          remove content at any time if it violates these Terms or applicable
          laws.
        </p>
        <Note>
          When you share work, messages, or comments on Linkway Learning, other
          students can see them, and Linkway Learning can use your content for
          promoting the business. We might use your name and photo in
          advertising. You promise that anything you post is yours to share and
          doesn&apos;t break any rules or laws.
        </Note>
      </>
    ),
  },

  /* 7 ─ Third-Party Content ────────────────────────────────────── */
  {
    title: "7. Third-Party Projects and Content",
    content: (
      <>
        <p className="mb-3">
          Linkway Learning may provide opportunities to work on real-world
          projects from third-party companies (&quot;Third-Party Projects&quot;).
          These companies may supply materials, data, or tools (&quot;Third-Party
          Content&quot;) to help you complete projects.
        </p>
        <p className="mb-3">
          It is your choice whether to participate in Third-Party Projects.
          Linkway Learning does not pre-review Third-Party Content and is not
          responsible for any issues arising from your use of Third-Party
          Projects or Content. Any agreements you enter into with third-party
          companies are solely between you and that company.
        </p>
        <Note>
          You may get the chance to work on real projects from outside
          companies. Linkway Learning is not involved in agreements between you
          and those companies, and is not responsible if anything goes wrong
          with those projects or materials.
        </Note>
      </>
    ),
  },

  /* 8 ─ Feedback ───────────────────────────────────────────────── */
  {
    title: "8. Feedback",
    content: (
      <>
        <p className="mb-3">
          If you provide ideas, suggestions, comments, or other feedback
          (&quot;Feedback&quot;) about the Linkway Learning Service, you agree
          that Linkway Learning may use this Feedback for any purpose without
          any obligation to compensate you or keep your Feedback confidential.
        </p>
        <Note>
          If you give Linkway Learning suggestions or feedback, we can use your
          ideas in any way without paying you or keeping them private.
        </Note>
      </>
    ),
  },

  /* 9 ─ Copyright Infringement ─────────────────────────────────── */
  {
    title: "9. Copyright Infringement",
    content: (
      <>
        <p className="mb-3">
          Linkway Learning respects intellectual property rights. If you believe
          content on our Service infringes your copyright, please send a written
          notice to our designated officer with the following information:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-3">
          <li>
            A description of the copyrighted work you believe has been
            infringed.
          </li>
          <li>
            A description of the infringing material and its location on our
            Service.
          </li>
          <li>
            Your contact information (name, address, phone number, email).
          </li>
          <li>
            A statement that you have a good-faith belief that the use is not
            authorised.
          </li>
          <li>
            A statement, under penalty of perjury, that the information is
            accurate and you are the copyright owner or authorised to act on
            their behalf.
          </li>
          <li>Your physical or electronic signature.</li>
        </ul>
        <p className="mb-3">
          Send your notice to:{" "}
          <a
            href="mailto:legal@linkwaylearning.com"
            className="text-orange-400 underline hover:text-orange-300"
          >
            legal@linkwaylearning.com
          </a>
          <br />
          Linkway Learning Private Limited, D-23, Sector-59, Noida, Gautam
          Buddha Nagar &ndash; 201301, Uttar Pradesh, India.
        </p>
        <Note>
          If you think someone on Linkway Learning copied your work without
          permission, you can report it by sending an email or letter with the
          required details to our legal team.
        </Note>
      </>
    ),
  },

  /* 10 ─ Modifications to Service ──────────────────────────────── */
  {
    title: "10. Modifications to the Service",
    content: (
      <>
        <p className="mb-3">
          Linkway Learning may change or discontinue any part of the Service at
          any time, with or without prior notice. This includes the right to
          cancel, interrupt, or reschedule any Program, or to change course
          content, curriculum, tools, or requirements. If Linkway Learning
          makes such changes, we will not be liable to you for any resulting
          effects.
        </p>
        <Note>
          Linkway Learning can change or stop any part of the service at any
          time, including course content and schedules.
        </Note>
      </>
    ),
  },

  /* 11 ─ Third-Party Links ─────────────────────────────────────── */
  {
    title: "11. Links to Third-Party Materials",
    content: (
      <>
        <p className="mb-3">
          The Service may include links to websites or resources owned by third
          parties. These links are provided for your convenience only. Linkway
          Learning does not endorse, control, or take responsibility for any
          third-party materials, including their content, privacy practices, or
          functionality.
        </p>
        <Note>
          Our website might have links to other sites. Linkway Learning is not
          responsible for what&apos;s on those websites or any problems you have
          when you visit them.
        </Note>
      </>
    ),
  },

  /* 12 ─ Suspension & Termination ──────────────────────────────── */
  {
    title: "12. Suspension and Termination",
    content: (
      <>
        <p className="mb-3">
          Linkway Learning may suspend your participation in the Program and/or
          issue a warning if any of the following occur:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-3">
          <li>
            You fail to pay your Tuition Fees or your payment cannot be
            processed.
          </li>
          <li>You violate these Terms or the Code of Conduct.</li>
          <li>You miss Program deadlines for submitting tasks or projects.</li>
          <li>
            You do not sign the enrolment agreement or other required documents
            within the specified timeframe.
          </li>
          <li>
            You engage in plagiarism, cheating, or academic dishonesty.
          </li>
        </ul>
        <p className="mb-3">
          Your suspension will remain in effect until you resolve the issue. If
          you do not resolve it within three business days of receiving notice,
          or if you commit a repeat violation, Linkway Learning may permanently
          terminate your access without refunding any fees paid.
        </p>
        <p className="mb-3">
          Regardless of the reason for suspension, you will continue to be
          charged until your Program fees are fully paid. Suspension does not
          pause your enrolment period for refund calculation purposes.
        </p>

        <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
          Requesting an Extension
        </h3>
        <p className="mb-3">
          You may request an extension to complete your studies by contacting
          your assigned mentor or our support team. If you are absent for three
          consecutive months, Linkway Learning may terminate your participation
          and revoke your access. Returning after such an absence will require
          re-enrolment at the current fee.
        </p>
        <Note>
          Linkway Learning can pause your program or remove you if you
          don&apos;t pay, break the rules, miss deadlines, or cheat. If your
          program gets paused, you have 3 business days to fix the problem.
          Even if you&apos;re paused, you still have to keep paying until the
          full cost is paid.
        </Note>
      </>
    ),
  },

  /* 13 ─ Disclaimer of Warranties ──────────────────────────────── */
  {
    title: "13. Disclaimer of Warranties",
    content: (
      <>
        <p className="mb-3 font-semibold text-gray-200">
          YOU USE THE LINKWAY LEARNING SERVICE AT YOUR SOLE RISK. THE SERVICE IS
          PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. TO
          THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, LINKWAY LEARNING AND
          ITS AFFILIATES EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT.
        </p>
        <p className="mb-3">
          Our services are not customised to your individual educational
          background or professional requirements. We do not guarantee any
          specific results or outcomes from using our services. Linkway Learning
          is not responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>Any errors, mistakes, or inaccuracies in the content.</li>
          <li>
            Any personal injury or property damage resulting from your use of
            the Service.
          </li>
          <li>
            Any unauthorised access to or use of our servers or personal/
            financial information stored on them.
          </li>
          <li>
            Any interruptions or stoppages in the transmission to or from the
            Service.
          </li>
          <li>
            Any bugs, viruses, or similar issues transmitted through the
            Service.
          </li>
          <li>
            Any loss or damage resulting from use of content made available
            through the Service.
          </li>
          <li>
            If the services or content do not meet your educational needs.
          </li>
        </ul>
        <Note>
          You use Linkway Learning at your own risk. We don&apos;t promise that
          the service will work perfectly or give you specific results. Linkway
          Learning is not responsible if the website has errors, gets hacked,
          stops working, or doesn&apos;t meet your educational needs.
        </Note>
      </>
    ),
  },

  /* 14 ─ Limitation of Liability ───────────────────────────────── */
  {
    title: "14. Limitation of Liability",
    content: (
      <>
        <p className="mb-3 font-semibold text-gray-200">
          TO THE EXTENT PERMITTED UNDER APPLICABLE LAW, IN NO EVENT WILL LINKWAY
          LEARNING OR ITS OFFICERS, EMPLOYEES, DIRECTORS, SHAREHOLDERS,
          AFFILIATES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING
          BUT NOT LIMITED TO DAMAGES FOR LOSS OF REVENUES, PROFITS, GOODWILL,
          USE, DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE
          SERVICE.
        </p>
        <p className="mb-3 font-semibold text-gray-200">
          TO THE EXTENT PERMITTED UNDER APPLICABLE LAW, LINKWAY LEARNING&apos;S
          TOTAL LIABILITY TO YOU SHALL NOT EXCEED THE AMOUNTS PAID BY YOU TO
          LINKWAY LEARNING FOR THE SERVICE.
        </p>
        <Note>
          Linkway Learning is not responsible for indirect problems or losses
          from using our service, like losing money, job opportunities, or data.
          If Linkway Learning does owe you money, the most we will pay is the
          amount you already paid for the program.
        </Note>
      </>
    ),
  },

  /* 15 ─ Indemnification ───────────────────────────────────────── */
  {
    title: "15. Indemnification",
    content: (
      <>
        <p className="mb-3">
          You agree to protect, defend, and hold harmless Linkway Learning, its
          subsidiaries, affiliates, officers, directors, employees, and agents
          from any claims, liabilities, damages, losses, costs, or fees
          (including reasonable legal fees) arising from:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-3">
          <li>
            Any information you submit, post, or transmit through the Service.
          </li>
          <li>
            Your violation of these Terms or any applicable laws.
          </li>
          <li>
            Your violation of any rights of another person or entity.
          </li>
        </ul>
        <p className="mb-3">
          Linkway Learning reserves the right, at your expense, to assume
          exclusive defence and control of any matter subject to
          indemnification, and you agree to cooperate fully.
        </p>
        <Note>
          If your actions cause someone to take legal action against Linkway
          Learning, you agree to cooperate with us and be responsible for any
          costs or fees that arise.
        </Note>
      </>
    ),
  },

  /* 16 ─ Eligibility ───────────────────────────────────────────── */
  {
    title: "16. Eligibility",
    content: (
      <>
        <p className="mb-3">
          The Linkway Learning Service is not intended for use by individuals
          under the age of 16. If you are under 18 years old, you must have
          verifiable parental or legal guardian consent to use the Service, in
          accordance with the Digital Personal Data Protection Act, 2023.
        </p>
        <p className="mb-3">You confirm that you are either:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>At least 18 years of age, or</li>
          <li>
            Between 16 and 18 years of age with verifiable consent from your
            parent or legal guardian.
          </li>
        </ul>
        <Note>
          You must be at least 16 years old to use Linkway Learning. If
          you&apos;re under 18, you need your parent&apos;s or guardian&apos;s
          permission.
        </Note>
      </>
    ),
  },

  /* 17 ─ Governing Law & Dispute Resolution ────────────────────── */
  {
    title: "17. Governing Law & Dispute Resolution",
    content: (
      <>
        <p className="mb-3">
          These Terms shall be governed by and construed in accordance with the
          laws of India. Any dispute, claim, or controversy arising out of or
          relating to these Terms shall first be attempted to be resolved
          through amicable negotiation between the parties.
        </p>
        <p className="mb-3">
          If the dispute cannot be resolved through negotiation within 30 days,
          it shall be referred to arbitration in accordance with the Arbitration
          and Conciliation Act, 1996 (as amended). The arbitration shall be
          conducted by a sole arbitrator mutually appointed by both parties. The
          seat and venue of arbitration shall be Noida, Uttar Pradesh, India.
          The language of arbitration shall be English.
        </p>
        <p className="mb-3">
          The arbitration award shall be final and binding on both parties and
          may be enforced in any court of competent jurisdiction. Each party
          shall bear its own costs unless the arbitrator directs otherwise.
        </p>
        <p className="mb-3">
          Subject to the arbitration clause above, the courts in Noida, Gautam
          Buddha Nagar, Uttar Pradesh shall have exclusive jurisdiction over any
          legal proceedings arising from these Terms.
        </p>
        <Note>
          If you and Linkway Learning have a legal disagreement, we&apos;ll
          first try to resolve it through discussion. If that doesn&apos;t
          work, the dispute will go to arbitration in Noida under Indian law.
          The courts in Noida will have jurisdiction.
        </Note>
      </>
    ),
  },

  /* 18 ─ Consumer Protection ───────────────────────────────────── */
  {
    title: "18. Consumer Protection & Regulatory Compliance",
    content: (
      <>
        <p className="mb-3">
          Nothing in these Terms shall limit or exclude any rights you may have
          under the Consumer Protection Act, 2019, the Information Technology
          Act, 2000, the Digital Personal Data Protection Act, 2023, or any
          other mandatory consumer protection legislation applicable in India.
        </p>
        <p className="mb-3">
          If any provision of these Terms conflicts with mandatory consumer
          protection laws, the consumer protection laws shall prevail to the
          extent of the conflict.
        </p>
        <Note>
          Your rights under Indian consumer protection laws are always
          protected, even if these Terms say something different. Indian law
          takes priority.
        </Note>
      </>
    ),
  },

  /* 19 ─ Modifications to Terms ────────────────────────────────── */
  {
    title: "19. Modifications to Terms",
    content: (
      <>
        <p className="mb-3">
          Linkway Learning may update these Terms at any time at our sole
          discretion. Any changes will take effect as soon as they are posted on
          this page with an updated effective date. Where material changes are
          made, we will make reasonable efforts to notify you via email or
          through the Service.
        </p>
        <p className="mb-3">
          By continuing to use the Service after changes are posted, you agree
          to the updated Terms. If you do not agree with the changes, please
          stop using the Service and contact us immediately.
        </p>
        <Note>
          These terms may change. If you keep using Linkway Learning after
          changes are posted, it means you agree to the new terms. We&apos;ll
          try to notify you of major changes.
        </Note>
      </>
    ),
  },

  /* 20 ─ Severability & Entire Agreement ───────────────────────── */
  {
    title: "20. Severability & Entire Agreement",
    content: (
      <>
        <p className="mb-3">
          These Terms, along with our Privacy Policy and your Enrolment
          Agreement, represent the complete agreement between you and Linkway
          Learning regarding your use of the Service.
        </p>
        <p className="mb-3">
          If any provision of these Terms is found to be invalid or
          unenforceable by a court of competent jurisdiction, that provision
          shall be enforced to the maximum extent permissible, and the remaining
          provisions shall remain in full force and effect. Linkway
          Learning&apos;s failure to enforce any right or provision of these
          Terms shall not constitute a waiver of that right or provision.
        </p>
        <Note>
          These Terms are the complete rules between you and Linkway Learning.
          If a court finds one part invalid, the rest still applies. If we
          don&apos;t enforce a rule right away, we can still enforce it later.
        </Note>
      </>
    ),
  },

  /* 21 ─ Assignment ────────────────────────────────────────────── */
  {
    title: "21. Assignment",
    content: (
      <>
        <p className="mb-3">
          Linkway Learning may transfer, assign, or delegate its rights and
          obligations under these Terms at any time without your consent. You
          may not assign or transfer your rights under these Terms without
          Linkway Learning&apos;s prior written consent.
        </p>
        <Note>
          Linkway Learning can transfer this agreement to another company. You
          cannot transfer your account or rights without our permission.
        </Note>
      </>
    ),
  },

  /* 22 ─ Grievance Redressal ───────────────────────────────────── */
  {
    title: "22. Grievance Redressal",
    content: (
      <>
        <p className="mb-3">
          In accordance with the Information Technology (Intermediary Guidelines
          and Digital Media Ethics Code) Rules, 2021, and the Consumer
          Protection Act, 2019, Linkway Learning has appointed a Grievance
          Officer to address your concerns.
        </p>
        <p className="mb-3">
          To initiate a grievance or complaint, please follow these steps:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-300 mb-3">
          <li>
            Compose a written complaint outlining the specific nature of the
            issue.
          </li>
          <li>
            Provide a detailed description including any relevant
            circumstances.
          </li>
          <li>Attach any supporting documentation if applicable.</li>
        </ol>
        <p className="mb-3">
          Forward your complaint to:
          <br />
          <strong>Grievance Officer</strong>
          <br />
          Linkway Learning Private Limited
          <br />
          D-23, Sector-59, Noida, Gautam Buddha Nagar &ndash; 201301, Uttar
          Pradesh, India
          <br />
          Email:{" "}
          <a
            href="mailto:grievance@linkwaylearning.com"
            className="text-orange-400 underline hover:text-orange-300"
          >
            grievance@linkwaylearning.com
          </a>
        </p>
        <p className="mb-3">
          We will acknowledge your complaint within 48 hours and provide a
          resolution within 30 days of receipt.
        </p>
        <Note>
          If you have a complaint, email our Grievance Officer at
          grievance@linkwaylearning.com or send a detailed letter. We&apos;ll
          acknowledge it within 48 hours and respond within 30 days.
        </Note>
      </>
    ),
  },

  /* 23 ─ Contact Information ───────────────────────────────────── */
  {
    title: "23. Contact Information",
    content: (
      <>
        <p className="mb-3">You may contact us at:</p>
        <p className="text-gray-300 leading-relaxed">
          <strong>Linkway Learning Private Limited</strong>
          <br />
          D-23, Sector-59, Noida, Gautam Buddha Nagar &ndash; 201301
          <br />
          Uttar Pradesh, India
          <br />
          <br />
          Phone:{" "}
          <a
            href="tel:+919315647113"
            className="text-orange-400 underline hover:text-orange-300"
          >
            +91-93156-47113
          </a>
          <br />
          Email:{" "}
          <a
            href="mailto:support@linkwaylearning.com"
            className="text-orange-400 underline hover:text-orange-300"
          >
            support@linkwaylearning.com
          </a>
          <br />
          General Enquiries:{" "}
          <a
            href="mailto:hello@linkwaylearning.com"
            className="text-orange-400 underline hover:text-orange-300"
          >
            hello@linkwaylearning.com
          </a>
          <br />
          Legal:{" "}
          <a
            href="mailto:legal@linkwaylearning.com"
            className="text-orange-400 underline hover:text-orange-300"
          >
            legal@linkwaylearning.com
          </a>
          <br />
          Data Protection:{" "}
          <a
            href="mailto:privacy@linkwaylearning.com"
            className="text-orange-400 underline hover:text-orange-300"
          >
            privacy@linkwaylearning.com
          </a>
        </p>
      </>
    ),
  },
];

/* ──────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────── */
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-8 px-6 text-center max-w-4xl mx-auto overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/3 w-80 h-80 bg-orange-500/[0.05] rounded-full blur-[120px]" />
          <div className="absolute top-28 right-1/3 w-64 h-64 bg-blue-500/[0.04] rounded-full blur-[100px]" />
        </div>

        <LineMaskReveal delay={0.1} staggerDelay={0.2}>
          <h1 className="text-4xl md:text-5xl font-bold">Terms of Use</h1>
        </LineMaskReveal>
        <div className="mt-6 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
        <p className="mt-4 text-gray-500 text-sm">
          Effective Date: January 30, 2026
        </p>
      </section>

      {/* ── Intro ──────────────────────────────────────────────── */}
      <section className="py-12 px-6 max-w-3xl mx-auto">
        <div className="text-gray-400 leading-relaxed mb-10 space-y-4">
          <p>
            Welcome to Linkway Learning! These Terms of Use
            (&quot;Terms&quot;) explain the rules for using our website,
            platform, and educational programs. Linkway Learning Private
            Limited is a company incorporated under the Companies Act, 2013,
            with its registered office at D-23, Sector-59, Noida, Gautam Buddha
            Nagar &ndash; 201301, Uttar Pradesh, India.
          </p>
          <p>
            When we say &quot;Linkway Learning,&quot; &quot;we,&quot; or
            &quot;us,&quot; we mean Linkway Learning Private Limited and our
            affiliated companies and partners.
          </p>
          <p>
            These Terms apply to your use of the Linkway Learning website,
            educational platform, and any related features, resources, or
            educational programs and courses we offer (collectively, the
            &quot;Linkway Learning Service&quot; or &quot;Service&quot;). By
            creating an account or using the Service, you confirm that you have
            read, understood, and agree to these Terms. If you do not agree,
            please do not use the Service.
          </p>
          <p className="text-sm text-gray-500 italic">
            The highlighted &quot;What this means&quot; boxes below are
            plain-language summaries to help you navigate the Terms. Please read
            the full text — the summaries do not replace the complete agreement.
          </p>
        </div>

        {/* ── Accordion sections ───────────────────────────────── */}
        <div>
          {sections.map((s, i) => (
            <AccordionItem key={i} title={s.title} defaultOpen={i === 0}>
              {s.content}
            </AccordionItem>
          ))}
        </div>
      </section>
    </div>
  );
}
