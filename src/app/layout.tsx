"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html lang="ko">
      <head></head>
      <body>
        {children}
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}
