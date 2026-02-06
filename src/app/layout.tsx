import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google"; // Import JetBrains Mono
import "./globals.css";
import { Providers } from "@/components/Providers";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "PumpFun DJ",
  description: "Degen DJ Audio Visualizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${jetbrainsMono.variable} antialiased bg-black text-[#00ff00] font-mono`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
