"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSignIn } from "@clerk/nextjs"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signIn, isLoaded, setActive } = useSignIn()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })

        toast({
          title: "Welcome back!",
          description: "You’re now signed in.",
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "Login error",
          description: "Unexpected response. Try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description:
          error?.errors?.[0]?.message || error.message || "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <MainNav />
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center justify-center mt-8 mb-12">
          <Logo />
        </div>

        <Card className="glass-card max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white/20"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
