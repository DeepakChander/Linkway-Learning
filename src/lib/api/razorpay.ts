/**
 * Razorpay Payment Link Integration
 *
 * Payment Link: https://rzp.io/rzp/linkwaylearning
 *
 * This implementation handles course purchase redirects to your Razorpay payment link.
 * For per-course pricing or dynamic links, you can update this configuration.
 */

export interface CoursePaymentData {
  courseName: string;
  studentName?: string;
  email?: string;
  phone?: string;
  amount?: number; // in INR
}

export interface PaymentLinkConfig {
  // Base payment link (same for all courses as per requirement)
  baseLink: string;

  // Optional: Per-course pricing if you want to add it later
  coursePricing?: {
    [key: string]: number;
  };
}

// Payment link configuration
const PAYMENT_CONFIG: PaymentLinkConfig = {
  // Your Razorpay payment link (same for all courses)
  baseLink: "https://rzp.io/rzp/linkwaylearning",

  // Optional: Define per-course pricing for future use
  coursePricing: {
    "Data Analytics": 49999,
    "Business Analytics": 49999,
    "Data Science and AI": 59999,
    "Agentic AI & Prompt Engineering": 39999,
    "Investment Banking": 54999,
    "Business Intelligence": 49999,
  },
};

/**
 * Open Razorpay payment link for course purchase
 *
 * SIMPLE VERSION (Current Requirement):
 * Opens the same payment link for all courses
 */
export function openPaymentLink(paymentData?: CoursePaymentData): void {
  const paymentLink = PAYMENT_CONFIG.baseLink;

  // Open payment link in new tab
  window.open(paymentLink, "_blank", "noopener,noreferrer");

  // Optional: Track the payment initiation
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "begin_checkout", {
      currency: "INR",
      value: paymentData?.amount || 0,
      items: [
        {
          item_name: paymentData?.courseName || "Course",
        },
      ],
    });
  }
}

/**
 * ADVANCED VERSION (For Future Enhancement):
 * Create dynamic payment links with pre-filled customer data
 *
 * NOTE: This requires Razorpay API integration with your backend
 * You'll need:
 * 1. Razorpay API Key & Secret
 * 2. Backend API endpoint to create payment links
 * 3. Webhook to handle payment success/failure
 */
export async function createDynamicPaymentLink(
  paymentData: CoursePaymentData
): Promise<{ success: boolean; paymentLink?: string; error?: string }> {
  try {
    // Get course amount
    const amount = paymentData.amount ||
                  PAYMENT_CONFIG.coursePricing?.[paymentData.courseName] ||
                  49999;

    // Call your backend API to create a payment link
    // This endpoint should use Razorpay API to create a payment link
    const response = await fetch("/api/payments/create-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        description: `Enrollment for ${paymentData.courseName}`,
        customer: {
          name: paymentData.studentName,
          email: paymentData.email,
          contact: paymentData.phone,
        },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: true,
        notes: {
          course: paymentData.courseName,
          source: "website",
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment link");
    }

    const data = await response.json();

    return {
      success: true,
      paymentLink: data.short_url || data.payment_link,
    };
  } catch (error) {
    console.error("Error creating payment link:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get course price
 */
export function getCoursePrice(courseName: string): number {
  return PAYMENT_CONFIG.coursePricing?.[courseName] || 49999;
}

/**
 * Format price for display
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * BACKEND API EXAMPLE (Create this at: app/api/payments/create-link/route.ts)
 *
 * This is for the advanced version with dynamic payment links:
 *
 * import Razorpay from 'razorpay';
 * import { NextRequest, NextResponse } from 'next/server';
 *
 * const razorpay = new Razorpay({
 *   key_id: process.env.RAZORPAY_KEY_ID!,
 *   key_secret: process.env.RAZORPAY_KEY_SECRET!,
 * });
 *
 * export async function POST(request: NextRequest) {
 *   try {
 *     const body = await request.json();
 *
 *     const paymentLink = await razorpay.paymentLink.create({
 *       amount: body.amount,
 *       currency: body.currency,
 *       description: body.description,
 *       customer: body.customer,
 *       notify: body.notify,
 *       reminder_enable: body.reminder_enable,
 *       notes: body.notes,
 *       callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
 *       callback_method: 'get'
 *     });
 *
 *     return NextResponse.json(paymentLink);
 *   } catch (error) {
 *     return NextResponse.json(
 *       { error: 'Failed to create payment link' },
 *       { status: 500 }
 *     );
 *   }
 * }
 */
