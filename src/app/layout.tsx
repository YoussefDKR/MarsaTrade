import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarsaTrade — Global Seafood Intelligence",
  description:
    "Subscription dashboard for seafood traders: landed cost calculator, price trends, freight rates, and AI-curated multilingual news.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
