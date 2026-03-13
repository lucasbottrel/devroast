import type { Metadata } from "next";
import { AppNavbar } from "@/components/app-navbar";
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
        <div className="min-h-screen bg-page text-fg">
          <AppNavbar />
          {children}
        </div>
      </body>
    </html>
  );
}
