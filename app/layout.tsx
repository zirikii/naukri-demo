import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./providers";
import { getSession } from "@/lib/auth/getSession";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Naukri";

export const metadata: Metadata = {
  title: {
    default: `${appName} - Jobs in India | Search & Apply`,
    template: `%s | ${appName}`,
  },
  description:
    "Search and apply to jobs from India's largest job portal. Personalised recommendations, profile management, and recruiter messages. (Unofficial demo.)",
  icons: {
    icon: [
      { url: "/brand/favicon.ico", sizes: "any" },
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getSession();

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans">
        <Providers initialUser={user}>{children}</Providers>
      </body>
    </html>
  );
}
