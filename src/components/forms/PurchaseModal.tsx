"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, CreditCard, CheckCircle2, Loader2, AlertCircle, Sparkles, Shield, Clock } from "lucide-react";
import { openPaymentLink, formatPrice, getCoursePrice } from "@/lib/api/razorpay";

/* ─── Context ─── */
interface PurchaseModalContextType {
  openPurchase: (courseName?: string) => void;
  closePurchase: () => void;
  isOpen: boolean;
  selectedCourse?: string;
}

const PurchaseModalContext = createContext<PurchaseModalContextType>({
  openPurchase: () => {},
  closePurchase: () => {},
  isOpen: false,
});

export const usePurchaseModal = () => useContext(PurchaseModalContext);

/* ─── Provider ─── */
export function PurchaseModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>();

  const openPurchase = useCallback((courseName?: string) => {
    setSelectedCourse(courseName || "Data Analytics");
    setIsOpen(true);
  }, []);

  const closePurchase = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <PurchaseModalContext.Provider value={{ openPurchase, closePurchase, isOpen, selectedCourse }}>
      {children}
      <PurchaseModal isOpen={isOpen} onClose={closePurchase} courseName={selectedCourse} />
    </PurchaseModalContext.Provider>
  );
}

/* ─── Field Errors ─── */
interface FieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

/* ─── Modal Component ─── */
function PurchaseModal({
  isOpen,
  onClose,
  courseName = "Data Analytics",
}: {
  isOpen: boolean;
  onClose: () => void;
  courseName?: string;
}) {
  const [formState, setFormState] = useState<"idle" | "loading" | "redirecting">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const coursePrice = getCoursePrice(courseName);

  // Focus first input on open
  useEffect(() => {
    if (isOpen && formState === "idle") {
      setTimeout(() => firstInputRef.current?.focus(), 300);
    }
  }, [isOpen, formState]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email required";
    }
    if (!formData.phone.trim() || !/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Valid phone number required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("loading");

    try {
      // Submit lead to CRM first
      await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          course: courseName,
          source: "course_purchase",
        }),
      });

      // Show redirecting state
      setFormState("redirecting");

      // Wait a moment for visual feedback
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Open Razorpay payment link
      openPaymentLink({
        courseName,
        studentName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        amount: coursePrice,
      });

      // Close modal after redirect
      setTimeout(() => {
        resetAndClose();
      }, 1500);

    } catch (error) {
      console.error("Error processing purchase:", error);
      setFormState("idle");
      setErrors({ email: "Something went wrong. Please try again." });
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const resetAndClose = () => {
    setFormState("idle");
    setFormData({ fullName: "", email: "", phone: "" });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Course Purchase"
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={resetAndClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Orange accent bar */}
            <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-400" />

            {/* Close button */}
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors z-10 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {formState === "redirecting" ? (
                  <motion.div
                    key="redirecting"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-8"
                  >
                    <motion.div
                      className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-5"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <CreditCard className="w-8 h-8 text-orange-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">Redirecting to Payment...</h3>
                    <p className="text-gray-500 text-sm">
                      Please complete your payment on the Razorpay page.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleProceedToPayment}
                    className="space-y-4"
                    noValidate
                  >
                    {/* Header */}
                    <div className="mb-2">
                      <div className="inline-flex items-center gap-1.5 text-orange-500 mb-3">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-wide uppercase">Enroll Now</span>
                      </div>
                      <h3 className="text-xl font-bold text-navy-900">{courseName}</h3>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-navy-900">{formatPrice(coursePrice)}</span>
                        <span className="text-sm text-gray-500">one-time payment</span>
                      </div>
                    </div>

                    {/* Trust indicators */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100">
                      <div className="flex flex-col items-center text-center gap-1">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] text-gray-600 font-medium">100% Secure</span>
                      </div>
                      <div className="flex flex-col items-center text-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] text-gray-600 font-medium">EMI Available</span>
                      </div>
                      <div className="flex flex-col items-center text-center gap-1">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] text-gray-600 font-medium">Instant Access</span>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label htmlFor="pu-name" className="text-xs font-medium text-gray-600">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          ref={firstInputRef}
                          id="pu-name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => handleChange("fullName", e.target.value)}
                          className={`w-full bg-gray-50 border rounded-lg px-3.5 py-2.5 text-navy-900 text-sm placeholder:text-gray-400 focus:outline-none transition-colors ${
                            errors.fullName
                              ? "border-red-500 focus:border-red-400"
                              : "border-gray-200 focus:border-orange-500"
                          }`}
                          aria-invalid={!!errors.fullName}
                        />
                        {errors.fullName && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" /> {errors.fullName}
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="pu-email" className="text-xs font-medium text-gray-600">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="pu-email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className={`w-full bg-gray-50 border rounded-lg px-3.5 py-2.5 text-navy-900 text-sm placeholder:text-gray-400 focus:outline-none transition-colors ${
                            errors.email
                              ? "border-red-500 focus:border-red-400"
                              : "border-gray-200 focus:border-orange-500"
                          }`}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" /> {errors.email}
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="pu-phone" className="text-xs font-medium text-gray-600">
                          Phone <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="pu-phone"
                          type="tel"
                          placeholder="+91"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className={`w-full bg-gray-50 border rounded-lg px-3.5 py-2.5 text-navy-900 text-sm placeholder:text-gray-400 focus:outline-none transition-colors ${
                            errors.phone
                              ? "border-red-500 focus:border-red-400"
                              : "border-gray-200 focus:border-orange-500"
                          }`}
                          aria-invalid={!!errors.phone}
                        />
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" /> {errors.phone}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formState === "loading"}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-4 cursor-pointer"
                    >
                      {formState === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Proceed to Payment
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      Secure payment via Razorpay. Your data is encrypted and safe.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
