import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "navy" | "orange" | "subtle";
  flip?: boolean;
  className?: string;
}

export default function SectionDivider({ variant = "subtle", flip = false, className }: SectionDividerProps) {
  const colors = {
    navy: "#1B2D4F",
    orange: "#F5892A",
    subtle: "rgba(255,255,255,0.05)",
  };

  return (
    <div className={cn("w-full overflow-hidden", flip && "rotate-180", className)} aria-hidden>
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <path d="M0 60L720 0L1440 60H0Z" fill={colors[variant]} />
      </svg>
    </div>
  );
}
