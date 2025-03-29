"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { LogOut, LogIn, Loader2 } from "lucide-react"

export function AuthButton() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in by making a request to the server
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        setIsLoggedIn(response.ok)
      } catch (error) {
        setIsLoggedIn(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      toast({
        title: "Success",
        description: "You have been logged out successfully",
      })

      setIsLoggedIn(false)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render anything during SSR to avoid hydration mismatch
  if (!isClient) {
    return (
      <Button variant="outline" className="rounded-full px-6">
        Loading...
      </Button>
    )
  }

  if (isLoggedIn) {
    return (
      <Button variant="outline" className="rounded-full px-6" onClick={handleLogout} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging out...
          </>
        ) : (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </>
        )}
      </Button>
    )
  }

  return (
    <Button variant="outline" className="rounded-full px-6" asChild>
      <Link href="/auth/login">
        <LogIn className="mr-2 h-4 w-4" />
        Login / Sign Up
      </Link>
    </Button>
  )
}

