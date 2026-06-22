import type { Metadata } from "next";
import { Suspense } from "react";
import { DocumentLanguage } from "@/components/layout/DocumentLanguage";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar System Explorer",
  description: "A bilingual interactive solar system learning website."
};

const documentLanguageScript = `
(() => {
  const applyLanguage = () => {
    const locale = new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "zh-CN";
    document.documentElement.setAttribute("lang", locale);
  };
  const wrapHistory = (method) => {
    const original = window.history[method];
    window.history[method] = function patchedHistoryMethod() {
      const result = original.apply(this, arguments);
      window.setTimeout(applyLanguage, 0);
      return result;
    };
  };
  applyLanguage();
  wrapHistory("pushState");
  wrapHistory("replaceState");
  window.addEventListener("popstate", applyLanguage);
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script dangerouslySetInnerHTML={{ __html: documentLanguageScript }} />
      </head>
      <body>
        <Suspense fallback={null}>
          <DocumentLanguage />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
