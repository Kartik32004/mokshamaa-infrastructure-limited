import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SEWAS CITY - Mokshamaa Infrastructure Limited",
  description:
    "Vishwa ke ek bhi Jain ko khud ka ghar aur naukri-dhanda ke bina nahin rehna chahiye. Serving Jain communities across India for 6+ years.",
  generator: "v0.app",
  keywords: [
    "Mokshamaa Infrastructure",
    "Jain Community",
    "Real Estate",
    "India",
    "Religious",
    "Residential",
    "Commercial",
  ],
  authors: [{ name: "Mokshamaa Infrastructure Limited" }],
  openGraph: {
    title: "SEWAS CITY - Mokshamaa Infrastructure Limited",
    description: "Serving Jain communities across India with comprehensive infrastructure solutions",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hi" className={`${playfairDisplay.variable} ${sourceSans.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
