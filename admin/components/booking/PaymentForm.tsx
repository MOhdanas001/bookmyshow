"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreditCard, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Luhn Algorithm Validation Function
const isValidLuhn = (val: string): boolean => {
  const clean = val.replace(/\s+/g, "");
  if (!/^\d{16}$/.test(clean)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

// Zod Validation Schema
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d{16}$/.test(val), "Card number must be exactly 16 digits")
    .refine(isValidLuhn, "Invalid card number (Failed Luhn check)"),
  cardHolderName: z
    .string()
    .min(2, "Card holder name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only alphabetic characters"),
  expiryDate: z
    .string()
    .min(5, "Expiry date is required")
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry must be in MM/YY format")
    .refine((val) => {
      const parts = val.split("/");
      if (parts.length !== 2) return false;
      const month = parseInt(parts[0], 10);
      const year = 2000 + parseInt(parts[1], 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      return true;
    }, "Card has expired"),
  cvv: z
    .string()
    .min(3, "CVV must be 3 or 4 digits")
    .max(4, "CVV must be 3 or 4 digits")
    .regex(/^\d{3,4}$/, "CVV must contain numbers only"),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  amount: number;
  isSubmitting: boolean;
  onSubmit: (values: PaymentFormValues) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  isSubmitting,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
    defaultValues: {
      cardNumber: "",
      cardHolderName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const handleFillDemoCard = () => {
    setValue("cardNumber", "4111111111111111", { shouldValidate: true });
    setValue("cardHolderName", "Demo User", { shouldValidate: true });
    setValue("expiryDate", "12/30", { shouldValidate: true });
    setValue("cvv", "123", { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-card border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Demo Payment Checkout</h3>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFillDemoCard}
          className="text-xs gap-1.5 border-primary/40 hover:bg-primary/10"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Fill Test Card
        </Button>
      </div>

      <div className="space-y-4">
        {/* Card Number */}
        <div className="space-y-1.5">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="4111 1111 1111 1111"
            maxLength={19}
            {...register("cardNumber")}
            className={errors.cardNumber ? "border-red-500" : ""}
          />
          {errors.cardNumber && (
            <p className="text-xs text-red-500 font-medium">{errors.cardNumber.message}</p>
          )}
        </div>

        {/* Card Holder Name */}
        <div className="space-y-1.5">
          <Label htmlFor="cardHolderName">Card Holder Name</Label>
          <Input
            id="cardHolderName"
            placeholder="Demo User"
            {...register("cardHolderName")}
            className={errors.cardHolderName ? "border-red-500" : ""}
          />
          {errors.cardHolderName && (
            <p className="text-xs text-red-500 font-medium">{errors.cardHolderName.message}</p>
          )}
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
            <Input
              id="expiryDate"
              placeholder="12/30"
              maxLength={5}
              {...register("expiryDate")}
              className={errors.expiryDate ? "border-red-500" : ""}
            />
            {errors.expiryDate && (
              <p className="text-xs text-red-500 font-medium">{errors.expiryDate.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              type="password"
              placeholder="123"
              maxLength={4}
              {...register("cvv")}
              className={errors.cvv ? "border-red-500" : ""}
            />
            {errors.cvv && (
              <p className="text-xs text-red-500 font-medium">{errors.cvv.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full h-11 text-base font-semibold gap-2 shadow-md shadow-primary/20"
        >
          {isSubmitting ? (
            <span>Processing Payment...</span>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Pay ${amount.toFixed(2)} Now</span>
            </>
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        Protected by Redis Distributed Locking & Database Unique Safeguards
      </p>
    </form>
  );
};
