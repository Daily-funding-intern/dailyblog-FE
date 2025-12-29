import type { Metadata } from "next";
import Footer from "@/components/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head></head>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
