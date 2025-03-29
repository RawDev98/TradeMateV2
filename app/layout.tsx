import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TradeMate - Tools for Australian Tradespeople",
  description:
    "Streamlined tools, calculations, and resources for Australian tradespeople",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {/* Optional Clerk Auth Buttons Header */}
            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>

            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
