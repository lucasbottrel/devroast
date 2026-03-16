import type { Metadata } from "next";
import { AppNavbar } from "@/components/app-navbar";
import { AppTRPCProvider } from "@/trpc/client";
import "./globals.css";

export const metadata: Metadata = {
  title: "devroast",
  description: "Paste your code. Get roasted.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppTRPCProvider>
          <div className="min-h-screen bg-page text-fg">
            <AppNavbar />
            {children}
          </div>
        </AppTRPCProvider>
      </body>
    </html>
  );
}
