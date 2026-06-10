import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "التحرير الكتابي والشفهي",
  description: "موقع تعليمي متخصص في مهارات التحرير الكتابي والشفهي - دروس مباشرة ومسجلة للطلبة والأساتذة والتلاميذ",
  keywords: ["التحرير الكتابي", "التحرير الشفهي", "تعليم", "دروس", "عربي"],
  authors: [{ name: "التحرير الكتابي والشفهي" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
