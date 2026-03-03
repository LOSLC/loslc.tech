import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LOSL-C | Linux & Open Source Lovers Community",
  description:
    "Empowering the next generation of builders through open collaboration. Join the Linux & Open Source Lovers Community.",
  keywords: ["Linux", "Open Source", "Community", "Developers", "FOSS"],
  openGraph: {
    title: "LOSL-C | Linux & Open Source Lovers Community",
    description:
      "Empowering the next generation of builders through open collaboration.",
    url: "https://loslc.tech",
    siteName: "LOSL-C",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOSL-C",
    description: "Linux & Open Source Lovers Community",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
