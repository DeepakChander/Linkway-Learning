"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageTheme } from "@/lib/theme";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const theme = usePageTheme();
  const light = theme === "light";

  return (
    <div className={cn("border-b", light ? "border-gray-200" : "border-white/10")}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-5 text-left group cursor-pointer"
      >
        <span className={cn("text-lg font-medium group-hover:text-orange-500 transition-colors", light ? "text-navy-900" : "text-white")}>
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Plus className={cn("w-5 h-5", light ? "text-gray-400" : "text-gray-400")} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className={cn("pb-5 leading-relaxed", light ? "text-gray-600" : "text-gray-400")}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AccordionProps {
  items: { title: string; content: string }[];
  className?: string;
}

export default function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn("divide-y", className)}>
      {items.map((item, i) => (
        <AccordionItem key={i} title={item.title} defaultOpen={i === 0}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
