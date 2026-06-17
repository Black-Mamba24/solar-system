import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar System Explorer",
  description: "A bilingual interactive solar system learning website."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
