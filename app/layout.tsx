import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});


export const metadata: Metadata = {
  title: "Reasons Wall",
  description: "Share your reasons with the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(spaceGrotesk.className, 'min-h-dvh')}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
