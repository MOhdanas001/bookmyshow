"use client";

import React from "react";
import type { SeatStatus } from "@/types/booking";

interface SeatGridProps {
  seats: SeatStatus[];
  selectedSeats: string[];
  onToggleSeat: (seatNumber: string) => void;
  disabled?: boolean;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  selectedSeats,
  onToggleSeat,
  disabled = false,
}) => {
  // Group seats by row (e.g. A, B, C...)
  const rows: { [key: string]: SeatStatus[] } = {};
  seats.forEach((seat) => {
    const rowName = seat.seatNumber.charAt(0);
    if (!rows[rowName]) rows[rowName] = [];
    rows[rowName].push(seat);
  });

  const getSeatColorClass = (seat: SeatStatus, isSelected: boolean) => {
    if (seat.status === "BOOKED") {
      return "bg-red-500/20 border-red-500/40 text-red-400 cursor-not-allowed opacity-60";
    }
    if (seat.status === "LOCKED" && !seat.lockedByCurrentUser) {
      return "bg-amber-500/20 border-amber-500/40 text-amber-500 cursor-not-allowed opacity-75";
    }
    if (isSelected) {
      return "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 scale-105";
    }
    if (seat.status === "LOCKED" && seat.lockedByCurrentUser) {
      return "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/30";
    }
    return "bg-secondary/60 hover:bg-primary/20 border-border text-foreground hover:border-primary/50 cursor-pointer";
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-6">
      {/* Curved Screen Visualization */}
      <div className="w-full max-w-2xl text-center space-y-2">
        <div className="w-full h-3 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-t-full shadow-md shadow-primary/20" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Screen This Way
        </p>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 px-6 py-3 bg-card border rounded-2xl shadow-sm text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md border bg-secondary/60 border-border" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-primary text-primary-foreground border-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-amber-500/20 border border-amber-500/40" />
          <span>Locked / Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-red-500/20 border border-red-500/40" />
          <span>Booked</span>
        </div>
      </div>

      {/* Seat Matrix */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="min-w-[600px] flex flex-col items-center space-y-3">
          {Object.keys(rows).sort().map((rowName) => (
            <div key={rowName} className="flex items-center gap-3">
              <span className="w-6 text-sm font-bold text-muted-foreground text-center">
                {rowName}
              </span>
              <div className="flex items-center gap-2">
                {rows[rowName].map((seat) => {
                  const isSelected = selectedSeats.includes(seat.seatNumber);
                  const isClickable =
                    !disabled &&
                    seat.status !== "BOOKED" &&
                    !(seat.status === "LOCKED" && !seat.lockedByCurrentUser);

                  return (
                    <button
                      key={seat.seatNumber}
                      type="button"
                      disabled={!isClickable}
                      onClick={() => isClickable && onToggleSeat(seat.seatNumber)}
                      title={`Seat ${seat.seatNumber} - ${
                        seat.status === "BOOKED"
                          ? "Booked"
                          : seat.status === "LOCKED"
                          ? seat.lockedByCurrentUser
                            ? "Reserved by You"
                            : "Reserved by another user"
                          : "Available"
                      }`}
                      className={`w-9 h-9 rounded-lg border font-semibold text-xs transition-all duration-150 flex items-center justify-center ${getSeatColorClass(
                        seat,
                        isSelected
                      )}`}
                    >
                      {seat.seatNumber.slice(1)}
                    </button>
                  );
                })}
              </div>
              <span className="w-6 text-sm font-bold text-muted-foreground text-center">
                {rowName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
