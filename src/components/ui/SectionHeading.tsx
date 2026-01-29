"use client";

import { cn } from "@/lib/utils";
import { usePageTheme } from "@/lib/theme";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({ label, title, description, align = "center", className }: SectionHeadingProps) {
  const theme = usePageTheme();
  const light = theme === "light";

  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {label && (
        <span className="inline-block text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
          {label}
        </span>
      )}
      <h2 className={cn(
        "text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",
        light ? "text-navy-900" : "text-white"
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          "mt-4 text-lg leading-relaxed",
          light ? "text-gray-600" : "text-gray-400"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
