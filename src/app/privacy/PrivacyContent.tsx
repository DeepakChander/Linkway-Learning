"use client";

import { CharacterSplit } from "@/components/animation";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <section className="relative pt-32 pb-8 px-6 text-center max-w-6xl mx-auto overflow-hidden">
        {/* Subtle gradient mesh */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/3 w-80 h-80 bg-orange-500/[0.05] rounded-full blur-[120px]" />
          <div className="absolute top-28 right-1/3 w-64 h-64 bg-blue-500/[0.04] rounded-full blur-[100px]" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">
          <CharacterSplit delay={0.1} staggerDelay={0.03} highlightColor="orange">
            Privacy Policy
          </CharacterSplit>
        </h1>
        {/* Orange accent line */}
        <div className="mt-6 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
        <p className="mt-4 text-gray-500 text-sm">Last updated: 25 September, 2025</p>
      </section>

      <section className="py-12 px-6 max-w-6xl mx-auto">
        <p className="text-gray-400 leading-relaxed mb-12">
          This Privacy Policy explains how we collect, use and protect your
          personal data when you access or use the Linkway Learning Service
          (https://linkwaylearning.com/ and all related web features) (the
          &quot;Service&quot;). It forms part of the Terms of Use you accepted
          (the &quot;Contract&quot;). This Privacy Policy is based on the
          provisions of the data protection laws applicable in India, including
          the Digital Personal Data Protection Act, 2023 (&quot;DPDP
          Act&quot;), the Information Technology Act, 2000 (&quot;IT Act&quot;),
          and the Information Technology (Reasonable Security Practices and
          Procedures and Sensitive Personal Data or Information) Rules, 2011
          (&quot;SPDI Rules&quot;).
        </p>

        {/* Section 1 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            1. Data Fiduciary
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              The &quot;Data Fiduciary&quot; of your personal data under this
              Privacy Policy is the company that operates the Service pursuant
              to the Contract.
            </p>
            <p className="font-semibold text-white">
              Linkway Learning Pvt. Ltd.
            </p>
            <p>
              In this Privacy Policy, we refer to the company as &quot;Linkway
              Learning,&quot; &quot;we,&quot; or &quot;us.&quot;
            </p>
            <p>
              If you have any questions about how we process your personal
              data under this Policy, you can contact us at:
            </p>
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
              You may also contact our Data Protection Officer at:
            </p>
            <p>
              <span className="text-white font-medium">DPO E-mail:</span>{" "}
              <a
                href="mailto:dpo@linkwaylearning.com"
                className="text-orange-400 hover:underline"
              >
                dpo@linkwaylearning.com
              </a>
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            2. Categories of Personal Data Processed
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-6">
            <p>
              The following outlines the categories of personal data we
              collect and process. We collect this information directly from
              you, the data subject (referred to as &quot;Data Principal&quot;
              under the DPDP Act).
            </p>

            <div className="rounded-lg border border-white/10 p-5 space-y-2">
              <h4 className="text-white font-semibold">
                Registration Data{" "}
                <span className="text-gray-500 font-normal">— Users</span>
              </h4>
              <p>
                Personal data we need to collect to create your Linkway
                Learning account:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Full name</li>
                <li>Email</li>
                <li>Phone number</li>
                <li>Address</li>
                <li>Age</li>
                <li>Postal / PIN code</li>
                <li>Other registration / authentication data</li>
              </ul>
            </div>

            <div className="rounded-lg border border-white/10 p-5 space-y-2">
              <h4 className="text-white font-semibold">
                Student Data{" "}
                <span className="text-gray-500 font-normal">— Students</span>
              </h4>
              <p>
                If you participate in a Linkway Learning course, we may
                collect:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Information about your chosen courses</li>
                <li>Your attendance and progress in courses</li>
                <li>Course-related feedback</li>
                <li>Payment status</li>
                <li>Area of interest or profession</li>
                <li>Professional status</li>
                <li>The highest degree or level of education and your field of study</li>
                <li>Gender</li>
                <li>Graduation status</li>
              </ul>
            </div>

            <div className="rounded-lg border border-white/10 p-5 space-y-2">
              <h4 className="text-white font-semibold">
                Other Data{" "}
                <span className="text-gray-500 font-normal">
                  — Users, Students, Website Visitors, Event Participants
                </span>
              </h4>
              <p>
                By using the Service or interacting with Linkway Learning, you
                may choose to provide us with certain personal data. This
                includes contacting our support team or subscribing to
                informational or promotional materials. These actions do not
                require registration.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 p-5 space-y-2">
              <h4 className="text-white font-semibold">
                Cookie Data{" "}
                <span className="text-gray-500 font-normal">
                  — Users, Students, Website Visitors
                </span>
              </h4>
              <p>
                Linkway Learning uses cookies, including web beacons
                (&quot;pixels&quot;), and other tracking codes to improve your
                user experience. Information collected by cookies may include
                browser information, Internet activity, and usage data.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 p-5 space-y-2">
              <h4 className="text-white font-semibold">
                Tutor Data{" "}
                <span className="text-gray-500 font-normal">— Tutors</span>
              </h4>
              <p>
                Information about tutors participating in educational courses:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Full name</li>
                <li>Education level</li>
                <li>City of residence</li>
                <li>Area of interest</li>
                <li>Professional experience</li>
              </ul>
            </div>

            <div className="rounded-lg border border-white/10 p-5 space-y-2">
              <h4 className="text-white font-semibold">
                Graduating Student Data{" "}
                <span className="text-gray-500 font-normal">
                  — Graduating Students
                </span>
              </h4>
              <p>
                Linkway Learning may already have most of this information,
                but some personal data may have changed and need to be
                updated.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            3. Purposes and Legal Bases for Processing
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-6">
            <p>
              We only process your data when we have one of the legal bases
              mentioned below, in accordance with the DPDP Act, the IT Act,
              and the SPDI Rules.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold">
                  3.1. Performance of the Contract
                </h4>
                <p className="mt-1">
                  We may process your personal data to provide you with the
                  Service in accordance with the Contract.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold">
                  3.2. Legitimate Use
                </h4>
                <p className="mt-1">
                  We may process your personal data when we (or a third party)
                  have a legitimate purpose, provided that such processing is
                  necessary and balanced against any potential impact on your
                  rights. We rely on this to:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                  <li>Enhance and personalize our Service</li>
                  <li>Prevent and detect fraud</li>
                  <li>Protect our legal rights and property</li>
                  <li>Improve security and user experience</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold">3.3. Consent</h4>
                <p className="mt-1">
                  We will process your personal data based on your explicit,
                  free, specific, informed, unconditional, and unambiguous
                  consent as required under the DPDP Act. You may withdraw
                  your consent at any time without affecting the lawfulness of
                  any processing carried out before your withdrawal.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold">
                  3.4. Legal or Regulatory Obligations
                </h4>
                <p className="mt-1">
                  When we need to process your personal data to comply with
                  applicable Indian laws.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border border-white/10 rounded-lg">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left p-3 text-white font-semibold">Purpose</th>
                    <th className="text-left p-3 text-white font-semibold">Legal Basis</th>
                    <th className="text-left p-3 text-white font-semibold">Data Categories</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="p-3">Provision of Service</td>
                    <td className="p-3">Performance of Contract</td>
                    <td className="p-3">Registration data, student data</td>
                  </tr>
                  <tr>
                    <td className="p-3">Educational and career opportunities for graduating students</td>
                    <td className="p-3">Consent</td>
                    <td className="p-3">Graduating students&apos; data</td>
                  </tr>
                  <tr>
                    <td className="p-3">Service improvement</td>
                    <td className="p-3">Legitimate Use</td>
                    <td className="p-3">Registration data, student data, other data, cookies</td>
                  </tr>
                  <tr>
                    <td className="p-3">Marketing, promotion, and advertising</td>
                    <td className="p-3">Consent, Legitimate Use</td>
                    <td className="p-3">Other data, student data, registration data, cookies</td>
                  </tr>
                  <tr>
                    <td className="p-3">Security, fraud detection, and prevention</td>
                    <td className="p-3">Legitimate Use</td>
                    <td className="p-3">Other data, student data, registration data, tutor data</td>
                  </tr>
                  <tr>
                    <td className="p-3">Compliance with legal obligations</td>
                    <td className="p-3">Legal or regulatory obligation</td>
                    <td className="p-3">Registration data, student data, other data, cookies, tutor data</td>
                  </tr>
                  <tr>
                    <td className="p-3">Establish, exercise, or defend legal rights</td>
                    <td className="p-3">Legitimate Use</td>
                    <td className="p-3">Registration data, student data, other data, cookies, tutor data</td>
                  </tr>
                  <tr>
                    <td className="p-3">Planning, reports, and business forecasts</td>
                    <td className="p-3">Legitimate Use</td>
                    <td className="p-3">Registration data, student data, other data, cookies, tutor data</td>
                  </tr>
                  <tr>
                    <td className="p-3">Research, surveys, and contests</td>
                    <td className="p-3">Performance of Contract, Legitimate Use, Consent</td>
                    <td className="p-3">Registration data, student and graduating student data, other data, cookies, tutor data</td>
                  </tr>
                  <tr>
                    <td className="p-3">Record video conferences and chat communications</td>
                    <td className="p-3">Legitimate Use, Consent</td>
                    <td className="p-3">Correspondence and calls between users and support team</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            4. How We Share Your Personal Data
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              We may disclose your personal data to the following recipients,
              to the extent required or permitted by applicable law:
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="text-white font-semibold">Tutors and Academic Staff</h4>
                <p>To the extent necessary for them to deliver and support the educational Services.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold">Affiliated Companies</h4>
                <p>Other entities within the Linkway Learning corporate group, solely to enable seamless Service provision.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold">Educational & Career Partners</h4>
                <p>Organizations that help identify and create learning or job opportunities for our students.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold">Service Providers</h4>
                <p>Third-party vendors who support our operations:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 mt-1">
                  <li>IT and technical support</li>
                  <li>Legal advisors and accountants</li>
                  <li>Payment providers</li>
                  <li>Cloud hosting and data storage providers</li>
                  <li>Sales and marketing agencies</li>
                  <li>Analytics providers</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold">Public Authorities</h4>
                <p>When strictly necessary to comply with legal or regulatory obligations, or to respond to formal inquiries from government authorities in India.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold">Financial Institutions</h4>
                <p>Lenders or other financial service providers, where needed to facilitate payments, loans, or related services.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold">Business Transferees</h4>
                <p>In connection with a sale, merger, corporate restructuring, or transfer of all or part of our business, assets, or rights and obligations.</p>
              </div>
            </div>

            <p>
              All third parties listed above may only process your personal
              data for the specific purposes of performing their contractual
              functions and are prohibited from using it for any other purpose.
            </p>

            <div className="rounded-lg border border-white/10 p-5 space-y-2">
              <h4 className="text-white font-semibold">Payment Processing</h4>
              <p>
                When you purchase our courses or other products, you may be
                redirected to external websites operated by our trusted
                payment service providers (e.g., Razorpay, PayU, or other
                RBI-authorized payment gateways). Once your payment is
                completed, we only receive confirmation of the transaction status.
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>We do not collect, access, or store any of your payment details (e.g., card numbers, UPI IDs, bank account information).</li>
                <li>All payment processing is handled directly by the third-party provider under its own privacy policy.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            5. External Links & Third-Party Services
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              Our Service may include links to external websites and platforms
              not operated by Linkway Learning, for example, Zoom and other
              video-conferencing or webinar tools that enable you to attend
              classes online.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <span className="text-white font-medium">Separate Registration:</span>{" "}
                These third-party providers may require you to register independently, and they operate under their own terms and privacy policies.
              </li>
              <li>
                <span className="text-white font-medium">No Control or Responsibility:</span>{" "}
                Linkway Learning does not control, endorse, or assume any liability for the content, privacy practices, or security measures of these external sites and services.
              </li>
              <li>
                <span className="text-white font-medium">Different Privacy Policies:</span>{" "}
                This Privacy Policy does not cover how those third parties collect, use, or share your personal data.
              </li>
            </ul>
            <p className="text-orange-400 font-semibold text-sm mt-4">
              WE STRONGLY RECOMMEND THAT YOU REVIEW THE PRIVACY POLICY OF ANY
              THIRD-PARTY SITE OR SERVICE YOU ACCESS THROUGH OUR SERVICE.
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            6. Data Storage, Transfer, and Protection
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-6">
            <div>
              <h4 className="text-white font-semibold">6.1. Transfers Outside India</h4>
              <p className="mt-2">
                Linkway Learning may transfer, store, and process your
                personal data outside India, including in jurisdictions where
                our subprocessors and service providers operate. In accordance
                with the DPDP Act and any rules notified by the Central
                Government of India, we ensure that your personal data is only
                transferred to countries or territories that are not restricted
                by the Central Government.
              </p>
              <p className="mt-2">Where required, we will implement:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 mt-1">
                <li>Adequate data protection standards as recognized by the Central Government of India</li>
                <li>Written agreements with recipients requiring the same level of protection</li>
                <li>Your consent for transfers where required by applicable law</li>
                <li>Other transfer mechanisms approved under Indian law</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold">6.2. Storage of Personal Data</h4>
              <p className="mt-2">
                We retain your personal data only for as long as necessary to
                fulfill the purposes described in this Privacy Policy, while
                your account is active and for a reasonable period thereafter
                as permitted under applicable Indian law. Once that period
                expires, we will securely delete or irreversibly anonymize your
                personal data in accordance with the DPDP Act.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold">6.3. Data Security</h4>
              <p className="mt-2">
                We implement appropriate physical, technical, and
                organizational safeguards in compliance with the IT Act and SPDI Rules:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                <li><span className="text-white font-medium">Physical controls:</span> Secure facilities and access restrictions</li>
                <li><span className="text-white font-medium">Technical controls:</span> Encryption in transit and at rest, firewalls, intrusion detection, and regular security testing</li>
                <li><span className="text-white font-medium">Organizational controls:</span> Access restricted on a &quot;need-to-know&quot; basis, staff training, and formal security policies</li>
              </ul>
              <p className="mt-2 text-sm">
                While we strive to protect your data, no security measures are
                completely impenetrable. We cannot guarantee that information
                you transmit to us over the Internet will never be intercepted.
              </p>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            7. Rights of Data Principals
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              Under the DPDP Act and other applicable Indian data protection
              laws, you (as a Data Principal) have the following rights:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/10 rounded-lg">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left p-3 text-white font-semibold">Right</th>
                    <th className="text-left p-3 text-white font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="p-3 text-white font-medium align-top">Access Information</td>
                    <td className="p-3">Request confirmation of whether we are processing your personal data, and if so, obtain a summary of the data and processing activities.</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-white font-medium align-top">Correction & Erasure</td>
                    <td className="p-3">Request correction of inaccurate or misleading data, completion of incomplete data, updating of data, and erasure of data no longer necessary for its purpose.</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-white font-medium align-top">Grievance Redressal</td>
                    <td className="p-3">Register a grievance with Linkway Learning regarding any act or omission concerning your personal data.</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-white font-medium align-top">Nomination</td>
                    <td className="p-3">Nominate any other individual who shall, in the event of your death or incapacity, exercise your rights as a Data Principal.</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-white font-medium align-top">Withdraw Consent</td>
                    <td className="p-3">Withdraw consent at any time. Withdrawal shall not affect the lawfulness of processing based on consent before its withdrawal.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              To exercise your rights, contact us at{" "}
              <a href="mailto:support@linkwaylearning.com" className="text-orange-400 hover:underline">support@linkwaylearning.com</a>{" "}
              or our DPO at{" "}
              <a href="mailto:dpo@linkwaylearning.com" className="text-orange-400 hover:underline">dpo@linkwaylearning.com</a>.
            </p>
          </div>
        </div>

        {/* Section 8 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            8. Withdrawal of Consent
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              If our processing relies on your consent, you may withdraw that
              consent at any time without affecting the lawfulness of any
              processing carried out before your withdrawal, as provided under
              the DPDP Act.
            </p>
            <p>To opt out of electronic communications, you can:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Reply &quot;STOP&quot; to any SMS message</li>
              <li>Click the &quot;unsubscribe&quot; link in our emails</li>
              <li>Contact us directly at support@linkwaylearning.com</li>
            </ul>
            <p>
              Upon withdrawal of consent, Linkway Learning shall cease
              processing your personal data, unless retention is required
              under any applicable Indian law.
            </p>
          </div>
        </div>

        {/* Section 9 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            9. Grievance Redressal
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              Under the DPDP Act, you have the right to register grievances
              with us. If you are not satisfied with our response, you may
              file a complaint with the Data Protection Board of India.
            </p>
            <p>
              <span className="text-white font-medium">Grievance Officer / Data Protection Officer:</span>
            </p>
            <p>
              <span className="text-white font-medium">E-mail:</span>{" "}
              <a href="mailto:dpo@linkwaylearning.com" className="text-orange-400 hover:underline">dpo@linkwaylearning.com</a>
            </p>
            <p>
              We will acknowledge your grievance and respond within the
              timelines prescribed under applicable Indian law.
            </p>
          </div>
        </div>

        {/* Section 10 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            10. Necessity of Providing Personal Data
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              We only collect the personal data strictly necessary to deliver
              the Service and to fulfill the purposes described in this
              Privacy Policy.
            </p>
            <p>
              Providing your personal data is voluntary. However, if you
              choose not to provide certain personal data, we may not be able
              to provide you with the full range of our Services.
            </p>
          </div>
        </div>

        {/* Section 11 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            11. Children&apos;s Privacy
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              <span className="text-white font-medium">No Collection from Minors:</span>{" "}
              We do not knowingly collect personal data from anyone under
              eighteen (18) years of age without verifiable consent from a
              parent or lawful guardian, in compliance with the DPDP Act.
            </p>
            <p>
              <span className="text-white font-medium">Under-18 Users:</span>{" "}
              If you are under 18, your parent or lawful guardian must provide
              verifiable consent before you register for our Service or submit
              any personal information. We shall not process personal data
              that is likely to cause any detrimental effect on the well-being
              of a child.
            </p>
            <p>
              <span className="text-white font-medium">Parental Rights:</span>{" "}
              If you are a parent or legal guardian and believe that your child
              under 18 has provided us with personal data without your
              consent, please contact us. We will take steps to delete such
              data promptly.
            </p>
            <p>
              <span className="text-white font-medium">No Tracking of Children:</span>{" "}
              We do not undertake tracking or behavioral monitoring of
              children, or engage in targeted advertising directed at children.
            </p>
          </div>
        </div>

        {/* Section 12 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            12. Duties of Data Principals
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>Under the DPDP Act, Data Principals have the following duties:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Comply with provisions of applicable law while exercising your rights.</li>
              <li>Do not register a false or frivolous grievance or complaint with Linkway Learning or the Data Protection Board of India.</li>
              <li>Furnish only verifiable and authentic information when exercising your right to correction or erasure.</li>
              <li>Comply with all applicable laws in respect of any matter related to this Privacy Policy.</li>
            </ul>
          </div>
        </div>

        {/* Section 13 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            13. Changes to This Privacy Policy
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              We may update this Privacy Policy at any time. If we make
              significant changes, we will notify you by appropriate means
              (for example, via email or a notice on our website).
            </p>
            <p>
              Each time we amend this Policy, the &quot;Last updated&quot;
              date at the top will reflect the change. We recommend checking
              this page periodically. All changes take effect immediately upon
              posting.
            </p>
          </div>
        </div>

        {/* Section 14 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            14. Difficulties in Accessing This Privacy Policy
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              If you have difficulty accessing this Privacy Policy online,
              please contact us. We will provide you, at no cost, with a copy
              of this Policy in an alternative, easy-to-read format.
            </p>
            <p>
              We will not collect or process any additional sensitive personal
              data in connection with your request for an alternative format.
            </p>
          </div>
        </div>

        {/* Section 15 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
            15. India-Specific Privacy Provisions
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-6">
            <div>
              <h4 className="text-white font-semibold">A. Applicability of Indian Data Protection Laws</h4>
              <p className="mt-2">
                This Privacy Policy is drafted in compliance with the Digital
                Personal Data Protection Act, 2023 (&quot;DPDP Act&quot;), the
                Information Technology Act, 2000 (&quot;IT Act&quot;), and the
                Information Technology (Reasonable Security Practices and
                Procedures and Sensitive Personal Data or Information) Rules,
                2011 (&quot;SPDI Rules&quot;).
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold">B. Sensitive Personal Data or Information (SPDI)</h4>
              <p className="mt-2">
                Under the SPDI Rules, &quot;Sensitive Personal Data or Information&quot; includes:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                <li>Passwords</li>
                <li>Financial information (bank account, credit/debit card, or other payment instrument details)</li>
                <li>Physical, physiological, and mental health conditions</li>
                <li>Sexual orientation</li>
                <li>Medical records and history</li>
                <li>Biometric information</li>
              </ul>
              <p className="mt-2">
                Where we collect any Sensitive Personal Data, we will obtain
                your explicit consent prior to collection and ensure compliance
                with the SPDI Rules.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold">C. Data Protection Officer / Grievance Officer</h4>
              <p className="mt-2">
                In compliance with the IT Act and the DPDP Act, Linkway
                Learning has appointed a Data Protection Officer / Grievance Officer.
              </p>
              <p className="mt-2">
                <span className="text-white font-medium">E-mail:</span>{" "}
                <a href="mailto:dpo@linkwaylearning.com" className="text-orange-400 hover:underline">dpo@linkwaylearning.com</a>
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold">D. Data Protection Board of India</h4>
              <p className="mt-2">
                If you are not satisfied with our response to your grievance,
                you have the right to approach the Data Protection Board of
                India in accordance with the DPDP Act.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold">E. Significant Data Fiduciary</h4>
              <p className="mt-2">
                If Linkway Learning is notified as a &quot;Significant Data
                Fiduciary&quot; by the Central Government under the DPDP Act,
                we shall comply with all additional obligations including
                appointing a Data Protection Officer based in India,
                appointing an independent data auditor, conducting periodic
                Data Protection Impact Assessments, and any other obligations
                as may be prescribed.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center space-y-3">
          <h3 className="text-white text-lg font-semibold">Contact Information</h3>
          <p className="text-white font-medium">Linkway Learning Pvt. Ltd.</p>
          <div className="text-gray-400 space-y-1">
            <p>
              <span className="text-white font-medium">E-mail:</span>{" "}
              <a href="mailto:support@linkwaylearning.com" className="text-orange-400 hover:underline">support@linkwaylearning.com</a>
            </p>
            <p>
              <span className="text-white font-medium">DPO E-mail:</span>{" "}
              <a href="mailto:dpo@linkwaylearning.com" className="text-orange-400 hover:underline">dpo@linkwaylearning.com</a>
            </p>
            <p>
              <span className="text-white font-medium">Website:</span>{" "}
              <a href="https://linkwaylearning.com" className="text-orange-400 hover:underline">https://linkwaylearning.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
