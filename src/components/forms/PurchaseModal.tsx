"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, CheckCircle2, Loader2, AlertCircle, Shield, Clock, IndianRupee } from "lucide-react";
import { openRazorpayCheckout } from "@/lib/api/razorpay";

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
  amount?: string;
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
  const [formState, setFormState] = useState<"idle" | "loading" | "processing" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    amount: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

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
    const amountNum = parseFloat(formData.amount);
    if (!formData.amount.trim() || isNaN(amountNum) || amountNum < 1) {
      newErrors.amount = "Enter a valid amount";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("loading");
    setErrorMessage("");

    try {
      // Submit lead to Formspree (works on static hosting)
      fetch("https://formspree.io/f/xpwdzgkl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          course: courseName,
          amount: formData.amount,
          source: "course_purchase",
        }),
      }).catch(() => {}); // Fire-and-forget, don't block payment

      setFormState("processing");

      // Open Razorpay Checkout
      await openRazorpayCheckout(
        {
          courseName,
          studentName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          amount: parseFloat(formData.amount),
        },
        () => {
          // Payment success
          setFormState("success");
          setTimeout(() => resetAndClose(), 3000);
        },
        (error) => {
          // Payment failed or cancelled
          setErrorMessage(error);
          setFormState("error");
        }
      );
    } catch (error) {
      console.error("Error processing purchase:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setFormState("error");
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
    setFormData({ fullName: "", email: "", phone: "", amount: "" });
    setErrors({});
    setErrorMessage("");
    onClose();
  };

  const handleRetry = () => {
    setFormState("idle");
    setErrorMessage("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Course Enrollment"
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
                {formState === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-8"
                  >
                    <motion.div
                      className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-500 text-sm">
                      Thank you for enrolling in {courseName}. Our team will reach out to you shortly.
                    </p>
                  </motion.div>
                ) : formState === "processing" ? (
                  <motion.div
                    key="processing"
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
                    <h3 className="text-xl font-bold text-navy-900 mb-2">Processing Payment...</h3>
                    <p className="text-gray-500 text-sm">
                      Please complete your payment in the Razorpay window.
                    </p>
                  </motion.div>
                ) : formState === "error" ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-8"
                  >
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">Payment Issue</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {errorMessage || "Something went wrong. Please try again."}
                    </p>
                    <button
                      onClick={handleRetry}
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Try Again
                    </button>
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
                        <CreditCard className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-wide uppercase">Enroll Now</span>
                      </div>
                      <h3 className="text-xl font-bold text-navy-900">{courseName}</h3>
                    </div>

                    {/* Trust indicators */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100">
                      <div className="flex flex-col items-center text-center gap-1">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] text-gray-600 font-medium">100% Secure</span>
                      </div>
                      <div className="flex flex-col items-center text-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] text-gray-600 font-medium">Verified Payment</span>
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

                      {/* Amount Field */}
                      <div className="space-y-1">
                        <label htmlFor="pu-amount" className="text-xs font-medium text-gray-600">
                          Payment Amount <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <IndianRupee className="w-4 h-4" />
                          </div>
                          <input
                            id="pu-amount"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={(e) => handleChange("amount", e.target.value)}
                            className={`w-full bg-gray-50 border rounded-lg pl-9 pr-3.5 py-2.5 text-navy-900 text-sm placeholder:text-gray-400 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                              errors.amount
                                ? "border-red-500 focus:border-red-400"
                                : "border-gray-200 focus:border-orange-500"
                            }`}
                            aria-invalid={!!errors.amount}
                          />
                        </div>
                        {errors.amount && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" /> {errors.amount}
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
