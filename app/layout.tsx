import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CivicAuthProvider } from "@civic/auth-web3/react"; // Added import
import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskFlow - Decentralized Micro-Task Platform",
  description: "Connect, collaborate, and earn on the decentralized web",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CivicAuthProvider  clientId={"0949f8c4-3295-4779-a71a-de8147d0a27f"}> {/* TODO: Replace YOUR_APP_ID with actual App ID */}
            {children}
          </CivicAuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
