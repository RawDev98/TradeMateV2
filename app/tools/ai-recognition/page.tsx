import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import { MaterialRecognition } from "@/components/tools/material-recognition"

export default function MaterialRecognitionPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <MainNav />
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center justify-center mt-8 mb-12">
          <Logo />
        </div>

        <MaterialRecognition />
      </main>
    </div>
  )
}

