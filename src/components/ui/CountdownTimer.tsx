"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
    className?: string;
    size?: "sm" | "md";
}

export default function CountdownTimer({ className, size = "md" }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 45 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours--;
                        } else {
                            hours = 23;
                        }
                    }
                }
                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const totalHours = timeLeft.hours + timeLeft.minutes / 60;
    const isUrgent = totalHours < 24;

    return (
        <div className={cn("flex items-center gap-2", className)} aria-label={`${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}>
            <TimeUnit value={timeLeft.hours} label="H" size={size} urgent={isUrgent} />
            <span className={cn("font-bold", isUrgent ? "text-red-500 animate-pulse" : "text-orange-500 animate-pulse")}>:</span>
            <TimeUnit value={timeLeft.minutes} label="M" size={size} urgent={isUrgent} />
            <span className={cn("font-bold", isUrgent ? "text-red-500 animate-pulse" : "text-orange-500 animate-pulse")}>:</span>
            <TimeUnit value={timeLeft.seconds} label="S" size={size} urgent={isUrgent} />
        </div>
    );
}

function TimeUnit({ value, label, size, urgent }: { value: number; label: string; size: "sm" | "md"; urgent: boolean }) {
    return (
        <div className="flex flex-col items-center">
            <div className={cn(
                "text-white font-mono font-bold rounded-md flex items-center justify-center border transition-all duration-300",
                size === "sm" ? "w-8 h-8 text-sm" : "w-10 h-10 text-lg",
                urgent
                    ? "bg-red-900/30 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    : "bg-navy-800 border-white/10"
            )}>
                {value.toString().padStart(2, "0")}
            </div>
            <span className="text-[10px] text-gray-400 mt-0.5">{label}</span>
        </div>
    );
}
