import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({ 
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "CoachBnB - Find Your Perfect Fitness Coach",
    template: "%s | CoachBnB",
  },
  description: "Connect with certified fitness professionals in your area. In-person or virtual training available. Browse 40+ verified coaches for weight loss, strength training, yoga, HIIT, and more.",
  keywords: ["fitness coach", "personal trainer", "online coaching", "weight loss", "strength training", "yoga", "HIIT", "fitness", "health"],
  authors: [{ name: "CoachBnB" }],
  creator: "CoachBnB",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coachbnb.com",
    siteName: "CoachBnB",
    title: "CoachBnB - Find Your Perfect Fitness Coach",
    description: "Connect with certified fitness professionals in your area. In-person or virtual training available.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CoachBnB - Find Your Perfect Fitness Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoachBnB - Find Your Perfect Fitness Coach",
    description: "Connect with certified fitness professionals in your area.",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
