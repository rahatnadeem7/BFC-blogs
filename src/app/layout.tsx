import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "BFC Blogs - More than a club",
    template: "%s | BFC Blogs"
  },
  description: "Dive into matchday drama, player spotlights, and the stories that define the beautiful game.",
  keywords: ["game", "football", "club", "blog", "stories"],
  authors: [{ name: "BFC Team" }],
  creator: "BFC",
  publisher: "BFC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://bfc-blogs.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bfc-blogs.vercel.app",
    title: "BFC Blogs - More than a club",
    description: "Dive into matchday drama, player spotlights, and the stories that define the beautiful game.",
    siteName: "BFC Blogs",
  },
  twitter: {
    card: "summary_large_image",
    title: "BFC Blogs - More than a club",
    description: "Dive into matchday drama, player spotlights, and the stories that define the beautiful game.",
    creator: "@bfc",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
