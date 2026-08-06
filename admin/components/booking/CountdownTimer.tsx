"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface CountdownTimerProps {
  expiresAt: number; // Epoch timestamp in ms
  onExpire: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiresAt, onExpire }) => {
  const [timeLeftMs, setTimeLeftMs] = useState<number>(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, expiresAt - Date.now());
      setTimeLeftMs(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const totalSeconds = Math.floor(timeLeftMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isUrgent = minutes < 2;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
        isUrgent
          ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse"
          : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 text-red-500" />
      ) : (
        <Clock className="w-4 h-4 text-amber-500" />
      )}
      <span>Reservation Expires In:</span>
      <span className="font-mono text-base font-bold tracking-wider">{formattedTime}</span>
    </div>
  );
};
