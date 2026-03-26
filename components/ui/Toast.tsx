"use client";

import { useEffect } from "react";
import { X, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "error", onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    error: {
      bg: "bg-red-500/15 border-red-500/30",
      icon: <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />,
      text: "text-red-300",
    },
    success: {
      bg: "bg-accent-teal/15 border-accent-teal/30",
      icon: <CheckCircle className="w-4 h-4 text-accent-teal flex-shrink-0" />,
      text: "text-accent-teal",
    },
    info: {
      bg: "bg-accent-cyan/15 border-accent-cyan/30",
      icon: <Info className="w-4 h-4 text-accent-cyan flex-shrink-0" />,
      text: "text-accent-cyan",
    },
  };

  const s = styles[type];

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${s.bg} backdrop-blur-sm animate-slide-in`}
    >
      {s.icon}
      <p className={`text-sm flex-1 ${s.text} leading-relaxed`}>{message}</p>
      <button
        onClick={onClose}
        className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
