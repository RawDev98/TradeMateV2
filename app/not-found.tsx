import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-bg">
      <MainNav />
      <main className="container pt-24 pb-16 flex flex-col items-center justify-center">
        <Logo />
        <div className="glass-card p-8 mt-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="mb-6">Sorry, the page you are looking for doesn't exist or has been moved.</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

