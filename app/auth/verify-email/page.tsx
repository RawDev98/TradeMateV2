"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSignUp } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const { signUp, isLoaded } = useSignUp()
  const { toast } = useToast()

  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsVerifying(true)

    try {
      const result = await signUp.attemptEmailAddressVerification({ code })

      if (result.status === "complete") {
        toast({
          title: "Success",
          description: "Your email has been verified. You're now signed in.",
        })

        router.push("/dashboard") // change to your actual post-login page
      } else {
        toast({
          title: "Error",
          description: "Verification incomplete. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Verification error:", error)
      toast({
        title: "Error",
        description:
          error?.errors?.[0]?.message || "Invalid code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleVerify} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground text-center">
          Enter the 6-digit code we sent to your email.
        </p>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={isVerifying}>
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>
    </main>
  )
}
