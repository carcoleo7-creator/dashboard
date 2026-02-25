import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restaurant Partner Dashboard",
  description: "Operational dashboard for restaurant partners — orders, disputes, and delivery performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-surface-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
