import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { notFound } from "next/navigation"

// This would typically come from a database or API
const toolsData = {
  "roof-estimator": {
    title: "Roof Estimator",
    description: "Calculate materials needed for your roofing project",
    category: "Trade",
    fields: [
      { name: "length", label: "Roof Length (m)", type: "number" },
      { name: "width", label: "Roof Width (m)", type: "number" },
      { name: "pitch", label: "Roof Pitch (degrees)", type: "number" },
    ],
  },
  "materials-calculator": {
    title: "Materials Calculator",
    description: "Estimate materials needed for construction projects",
    category: "Trade",
    fields: [
      { name: "area", label: "Area (m²)", type: "number" },
      { name: "material", label: "Material Type", type: "text" },
      { name: "thickness", label: "Thickness (mm)", type: "number" },
    ],
  },
  "quote-generator": {
    title: "Quote Generator",
    description: "Create professional quotes for your clients",
    category: "Finance",
    fields: [
      { name: "clientName", label: "Client Name", type: "text" },
      { name: "projectType", label: "Project Type", type: "text" },
      { name: "materials", label: "Materials Cost ($)", type: "number" },
      { name: "labor", label: "Labor Cost ($)", type: "number" },
    ],
  },
  "ai-recognition": {
    title: "AI Material Recognition",
    description: "Identify materials using AI technology",
    category: "Identify",
    fields: [{ name: "photo", label: "Upload Photo", type: "file" }],
  },
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  if (!toolsData[slug as keyof typeof toolsData]) {
    return notFound()
  }

  const tool = toolsData[slug as keyof typeof toolsData]

  return (
    <div className="min-h-screen gradient-bg">
      <MainNav />
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center justify-center mt-8 mb-12">
          <Logo />
        </div>

        <Card className="glass-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{tool.title}</CardTitle>
            <CardDescription>{tool.description}</CardDescription>
            <div className="text-sm text-muted-foreground">Category: {tool.category}</div>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {tool.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.label}
                    className="bg-white/20"
                  />
                </div>
              ))}
              <Button type="submit" className="w-full">
                Calculate
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

