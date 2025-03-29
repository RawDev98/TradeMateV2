import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

// This would typically come from a database or API
const categoryData = {
  general: {
    title: "General Tools",
    tools: [
      { name: "Project Planner", image: "/images/general.jpg", href: "/tools/project-planner" },
      { name: "Material Estimator", image: "/images/general.jpg", href: "/tools/material-estimator" },
      { name: "Measurement Converter", image: "/images/general.jpg", href: "/tools/measurement-converter" },
    ],
  },
  trade: {
    title: "Trade Tools",
    tools: [
      { name: "Roof Estimator", image: "/images/trade.jpg", href: "/tools/roof-estimator" },
      { name: "Materials Calculator", image: "/images/trade.jpg", href: "/tools/materials-calculator" },
      { name: "Licensing & Compliance", image: "/images/trade.jpg", href: "/tools/licensing" },
    ],
  },
  finance: {
    title: "Finance Tools",
    tools: [
      { name: "Quote Generator", image: "/images/finance.jpg", href: "/tools/quote-generator" },
      { name: "Job Profit Calculator", image: "/images/finance.jpg", href: "/tools/profit-calculator" },
      { name: "Tax & GST Estimations", image: "/images/finance.jpg", href: "/tools/tax-calculator" },
    ],
  },
  identify: {
    title: "Identify Tools",
    tools: [
      { name: "Photo Library", image: "/images/identify.jpg", href: "/tools/photo-library" },
      { name: "AI Material Recognition", image: "/images/identify.jpg", href: "/tools/ai-recognition" },
      { name: "Asbestos Detection", image: "/images/identify.jpg", href: "/tools/asbestos-detection" },
    ],
  },
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  if (!categoryData[slug as keyof typeof categoryData]) {
    return notFound()
  }

  const category = categoryData[slug as keyof typeof categoryData]

  return (
    <div className="min-h-screen gradient-bg">
      <MainNav />
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center justify-center mt-8 mb-12">
          <Logo />
          <h2 className="text-2xl font-bold mt-4">{category.title}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8">
          {category.tools.map((tool) => (
            <Link key={tool.name} href={tool.href} className="block">
              <div className="category-card glass-card">
                <Image src={tool.image || "/placeholder.svg"} alt={tool.name} fill className="object-cover" />
                <div className="category-label">{tool.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

