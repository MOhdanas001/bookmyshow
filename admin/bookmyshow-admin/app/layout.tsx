import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: "BookMyShow Admin",
  description: "Admin dashboard for managing movies, theatres, shows, bookings and users.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <DashboardShell>{children}</DashboardShell>
        </Providers>
      </body>
    </html>
  );
}
