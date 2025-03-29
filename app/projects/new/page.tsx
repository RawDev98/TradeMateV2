import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import { ProjectPlanner } from "@/components/tools/project-planner"
import { getUserFromCookie } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function NewProjectPage() {
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen gradient-bg">
      <MainNav />
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center justify-center mt-8 mb-12">
          <Logo />
          <h2 className="text-2xl font-bold mt-4">Create New Project</h2>
        </div>

        <ProjectPlanner />
      </main>
    </div>
  )
}

