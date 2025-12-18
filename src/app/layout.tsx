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
  title: "சாலை அறிவிப்பு | Tamil Nadu Traffic Alerts",
  description: "Hyperlocal traffic intelligence for Tamil Nadu. Get real-time alerts for rallies, festivals, and road closures in Erode, Namakkal, and Salem districts.",
  keywords: ["traffic", "Tamil Nadu", "Erode", "Namakkal", "Salem", "rally", "festival", "road closure", "navigation"],
  openGraph: {
    title: "சாலை அறிவிப்பு - Road Alert",
    description: "Know about rallies, festivals, and road closures BEFORE you leave home. Hyperlocal traffic intelligence for Tamil Nadu.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
