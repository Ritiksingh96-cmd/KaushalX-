// Importing necessary types and dependencies for the layout
import type { ReactNode } from "react"; // Type for React children
import type { Metadata } from "next"; // Type for Next.js metadata
import { GeistSans } from "geist/font/sans"; // Sans-serif font from Geist
import { GeistMono } from "geist/font/mono"; // Monospace font from Geist
import { Analytics } from "@vercel/analytics/next"; // Vercel analytics for tracking
import { AuthProvider } from "@/components/auth/auth-provider"; // Custom auth provider component
import { ThemeProvider } from "@/components/theme-provider"; // Theme provider for dark/light mode
import { Suspense } from "react"; // React Suspense for handling async rendering
import { MainHeader } from "@/components/navigation/main-header"; // Main header component
import { AIChatTrigger } from "@/components/ai-chat/ai-chat-trigger"; // AI chat trigger component
import "./globals.css"; // Global CSS styles for the application

// Metadata configuration for SEO and social sharing
export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: "KAUSHALX SKILLSWAP - Crypto Skill Exchange Platform",
    template: "%s | KAUSHALX SKILLSWAP", // Dynamic title template for subpages
  },
  description:
    "Earn cryptocurrency by teaching skills on KAUSHALX SKILLSWAP - India's premier blockchain-powered learning platform",
  generator: "KAUSHALX SKILLSWAP", // Identifies the software used to generate the site
  applicationName: "KAUSHALX SKILLSWAP", // Name of the web application
  keywords: [
    "skill exchange",
    "crypto earnings",
    "blockchain learning",
    "education",
    "mentorship",
    "KAUSHALX",
    "SKILLSWAP",
    "India",
    "cryptocurrency",
    "online learning",
  ], // Expanded keywords for better SEO
  authors: [
    { name: "KAUSHALX SKILLSWAP Team", url: "https://kaushalx-skillswap.vercel.app" },
  ], // Author information with URL
  creator: "KAUSHALX SKILLSWAP", // Creator of the site
  publisher: "KAUSHALX SKILLSWAP", // Publisher of the site
  metadataBase: new URL("https://kaushalx-skillswap.vercel.app"), // Base URL for absolute links
  alternates: {
    canonical: "https://kaushalx-skillswap.vercel.app", // Canonical URL to avoid duplicate content
    languages: {
      "en-US": "/en-US", // Support for English language
      "hi-IN": "/hi-IN", // Support for Hindi language (example)
    },
  },
  // Open Graph metadata for social media sharing
  openGraph: {
    title: "KAUSHALX SKILLSWAP - Crypto Skill Exchange Platform",
    description:
      "Earn cryptocurrency by teaching skills on KAUSHALX SKILLSWAP, India's leading blockchain-powered learning platform",
    url: "https://kaushalx-skillswap.vercel.app",
    siteName: "KAUSHALX SKILLSWAP",
    images: [
      {
        url: "/kaushalx-logo.png",
        width: 800,
        height: 600,
        alt: "KAUSHALX SKILLSWAP Logo",
      },
      {
        url: "/indian-woman-developer.png", // Additional image for variety
        width: 1200,
        height: 630,
        alt: "KAUSHALX SKILLSWAP Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Twitter Card metadata for Twitter sharing
  twitter: {
    card: "summary_large_image",
    title: "KAUSHALX SKILLSWAP - Crypto Skill Exchange Platform",
    description:
      "Earn cryptocurrency by teaching skills on KAUSHALX SKILLSWAP, India's blockchain-powered learning platform",
    creator: "@KaushalXSkill", // Example Twitter handle
    images: ["/kaushalx-logo.png", "/indian-woman-developer.png"], // Multiple images for Twitter
  },
  // Robots metadata for search engine crawling
  robots: {
    index: true,
    follow: true,
    noarchive: false, // Allow archiving by search engines
    nosnippet: false, // Allow snippets in search results
    noimageindex: false, // Allow image indexing
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1, // No limit on video preview duration
      "max-image-preview": "large", // Allow large image previews
      "max-snippet": -1, // No limit on snippet length
    },
  },
  // Additional metadata for verification and icons
  icons: {
    icon: "/kaushalx-logo.png", // Favicon
    shortcut: "/kaushalx-logo.png", // Shortcut icon
    apple: "/kaushalx-logo.png", // Apple touch icon
  },
  verification: {
    google: "google-site-verification-code", // Placeholder for Google Search Console
    yandex: "yandex-verification-code", // Placeholder for Yandex verification
  },
  category: "Education Technology", // Category for the website
  other: {
    "theme-color": "#1a73e8", // Theme color for browser UI
    "msapplication-TileImage": "/kaushalx-logo.png", // Windows tile icon
  },
};

// Viewport configuration for responsive design
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: "#1a73e8", // Matches theme color in metadata
};

// RootLayout component: The main layout wrapper for the application
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
      style={{ colorScheme: "dark" }}
    >
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground">
        {/* ThemeProvider for dark/light mode support */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Suspense for handling async rendering with a fallback */}
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            {/* AuthProvider for managing authentication state */}
            <AuthProvider>
              {/* Main header for navigation */}
              <MainHeader />
              {/* Main content area */}
              <main className="min-h-screen">{children}</main>
              {/* AI chat trigger component removed as per request to use header link */}
              <AIChatTrigger />
              {/* Footer (optional, added for structure) */}
              <footer className="py-4 text-center text-sm text-muted-foreground">&copy; 2025 KAUSHALX SKILLSWAP. All rights reserved.</footer>
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
        {/* Vercel analytics for tracking user interactions */}
        <Analytics />
      </body>
    </html>
  );
}