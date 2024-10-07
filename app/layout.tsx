import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-inter",
});

const interDisplay = localFont({
  src: [
    {
      path: "./fonts/InterDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/InterDisplay-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-inter-display",
});

export const metadata: Metadata = {
  title: "CVS Health",
  description: "AI-powered content review and optimization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Description no longer than 155 characters */}
        <meta
          name="description"
          content="CVS Health - Enhance content quality with AI-driven review and optimization solutions"
        />
        {/* Product Name */}
        <meta
          name="product-name"
          content="CVS Health - AI-Powered Content Review and Optimization"
        />
        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@cvshealth" />
        <meta
          name="twitter:title"
          content="CVS Health - AI-Powered Content Review and Optimization"
        />
        <meta
          name="twitter:description"
          content="Elevate your content quality with advanced AI technology"
        />
        <meta name="twitter:creator" content="@cvs" />
        {/* Twitter Summary card images must be at least 120x120px */}
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/cvs-innovation-demo-public/cvs-pharmacist-1.png"
        />
        {/* Open Graph data for Facebook */}
        <meta
          property="og:title"
          content="CVS Health - AI-Powered Content Review and Optimization"
        />
        <meta property="og:type" content="Article" />
        <meta property="og:url" content="https://www.cvshealth.com" />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/cvs-innovation-demo-public/cvs-pharmacist-1.png"
        />
        <meta
          property="og:description"
          content="Elevate your content quality with advanced AI technology"
        />
        <meta
          property="og:site_name"
          content="CVS Health - AI-Powered Content Review and Optimization"
        />
        <meta property="fb:admins" content="132951670226590" />
        {/* Open Graph data for LinkedIn */}
        <meta
          property="og:title"
          content="AI-Powered Content Review and Optimization"
        />
        <meta property="og:url" content="https://www.cvshealth.com" />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/cvs-innovation-demo-public/cvs-pharmacist-1.png"
        />
        <meta
          property="og:description"
          content="Elevate your content quality with advanced AI technology"
        />
        {/* Open Graph data for Pinterest */}
        <meta
          property="og:title"
          content="CVS Health - AI-Powered Content Review and Optimization"
        />
        <meta property="og:url" content="https://www.cvshealth.com" />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/cvs-innovation-demo-public/cvs-pharmacist-1.png"
        />
        <meta
          property="og:description"
          content="Elevate your content quality with advanced AI technology"
        />
      </head>
      <body
        className={`${inter.variable} ${interDisplay.variable} bg-theme-n-8 font-sans text-[0.9375rem] leading-[1.5rem] text-theme-primary antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
