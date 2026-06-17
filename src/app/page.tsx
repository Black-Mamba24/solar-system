import { HomePage } from "@/components/home/HomePage";
import { parseLocale } from "@/lib/locale";

interface PageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function Page({ searchParams }: PageProps) {
  return <HomePage locale={parseLocale(searchParams?.lang)} />;
}
