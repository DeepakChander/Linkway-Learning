"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href="https://wa.me/919315647113?text=Hi%20Linkway%20Learning%2C%20I%27m%20interested%20in%20your%20courses"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-20 lg:bottom-6 right-6 z-50",
        "w-14 h-14 rounded-full bg-green-500 hover:bg-green-600",
        "flex items-center justify-center shadow-lg shadow-green-500/30",
        "transition-all duration-500",
        visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
      )}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </a>
  );
}
