import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { GlobalConfetti } from "@/components/GlobalConfetti";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});


export const metadata: Metadata = {
  title: "Reasons Wall",
  description: "Share your reasons with the world",
  icons: {
    icon: [
      {
        url: "/logo.png",
        href: "/logo.png",
      }
    ],
    apple: [
      {
        url: "/logo.png",
        sizes: "180x180",
        type: "image/png",
      }
    ],
  },
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
          <main>{children}</main>
          <GlobalConfetti />
        </Providers>
      </body>
    </html>
  );
}
