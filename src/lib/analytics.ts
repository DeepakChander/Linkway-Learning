export const GA_MEASUREMENT_ID = "G-CFSZWKVH23";

type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: string | number | undefined;
};

// Core gtag helper
export function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...(args as Parameters<typeof window.gtag>));
  }
}

// ─── Page View ───
export function trackPageView(url: string) {
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

// ─── Generic Event ───
export function trackEvent({ action, category, label, value, ...rest }: GTagEvent) {
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}

// ═══════════════════════════════════════════════════════════════
// FORM EVENTS
// ═══════════════════════════════════════════════════════════════

export function trackEnquiryModalOpen() {
  trackEvent({
    action: "enquiry_modal_open",
    category: "Lead Generation",
    label: "Enquiry Modal Opened",
  });
}

export function trackEnquiryFormSubmit(course: string) {
  trackEvent({
    action: "enquiry_form_submit",
    category: "Lead Generation",
    label: course,
  });
}

export function trackEnquiryFormSuccess(course: string) {
  trackEvent({
    action: "generate_lead",
    category: "Lead Generation",
    label: course,
  });
}

export function trackContactFormSubmit(course: string) {
  trackEvent({
    action: "contact_form_submit",
    category: "Lead Generation",
    label: course || "Not Selected",
  });
}

export function trackContactFormSuccess(course: string) {
  trackEvent({
    action: "contact_form_success",
    category: "Lead Generation",
    label: course || "Not Selected",
  });
}

// ═══════════════════════════════════════════════════════════════
// PURCHASE / PAYMENT EVENTS
// ═══════════════════════════════════════════════════════════════

export function trackPurchaseModalOpen(course: string) {
  trackEvent({
    action: "purchase_modal_open",
    category: "Enrollment",
    label: course,
  });
}

export function trackPaymentInitiate(course: string, amount: number) {
  trackEvent({
    action: "begin_checkout",
    category: "Enrollment",
    label: course,
    value: amount,
    currency: "INR",
  });
}

export function trackPaymentSuccess(course: string, amount: number) {
  trackEvent({
    action: "purchase",
    category: "Enrollment",
    label: course,
    value: amount,
    currency: "INR",
  });
}

export function trackPaymentFailure(course: string, error: string) {
  trackEvent({
    action: "payment_failure",
    category: "Enrollment",
    label: `${course} - ${error}`,
  });
}

// ═══════════════════════════════════════════════════════════════
// CTA / BUTTON EVENTS
// ═══════════════════════════════════════════════════════════════

export function trackCtaClick(ctaName: string, location: string) {
  trackEvent({
    action: "cta_click",
    category: "CTA",
    label: `${ctaName} - ${location}`,
  });
}

export function trackEnrollClick(location: string, course?: string) {
  trackEvent({
    action: "enroll_click",
    category: "CTA",
    label: course ? `${course} - ${location}` : location,
  });
}

export function trackBookCounsellingClick(location: string) {
  trackEvent({
    action: "book_counselling_click",
    category: "CTA",
    label: location,
  });
}

export function trackExplorCoursesClick(location: string) {
  trackEvent({
    action: "explore_courses_click",
    category: "CTA",
    label: location,
  });
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION EVENTS
// ═══════════════════════════════════════════════════════════════

export function trackNavClick(linkName: string) {
  trackEvent({
    action: "navigation_click",
    category: "Navigation",
    label: linkName,
  });
}

export function trackFooterLinkClick(linkName: string) {
  trackEvent({
    action: "footer_link_click",
    category: "Navigation",
    label: linkName,
  });
}

export function trackSocialClick(platform: string) {
  trackEvent({
    action: "social_click",
    category: "Social",
    label: platform,
  });
}

// ═══════════════════════════════════════════════════════════════
// ENGAGEMENT EVENTS
// ═══════════════════════════════════════════════════════════════

export function trackWhatsAppClick(location: string) {
  trackEvent({
    action: "whatsapp_click",
    category: "Engagement",
    label: location,
  });
}

export function trackStickyBarClick(action: string) {
  trackEvent({
    action: "sticky_bar_click",
    category: "CTA",
    label: action,
  });
}

export function trackPhoneClick() {
  trackEvent({
    action: "phone_click",
    category: "Engagement",
    label: "Footer Phone",
  });
}

export function trackEmailClick() {
  trackEvent({
    action: "email_click",
    category: "Engagement",
    label: "Footer Email",
  });
}

// ═══════════════════════════════════════════════════════════════
// COURSE EVENTS
// ═══════════════════════════════════════════════════════════════

export function trackCourseView(courseName: string) {
  trackEvent({
    action: "view_item",
    category: "Course",
    label: courseName,
  });
}

export function trackCourseCompare() {
  trackEvent({
    action: "course_compare",
    category: "Course",
    label: "Compare Courses Page",
  });
}

// ═══════════════════════════════════════════════════════════════
// TYPE DECLARATION
// ═══════════════════════════════════════════════════════════════

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
