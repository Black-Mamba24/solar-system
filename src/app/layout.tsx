import type { Metadata } from "next";
import { Suspense } from "react";
import { DocumentLanguage } from "@/components/layout/DocumentLanguage";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar System Explorer",
  description: "A bilingual interactive solar system learning website."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Suspense fallback={null}>
          <DocumentLanguage />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
