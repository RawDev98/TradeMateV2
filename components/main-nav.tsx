"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AuthButton } from "@/components/auth-button"

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container flex h-16 items-center justify-between">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/category/general"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                General
              </Link>
              <Link
                href="/category/trade"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Trade
              </Link>
              <Link
                href="/category/finance"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Finance
              </Link>
              <Link
                href="/category/identify"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Identify
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex md:gap-10">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/category/general">General</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/category/trade">Trade</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/category/finance">Finance</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/category/identify">Identify</Link>
          </Button>
        </div>

        <AuthButton />
      </div>
    </header>
  )
}

