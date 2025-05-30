import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CivicAuthProvider } from "@civic/auth-web3/react"; // Added import
import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"
import { Chatbot } from "@/components/custom/chatbot"
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
          <CivicAuthProvider  clientId={process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID || ""}>
            {children}
          </CivicAuthProvider>
          <Toaster />
<Chatbot/>
        </ThemeProvider>
      </body>
    </html>
  )
}
