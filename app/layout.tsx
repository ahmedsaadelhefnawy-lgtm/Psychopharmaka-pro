import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Psychopharmaka Pro v1 Ahmed",
  description: "AI-gesteuerte Psychopharmaka-App"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="de"><body>{children}</body></html>;
}
