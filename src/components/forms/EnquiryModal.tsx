"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { trackEnquiryModalOpen, trackEnquiryFormSubmit, trackEnquiryFormSuccess } from "@/lib/analytics";

/* ─── Context ─── */
interface EnquiryModalContextType {
  openEnquiry: () => void;
  closeEnquiry: () => void;
  isOpen: boolean;
}

const EnquiryModalContext = createContext<EnquiryModalContextType>({
  openEnquiry: () => {},
  closeEnquiry: () => {},
  isOpen: false,
});

export const useEnquiryModal = () => useContext(EnquiryModalContext);

/* ─── Provider ─── */
export function EnquiryModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openEnquiry = useCallback(() => {
    setIsOpen(true);
    trackEnquiryModalOpen();
  }, []);
  const closeEnquiry = useCallback(() => setIsOpen(false), []);

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
    <EnquiryModalContext.Provider value={{ openEnquiry, closeEnquiry, isOpen }}>
      {children}
      <EnquiryModal isOpen={isOpen} onClose={closeEnquiry} />
    </EnquiryModalContext.Provider>
  );
}

/* ─── Field Errors ─── */
interface FieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

/* ─── Modal Component ─── */
function EnquiryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    background: "",
    course: "Data Analytics",
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input on open
  useEffect(() => {
    if (isOpen && formState === "idle") {
      setTimeout(() => firstInputRef.current?.focus(), 300);
    }
  }, [isOpen, formState]);

  // Close on Escape + focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormState("loading");
    trackEnquiryFormSubmit(formData.course);

    try {
      const endpoint = process.env.NODE_ENV === "development"
        ? "/api/leads/submit"
        : "/api/submit-lead.php";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          background: formData.background,
          course: formData.course,
          source: "website_enquiry",
          webhookType: "default",
        }),
      });

      if (response.ok) {
        setFormState("success");
        trackEnquiryFormSuccess(formData.course);
      } else {
        setFormState("idle");
        setErrors({ email: "Submission failed. Please try again." });
      }
    } catch {
      setFormState("idle");
      setErrors({ email: "Network error. Please try again." });
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
    setFormData({ fullName: "", email: "", phone: "", background: "", course: "Data Analytics" });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div role="dialog" aria-modal="true" aria-label="Quick Enquiry" className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={resetAndClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
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
                      className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">We&apos;ve Got Your Details!</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Our counselor will reach out within 24 hours to help you get started.
                    </p>
                    <button
                      onClick={resetAndClose}
                      className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-navy-900 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
                  >
                    {/* Header */}
                    <div className="mb-2">
                      <div className="inline-flex items-center gap-1.5 text-orange-500 mb-3">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-wide uppercase">Quick Enquiry</span>
                      </div>
                      <h3 className="text-xl font-bold text-navy-900">Start Your Data Career</h3>
                      <p className="text-sm text-gray-500 mt-1">Fill in your details and we&apos;ll guide you to the right path.</p>
                    </div>

                    {/* Name & Phone - 2 col */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor="eq-name" className="text-xs font-medium text-gray-600">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          ref={firstInputRef}
                          id="eq-name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => handleChange("fullName", e.target.value)}
                          className={`w-full bg-gray-50 border rounded-lg px-3.5 py-2.5 text-navy-900 text-sm placeholder:text-gray-400 focus:outline-none transition-colors ${
                            errors.fullName ? "border-red-500 focus:border-red-400" : "border-gray-200 focus:border-orange-500"
                          }`}
                          aria-invalid={!!errors.fullName}
                        />
                        {errors.fullName && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.fullName}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="eq-phone" className="text-xs font-medium text-gray-600">
                          Phone <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="eq-phone"
                          type="tel"
                          placeholder="+91"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className={`w-full bg-gray-50 border rounded-lg px-3.5 py-2.5 text-navy-900 text-sm placeholder:text-gray-400 focus:outline-none transition-colors ${
                            errors.phone ? "border-red-500 focus:border-red-400" : "border-gray-200 focus:border-orange-500"
                          }`}
                          aria-invalid={!!errors.phone}
                        />
                        {errors.phone && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.phone}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label htmlFor="eq-email" className="text-xs font-medium text-gray-600">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="eq-email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`w-full bg-gray-50 border rounded-lg px-3.5 py-2.5 text-navy-900 text-sm placeholder:text-gray-400 focus:outline-none transition-colors ${
                          errors.email ? "border-red-500 focus:border-red-400" : "border-gray-200 focus:border-orange-500"
                        }`}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </motion.p>
                      )}
                    </div>

                    {/* Background & Course - 2 col */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor="eq-bg" className="text-xs font-medium text-gray-600">Background</label>
                        <select
                          id="eq-bg"
                          value={formData.background}
                          onChange={(e) => handleChange("background", e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-navy-900 text-sm focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-white">Select</option>
                          <option value="Student" className="bg-white">Student / Fresher</option>
                          <option value="Working Professional" className="bg-white">Working Professional</option>
                          <option value="Career Switcher" className="bg-white">Career Switcher</option>
                          <option value="Other" className="bg-white">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="eq-course" className="text-xs font-medium text-gray-600">Interested In</label>
                        <select
                          id="eq-course"
                          value={formData.course}
                          onChange={(e) => handleChange("course", e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-navy-900 text-sm focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="Data Analytics" className="bg-white">Data Analytics</option>
                          <option value="Business Analytics" className="bg-white">Business Analytics</option>
                          <option value="Data Science and AI" className="bg-white">Data Science and AI</option>
                          <option value="Agentic AI & Prompt Engineering" className="bg-white">Agentic AI & Prompt Engineering</option>
                          <option value="Investment Banking" className="bg-white">Investment Banking</option>
                          <option value="Not Sure" className="bg-white">Not Sure Yet</option>
                        </select>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formState === "loading"}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
                    >
                      {formState === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Submit Enquiry"
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      No spam. Your data is safe with us.
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
