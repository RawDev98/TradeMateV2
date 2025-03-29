import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import { ProjectPlanner } from "@/components/tools/project-planner"
import { getProject } from "@/lib/actions/project-actions"
import { getUserFromCookie } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/auth/login")
  }

  const { project, error } = await getProject(params.id)

  if (error) {
    return (
      <div className="min-h-screen gradient-bg">
        <MainNav />
        <main className="container pt-24 pb-16">
          <div className="flex flex-col items-center justify-center mt-8 mb-12">
            <Logo />
          </div>

          <Card className="glass-card max-w-2xl mx-auto">
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">Error</h2>
                <p className="text-red-500 mb-6">{error}</p>
                <Button asChild>
                  <Link href="/projects">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Projects
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <MainNav />
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center justify-center mt-8 mb-12">
          <Logo />
          <h2 className="text-2xl font-bold mt-4">Edit Project</h2>
        </div>

        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>

        <ProjectPlanner existingProject={project} />
      </main>
    </div>
  )
}

