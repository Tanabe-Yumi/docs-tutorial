import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Inter,
  M_PLUS_1p,
  M_PLUS_Rounded_1c,
  Noto_Sans_JP,
  Comic_Relief,
} from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/components/convex-client-provider";

import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mPlus1p = M_PLUS_1p({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--font-m-plus-1p",
});

const mPlusRounded1c = M_PLUS_Rounded_1c({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-m-plus-rounded-1c",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

const lineSeed = localFont({
  src: "./fonts/LINESeedJP-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-line-seed",
});

const consola = localFont({
  src: "./fonts/consola.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-consola",
});

const comicRelief = Comic_Relief({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-comic-relief",
});

export const metadata: Metadata = {
  title: "Collaborative Docs",
  description: "Create documents collaboratively",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${notoSansJp.variable} ${mPlus1p.variable} ${lineSeed.variable} ${mPlusRounded1c.variable} ${consola.variable} ${comicRelief.variable}`}
      >
        <NuqsAdapter>
          <ConvexClientProvider>
            {/* エラー表示用 */}
            <Toaster />
            {children}
          </ConvexClientProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
