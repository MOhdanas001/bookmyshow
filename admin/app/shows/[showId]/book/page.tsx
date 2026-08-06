"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Ticket, CheckCircle, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeatGrid } from "@/components/booking/SeatGrid";
import { CountdownTimer } from "@/components/booking/CountdownTimer";
import { PaymentForm, type PaymentFormValues } from "@/components/booking/PaymentForm";
import { bookingService } from "@/services/booking.service";
import { showService } from "@/services/show.service";
import type { SeatStatus, SeatLockResponse, BookingResponseData } from "@/types/booking";
import type { Show } from "@/types";
import { toast } from "sonner";

export default function ShowBookingPage() {
  const params = useParams();
  const router = useRouter();
  const showId = Number(params.showId);

  const [show, setShow] = useState<Show | null>(null);
  const [seats, setSeats] = useState<SeatStatus[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocking, setIsLocking] = useState(false);
  const [lockInfo, setLockInfo] = useState<SeatLockResponse | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<BookingResponseData | null>(null);

  // Generate unique session ID for this browser tab
  const [sessionId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      let id = sessionStorage.getItem("bms_session_id");
      if (!id) {
        id = "sess_" + Math.random().toString(36).substring(2, 11);
        sessionStorage.setItem("bms_session_id", id);
      }
      return id;
    }
    return "sess_default";
  });

  const fetchSeats = useCallback(async () => {
    if (!showId) return;
    try {
      const data = await bookingService.getShowSeatMap(showId, sessionId);
      setSeats(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load seat layout");
    }
  }, [showId, sessionId]);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        if (showId) {
          const showData = await showService.getById(String(showId));
          setShow(showData ?? null);
          await fetchSeats();
        }
      } catch (err: any) {
        toast.error("Failed to load show details");
      } finally {
        setIsLoading(false);
      }
    }
    init();

    // Poll seat map every 5 seconds for live status updates
    const pollInterval = setInterval(fetchSeats, 5000);
    return () => clearInterval(pollInterval);
  }, [showId, fetchSeats]);

  const handleToggleSeat = (seatNumber: string) => {
    if (lockInfo) return; // Prevent selection changes once seats are locked
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleLockSeats = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }
    setIsLocking(true);
    try {
      const lockRes = await bookingService.lockSeats(showId, selectedSeats, sessionId);
      setLockInfo(lockRes);
      toast.success(lockRes.message || "Seats locked for 10 minutes!");
      await fetchSeats();
    } catch (err: any) {
      toast.error(err.message || "These seats are currently reserved by another user.");
      await fetchSeats();
    } finally {
      setIsLocking(false);
    }
  };

  const handleUnlockSeats = async () => {
    if (!lockInfo) return;
    try {
      await bookingService.unlockSeats(showId, selectedSeats, sessionId);
      setLockInfo(null);
      setSelectedSeats([]);
      toast.info("Seat reservation released");
      await fetchSeats();
    } catch (err: any) {
      toast.error("Failed to release seats");
    }
  };

  const handleTimerExpire = useCallback(async () => {
    setLockInfo(null);
    setSelectedSeats([]);
    toast.error("Your seat reservation has expired.", {
      description: "Please select seats again to continue booking.",
      duration: 6000,
    });
    await fetchSeats();
  }, [fetchSeats]);

  const handlePaymentSubmit = async (values: PaymentFormValues) => {
    if (!lockInfo) {
      toast.error("Your lock has expired. Please select seats again.");
      return;
    }
    setIsSubmittingPayment(true);
    try {
      const response = await bookingService.confirmBookingAndPay({
        showId,
        seatNumbers: selectedSeats,
        cardNumber: values.cardNumber,
        cardHolderName: values.cardHolderName,
        expiryDate: values.expiryDate,
        cvv: values.cvv,
        sessionId,
      });
      setBookingSuccess(response);
      setLockInfo(null);
      toast.success("Booking confirmed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Payment or seat booking failed. Please try again.");
      await fetchSeats();
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const ticketPrice = show?.ticketPrice ?? 10.0;
  const totalPrice = ticketPrice * selectedSeats.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="max-w-xl mx-auto py-10 space-y-6">
        <div className="bg-card border rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your tickets have been reserved successfully.
            </p>
          </div>

          <div className="bg-secondary/40 border rounded-2xl p-4 text-left space-y-3 font-mono text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-sans">Booking Ref:</span>
              <span className="font-bold text-primary">{bookingSuccess.bookingReference}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-sans">Movie:</span>
              <span className="font-semibold text-foreground font-sans">{bookingSuccess.movieName || show?.movieTitle}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-sans">Theatre:</span>
              <span className="font-semibold text-foreground font-sans">{bookingSuccess.theatreName || show?.theatreName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-sans">Seats:</span>
              <span className="font-bold text-emerald-500">{bookingSuccess.seatNumbers}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground font-sans">Amount Paid:</span>
              <span className="font-bold text-lg text-primary">${bookingSuccess.amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/bookings")}
              className="w-full h-11 font-semibold"
            >
              View My Bookings
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setBookingSuccess(null);
                setSelectedSeats([]);
                fetchSeats();
              }}
              className="w-full h-11 font-semibold"
            >
              Book More Seats
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Ticket className="w-6 h-6 text-primary" />
              {show?.movieTitle ?? "Select Seats"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {show?.theatreName} • {show?.date} {show?.time}
            </p>
          </div>
        </div>

        {lockInfo && (
          <CountdownTimer
            expiresAt={lockInfo.expiresAt}
            onExpire={handleTimerExpire}
          />
        )}
      </div>

      {/* Main Grid & Checkout Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Seat Matrix */}
        <div className="lg:col-span-2 bg-card border rounded-3xl p-6 shadow-sm space-y-6">
          <SeatGrid
            seats={seats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            disabled={!!lockInfo}
          />

          {!lockInfo ? (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              <div>
                <span className="text-xs text-muted-foreground block">Selected Seats</span>
                <span className="font-bold text-base text-primary">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Total Amount</span>
                <span className="font-bold text-lg text-foreground">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                onClick={handleLockSeats}
                disabled={selectedSeats.length === 0 || isLocking}
                className="h-11 px-8 font-semibold gap-2 shadow-md shadow-primary/20"
              >
                {isLocking ? (
                  <span>Locking Seats in Redis...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Lock Seats & Continue</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-amber-500 font-medium text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Seats locked exclusivamente for 10 minutes</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnlockSeats}
                className="text-xs text-red-500 border-red-500/30 hover:bg-red-500/10"
              >
                Release Seats
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Demo Payment Form */}
        <div>
          {lockInfo ? (
            <PaymentForm
              amount={totalPrice}
              isSubmitting={isSubmittingPayment}
              onSubmit={handlePaymentSubmit}
            />
          ) : (
            <div className="bg-card border rounded-2xl p-6 text-center space-y-4 shadow-sm">
              <ShieldCheck className="w-12 h-12 text-muted-foreground/60 mx-auto" />
              <h3 className="font-semibold text-lg">Step 2: Reserve Seats</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Select your seats on the left and click <strong>Lock Seats & Continue</strong>.
                Redis will reserve your seats exclusively for 10 minutes to prevent double booking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
