/**
 * Razorpay Checkout Integration
 *
 * Uses Razorpay Standard Checkout with server-side order creation.
 * Students enter their own payment amount (allows admin-set discounts).
 */

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CheckoutData {
  courseName: string;
  studentName: string;
  email: string;
  phone: string;
  amount: number; // in INR (not paise)
}

/**
 * Load Razorpay checkout script dynamically
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Create a Razorpay order via our backend API
 */
async function createOrder(data: CheckoutData): Promise<{ orderId: string; amount: number; currency: string }> {
  const response = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: data.amount,
      courseName: data.courseName,
      studentName: data.studentName,
      email: data.email,
      phone: data.phone,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create order");
  }

  return response.json();
}

/**
 * Open Razorpay Checkout with the given data
 */
export async function openRazorpayCheckout(
  data: CheckoutData,
  onSuccess: (response: RazorpayResponse) => void,
  onFailure: (error: string) => void
): Promise<void> {
  // Load script
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure("Failed to load payment gateway. Please try again.");
    return;
  }

  // Create order
  const order = await createOrder(data);

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    onFailure("Payment gateway not configured.");
    return;
  }

  // Open checkout
  const options: RazorpayOptions = {
    key: keyId,
    amount: order.amount,
    currency: order.currency,
    name: "Linkway Learning",
    description: `Enrollment - ${data.courseName}`,
    order_id: order.orderId,
    prefill: {
      name: data.studentName,
      email: data.email,
      contact: data.phone,
    },
    theme: {
      color: "#F58220",
    },
    handler: onSuccess,
    modal: {
      ondismiss: () => {
        onFailure("Payment was cancelled.");
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", (response: { error: { description: string } }) => {
    onFailure(response.error.description || "Payment failed. Please try again.");
  });
  rzp.open();

  // GA tracking
  if (typeof window !== "undefined" && "gtag" in window) {
    const w = window as unknown as { gtag: (...args: unknown[]) => void };
    w.gtag("event", "begin_checkout", {
      currency: "INR",
      value: data.amount,
      items: [{ item_name: data.courseName }],
    });
  }
}
