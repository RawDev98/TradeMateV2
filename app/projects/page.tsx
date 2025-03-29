import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, FolderOpen, Calendar, Users, Clock } from "lucide-react"
import { getProjects } from "@/lib/actions/project-actions"
import { format } from "date-fns"
import { redirect } from "next/navigation"
import { getUserFromCookie } from "@/lib/auth"

export default async function ProjectsPage() {
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/auth/login")
  }

  const { projects, error } = await getProjects()

  return (
    <div className="min-h-screen gradient-bg">
      <MainNav />
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center justify-center mt-8 mb-12">
          <Logo />
          <h2 className="text-2xl font-bold mt-4">Your Projects</h2>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">All Projects</h3>
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>

        {error ? (
          <Card className="glass-card">
            <CardContent className="pt-6">
              <p className="text-center text-red-500">{error}</p>
            </CardContent>
          </Card>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id} className="block">
                <Card className="glass-card h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      {project.clientName ? `Client: ${project.clientName}` : "No client specified"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {project.startDate
                            ? `Started: ${format(new Date(project.startDate), "PP")}`
                            : "No start date"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {project.endDate ? `Due: ${format(new Date(project.endDate), "PP")}` : "No end date"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{project.location || "No location specified"}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Open Project
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">Create your first project to get started</p>
              <Button asChild>
                <Link href="/projects/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

