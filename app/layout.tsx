import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { copy } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smit Mandavia - Python Developer",
  description:
    "Python Developer specializing in FastAPI, React, PostgreSQL, and real-time systems. Based in Vadodara, India.",
  keywords: [
    "Python Developer",
    "FastAPI",
    "React",
    "Full Stack",
    "Vadodara",
    "GIFT City",
    "Backend Developer",
  ],
  authors: [{ name: "Smit Mandavia" }],
  openGraph: {
    title: "Smit Mandavia - Python Developer",
    description: "Portfolio of Smit Mandavia - Python Developer",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smit Mandavia - Python Developer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased`}>
        <a
          href="#main-content"
          className="sr-only z-[60] rounded-md bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {copy.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
